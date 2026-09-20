/**
 * Pure helpers for resolving the avatars that ship with the seed.
 *
 * Seeded users, employees and candidates carry `imageUrl: 'assets/images/avatars/<file>'`. That path
 * only resolves inside the Angular Gauzy app, which ships `<base href="/">`; every other client
 * resolves it against whatever route it is on and 404s, because the files live in
 * `apps/gauzy/src/assets/images/avatars/` and are served by no API and no CDN.
 *
 * The seed therefore copies each avatar into the API's public assets and stores a real `ImageAsset`,
 * the same way `createDefaultIssueTypes` already handles task icons. This module holds the decision
 * logic, kept free of TypeORM/config imports so it stays trivially testable.
 */
/** Directory under `apps/api/src/assets/seed` (and under the API public path) holding the avatars. */
export declare const SEED_AVATARS_DIR = "avatars";
/**
 * Returns the bare filename of a seeded avatar reference, or `undefined` when the value is not one.
 *
 * Anything already resolvable on its own — an absolute URL, a protocol-relative URL, or the
 * https://dummyimage.com placeholder a user gets when no avatar was supplied — is left alone,
 * because it is a real avatar rather than a seed asset reference.
 *
 * The result is passed to a file copy, so a value that could escape the flat seed directory
 * (traversal, or any nested path) is refused.
 */
export declare function getSeedAvatarFileName(imageUrl?: string | null): string | undefined;
/**
 * Whether a value can resolve on its own, independent of the page it is rendered on.
 *
 * Absolute (`https:`, `data:`, ...), protocol-relative (`//host/...`) and root-relative (`/...`)
 * values all can. A bare relative path cannot — that is the whole defect this module exists to
 * prevent — so it must never be persisted as a user's `imageUrl`.
 */
export declare function isSelfResolvingImageUrl(url?: string | null): boolean;
/** The parts of a persisted user this decision needs; kept structural so the helper stays pure. */
interface IExistingUserAvatar {
    imageId?: string | null;
    image?: unknown;
    imageUrl?: string | null;
}
/**
 * Whether the seed should create an avatar for this user.
 *
 * `generateDefaultUser` reuses an existing row when it finds one, so re-seeding a persistent database
 * must not replace an avatar the user uploaded themselves — that would both change their profile and
 * orphan the ImageAsset behind it. This mirrors the way the same function already refuses to
 * overwrite an existing password hash.
 *
 * Not every real avatar has an ImageAsset behind it — a social-login user typically carries only the
 * provider's URL, and a user created without one carries the dummy placeholder. Neither is a legacy
 * seed path, so neither may be overwritten either.
 *
 * A user still carrying the old seeded `imageUrl` has no ImageAsset and no usable URL, so they are
 * still given one: that backfill is the entire point of the change.
 */
export declare function shouldSeedAvatar(existingUser?: IExistingUserAvatar | null): boolean;
export {};
