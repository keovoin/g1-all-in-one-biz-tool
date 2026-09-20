import { DeleteQueryDTO } from '../../shared/dto';
/**
 * Common base DTO with the `forceDelete` flag.
 * If `true`, a hard delete will be performed; otherwise, a soft delete is used.
 * This field is optional and defaults to `false`.
 */
export declare class ForceDeleteBaseDTO<T = any> extends DeleteQueryDTO<T> {
    /**
     * A flag to determine whether to force delete the records.
     * If `true`, a hard delete will be performed; otherwise, a soft delete is used.
     * This field is optional and defaults to `false`.
     */
    readonly forceDelete: boolean;
}
