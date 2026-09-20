import { PermissionsEnum } from '@gauzy/contracts';
/**
 * Reactive `*ngxPermissionsOnly` for React: true while the current user holds `permission`.
 *
 * Reads the same `NgxPermissionsService` the Angular templates use (`permissions$` +
 * `getPermissions()`), so gating decisions are identical between the two dashboard flavours
 * and follow role changes live.
 *
 * @param permission Permission to check.
 */
export declare function usePermission(permission: PermissionsEnum): boolean;
