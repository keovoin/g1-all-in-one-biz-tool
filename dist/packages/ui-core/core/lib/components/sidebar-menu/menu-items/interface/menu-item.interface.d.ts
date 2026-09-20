import { NbMenuItem } from '@nebular/theme';
import { FeatureEnum, PermissionsEnum } from '@gauzy/contracts';
export interface IMenuItemFocusChangeEvent {
    children: IMenuItem;
    parent: IMenuItem;
}
export interface IMenuItem extends NbMenuItem {
    id?: string;
    class?: string;
    data: {
        translationKey: string;
        permissionKeys?: PermissionsEnum[];
        featureKey?: FeatureEnum;
        withOrganizationShortcuts?: boolean;
        hide?: () => boolean;
        add?: string;
    };
}
