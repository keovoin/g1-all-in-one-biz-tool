import { IChangelogFindInput } from '@gauzy/contracts';
/**
 * Get changelog request DTO validation.
 *
 * The validated object is used directly as a TypeORM `where`, so this DTO is
 * the whitelist: only declare properties that are safe to filter on. The UI
 * sends `isFeature=0|1`, which arrives as a string — hence the transform.
 * Unrecognized values pass through untouched so `@IsBoolean` rejects them
 * instead of silently coercing to `false`.
 */
export declare class ChangelogQueryDTO implements IChangelogFindInput {
    readonly isFeature?: boolean;
}
