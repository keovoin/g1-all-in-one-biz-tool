import { KeyResultDeadlineEnum, KeyResultTypeEnum } from "@gauzy/contracts";
export declare class KeyresultTemplateDTO {
    readonly name: string;
    readonly type: KeyResultTypeEnum;
    readonly unit: string;
    readonly targetValue: number;
    readonly initialValue: number;
    readonly deadline: KeyResultDeadlineEnum;
}
