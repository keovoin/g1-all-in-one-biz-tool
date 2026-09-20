import { DefaultFilter } from 'angular2-smart-table';
import { InviteStatusEnum } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class InviteStatusFilterComponent extends DefaultFilter {
    protected inviteStatuses: InviteStatusEnum[];
    /**
     * Handles the status selection change.
     * When the user clears the selection, value will be null/undefined which resets the filter.
     *
     * @param value - The selected invite status or null/undefined when cleared
     */
    onChange(value: InviteStatusEnum | null | undefined): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<InviteStatusFilterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<InviteStatusFilterComponent, "ga-invite-status-filter", never, {}, {}, never, never, false, never>;
}
