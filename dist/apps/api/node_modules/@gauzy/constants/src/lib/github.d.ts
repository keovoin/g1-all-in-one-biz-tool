/**
 * Sync tag constants used to categorize synchronization sources.
 */
export declare const SyncTags: {
    readonly GITHUB: "GitHub";
    readonly GAUZY: "Gauzy";
};
/**
 * Type definition for valid sync tag values.
 */
export type SyncTag = (typeof SyncTags)[keyof typeof SyncTags];
