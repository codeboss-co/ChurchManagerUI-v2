import { BirthDate, FullName } from '@features/admin/people';

export interface DiscipleshipProgram
{
    description?: string;
    id: number;
    name: string;
    category?: string;
    order?: number;
    iconCssClass?: string;
    createdDate: Date;
    modifiedDate?: Date;
}

export interface StepDefinition
{
    id: number;
    name: string;
    description?: string;
    order?: number;
    allowMultiple?: boolean;
    iconCssClass?: string;
    statistics?: Statistics;
}

export interface DiscipleshipStep
{
    completionDate?: Date;
    startDateTime?: Date;
    endDateTime?: Date;
    status?: string;
    stepDefinition: StepDefinition;
    personId?: number;
    isComplete: boolean;
    // Optional
    person?: DiscipleshipPerson;
}

export interface DiscipleshipProgramSummary
{
    program: DiscipleshipProgram;
    stepDefinitions: StepDefinition[];
}

export interface DiscipleshipProgramForPerson
{
    program: DiscipleshipProgram;
    steps: DiscipleshipStep[];
    checkProgramComplete(): boolean;
}

export type DiscipleshipProgramsForPerson = DiscipleshipProgramForPerson[];

export class DiscipleshipProgramDetailModel
{
    program: DiscipleshipProgram;
    steps: DiscipleshipStep[];

    constructor(model?: Partial<DiscipleshipProgramForPerson>)
    {
        Object.assign(this, model);
    }

    checkProgramComplete(): boolean {
        return this.steps?.find(x => !x.isComplete) === undefined;
    }
}

export interface Statistics {
    started: number;
    completed: number;
}


export interface DiscipleshipPerson {
    personId: number;
    fullName: FullName;
    gender: string;
    ageClassification: string;
    photoUrl: string;
    birthDate: BirthDate;
}