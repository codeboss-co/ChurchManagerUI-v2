export interface DiscipleshipProgram
{
    description?: string;
    id: number;
    name: string;
    category?: string;
    order?: number;
}

export interface StepDefinition
{
    id: number;
    name: string;
    description?: string;
    order?: number;
}

export interface DiscipleshipStep
{
    completionDate?: Date;
    status?: string;
    stepDefinition: StepDefinition;
    personId?: number;
    isComplete: boolean;
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