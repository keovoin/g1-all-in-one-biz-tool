import { PermissionsEnum } from '@gauzy/contracts';
export declare const SENSITIVE_RELATIONS_KEY = "SENSITIVE_RELATIONS_CONFIG";
export declare const SENSITIVE_RELATIONS_ROOT_KEY = "SENSITIVE_RELATIONS_ROOT_KEY";
export interface SensitiveRelationConfig {
    [relation: string]: PermissionsEnum | SensitiveRelationConfig | null;
}
export declare const SensitiveRelations: (config: SensitiveRelationConfig, rootKey?: string) => (target: any, key?: any, descriptor?: any) => void;
