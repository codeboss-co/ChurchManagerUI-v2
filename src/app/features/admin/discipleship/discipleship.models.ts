export interface DiscipleshipProgram {
    description?: string;
    id: number;
    name: string;
}

export interface StepDefinition {
    description?: string;
    id: number;
    name: string;
}

export interface DiscipleshipType {
    description?: any;
    id: number;
    name: string;
}

export interface DiscipleshipStep {
    completionDate?: Date;
    status?: string;
    stepDefinition: StepDefinition;
    discipleshipType: DiscipleshipType;
    personId?: number;
}

export interface DiscipleshipProgramDetail {
    program: DiscipleshipProgram;
    discipleshipSteps: DiscipleshipStep[];
}

export type DiscipleshipProgramDetails = DiscipleshipProgramDetail[];