import { AfterViewInit, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'example',
    templateUrl  : './example.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ExampleComponent implements AfterViewInit
{

    @ViewChild('search')
    public searchElementRef: ElementRef;

    address;

    /**
     * Constructor
     */
    constructor()
    {
    }

    ngAfterViewInit()
    {
        const autocomplete = new google.maps.places.SearchBox(this.searchElementRef.nativeElement);
    }

}
