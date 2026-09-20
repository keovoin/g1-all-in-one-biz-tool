import { ID, IDeleteEntity as IDeleteCamshot } from '@gauzy/contracts';
export declare class DeleteCamshotDTO implements IDeleteCamshot {
    /**
     * If true, the camshot will be forcefully deleted, bypassing any soft-delete logic.
     * Optional field, defaults to false if not provided.
     */
    readonly forceDelete?: boolean;
    /**
     * The organization ID associated with the camshot. Optional, must be a valid UUID if provided.
     */
    readonly organizationId?: ID;
    /**
     * The tenant ID associated with the camshot. Optional, must be a valid UUID if provided.
     */
    readonly tenantId?: ID;
}
