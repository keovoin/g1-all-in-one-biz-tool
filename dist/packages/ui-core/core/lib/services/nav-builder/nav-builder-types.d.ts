import { ActivatedRoute } from '@angular/router';
import { NbMenuItem } from '@nebular/theme';
import { FeatureEnum, PermissionsEnum } from '@gauzy/contracts';
export type NavMenuBadgeType = 'basic' | 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'control';
export type NavMenuCategory = 'main' | 'settings' | 'workspace';
/**
 * A NavMenuSection is a grouping of links in the main (left-hand side) navigation menu bar.
 */
export interface NavMenuSectionItem extends NbMenuItem {
    id: string;
    menuCategory?: NavMenuCategory;
    class?: string;
    items?: NavMenuSectionItem[];
    onClick?: (event: MouseEvent) => void;
    data: NavMenuItemData;
}
/**
 * Data associated with a NavMenuItem or NavMenuSection.
 */
export interface NavMenuItemData {
    translationKey: string;
    noTranslate?: boolean;
    permissionKeys?: PermissionsEnum[];
    featureKey?: FeatureEnum;
    hide?: () => boolean | boolean;
    add?: string;
}
/**
 * Represents the configuration for navigation menu sections.
 */
export interface NavMenuSectionConfig {
    config: NavMenuSectionItem;
    before?: string;
}
/**
 * Represents the configuration for navigation menu items.
 */
export interface NavMenuItemsConfig {
    config: NavMenuSectionItem;
    sectionId: string;
    before?: string;
}
/**
 * A function or array that represents a router link definition for a NavMenuItem.
 *
 * @description
 * This type defines a function that takes an ActivatedRoute as input and returns an array representing
 * the router link for a NavMenuItem. Alternatively, it can be an array directly representing the router link.
 */
export type RouterLinkDefinition = ((route: ActivatedRoute) => any[]) | any[];
