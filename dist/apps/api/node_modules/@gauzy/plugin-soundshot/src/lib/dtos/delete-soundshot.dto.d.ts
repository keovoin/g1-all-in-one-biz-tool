import { ID, IDeleteEntity as IDeleteSoundshot } from '@gauzy/contracts';
export declare class DeleteSoundshotDTO implements IDeleteSoundshot {
    /**
     * If true, the soundshot will be forcefully deleted, bypassing any soft-delete logic.
     * Optional field, defaults to false if not provided.
     */
    readonly forceDelete?: boolean;
    /**
     * The organization ID associated with the soundshot. Optional, must be a valid UUID if provided.
     */
    readonly organizationId?: ID;
    /**
     * The tenant ID associated with the soundshot. Optional, must be a valid UUID if provided.
     */
    readonly tenantId?: ID;
}
