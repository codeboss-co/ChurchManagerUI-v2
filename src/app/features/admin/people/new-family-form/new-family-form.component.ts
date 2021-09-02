import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PersonFormDialogComponent } from './person-form/person-form-dialog.component';
import { fuseAnimations } from '@fuse/animations';
import { FamilyMember, NewFamilyForm, PersonBasicDetailsForm } from './person-form/person-form.model';
import { MatExpansionPanel } from '@angular/material/expansion';
import { BehaviorSubject } from 'rxjs';
import { PeopleDataService } from '../_services/people-data.service';
import { first } from 'rxjs/operators';
import { MatStepper } from '@angular/material/stepper';
import { ToastrService } from '@core/notifications/toastr.service';
import { AddressFormValue } from '@ui/controls/address-editor-control/address-editor.model';

@Component({
    selector     : 'people-family-form-dialog',
    templateUrl  : './new-family-form.component.html',
    styleUrls    : ['./new-family-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
    viewProviders: [MatExpansionPanel] // <----- Here
})
export class NewFamilyFormComponent {

    @ViewChild( MatStepper, { static: true } ) stepper: MatStepper;

    dialogRef: any;

    addressFormStep1: FormGroup;
    familyFormStep2: FormGroup;

    familyMembers$ = new BehaviorSubject<FamilyMember[]>([]);

    constructor(
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private _data: PeopleDataService,
        private _toastr: ToastrService)
    {
        this.familyFormStep2 = this.createForm();

        // Address Stepper form step
        this.addressFormStep1 = this._formBuilder.group({
            address: [null, Validators.required],
        });
    }

    /**
     * Create new family form
     *
     * @returns {FormGroup}
     */
    createForm(): FormGroup
    {
        return this._formBuilder.group({
            familyName:  ['', Validators.required],
            members: this._formBuilder.array([], Validators.required)
        });
    }

    newPerson()
    {
        this.dialogRef = this._matDialog.open(PersonFormDialogComponent, {
            panelClass: 'person-form-dialog',
            data      : {
                action: 'new',
                familyName: this.familyFormStep2.get('familyName').value
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FamilyMember) => {
                if ( !response )
                {
                    return;
                }

                // Do something here
                this._addFamilyMember(response);
            });
    }

    /*
     * Access to the Groups Members Form item
     */
    public get familyMembersFormArray(): FormArray
    {
        return this.familyFormStep2.get('members') as FormArray;
    }

    // Adds a new Family Member Form Array items
    private _addFamilyMember(model: FamilyMember)
    {
        console.log('_addFamilyMember', model, '');
        this.familyMembersFormArray.push(this._formBuilder.control(model));
        // We need to create a new reference for OnPush to work on the other side
        const updated = [...this.familyMembers$.getValue(), model];
        this.familyMembers$.next(updated);
    }

    saveFamily()
    {
        const address = this.addressFormStep1.get('address').value;
        const familyName = this.familyFormStep2.get('familyName').value;
        const members = this.familyMembers$.getValue();

        const family: NewFamilyForm = { familyName, address, members };

        this._data.addNewFamily$(family)
            .pipe(first())
            .subscribe(_ => {
                this._toastr.success('Successfully added new family.', null, {duration: 5000});
            });

        // This resets all controls and lists
        this.resetAddress();
        this.familyFormStep2.reset();
        this.familyMembers$.next([]);
        this.stepper.reset();
        console.log('familyMembers', this.familyMembers$.getValue(), 'saveFamily');

    }

    resetAddress() {
        const address: AddressFormValue = {
            city: '',
            country: 'South Africa',
            postalCode: '',
            province: '',
            street: ''
        };
        this.addressFormStep1.setValue({address});
    }
}
