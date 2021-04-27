export interface DiscipleshipProgram
{
    description?: string;
    id: number;
    name: string;
}

export interface StepDefinition
{
    description?: string;
    id: number;
    name: string;
}

export interface DiscipleshipType
{
    description?: any;
    id: number;
    name: string;
}

export interface DiscipleshipStep
{
    completionDate?: Date;
    order?: number;
    status?: string;
    stepDefinition: StepDefinition;
    discipleshipType: DiscipleshipType;
    personId?: number;
}

export interface DiscipleshipProgramDetail
{
    program: DiscipleshipProgram;
    steps: DiscipleshipStep[];
    checkProgramComplete(): boolean;
}

export type DiscipleshipProgramDetails = DiscipleshipProgramDetail[];

export class DiscipleshipProgramDetailModel
{
    program: DiscipleshipProgram;
    steps: DiscipleshipStep[];

    constructor(model?: Partial<DiscipleshipProgramDetail>)
    {
        Object.assign(this, model);
    }

    checkProgramComplete(): boolean {
        return this.steps?.find(x => x.status !== 'Completed') === undefined;
    }
}