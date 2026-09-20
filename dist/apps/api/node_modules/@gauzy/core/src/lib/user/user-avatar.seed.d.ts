import { DataSource } from 'typeorm';
import { ApplicationPluginConfig } from '@gauzy/common';
import { ITenant } from '@gauzy/contracts';
import { ImageAsset } from './../core/entities/internal';
/** A seeded avatar that was copied into the API public assets and stored as an ImageAsset. */
export interface ISeededUserAvatar {
    /** The persisted asset, to be attached to `User.image`. */
    image: ImageAsset;
    /** The resolved absolute URL, to be stored on `User.imageUrl`. */
    url: string;
}
/**
 * Turns a seeded `imageUrl` (`assets/images/avatars/<file>`) into a real ImageAsset.
 *
 * The avatars that ship with the seed used to be written into `User.imageUrl` verbatim. That value
 * only resolves inside the Angular Gauzy app, which serves those files itself under `<base href="/">`;
 * for Ever Teams (Next.js) and every other client it resolved against the current route and 404'd.
 * Copying the file into the API's public assets and storing an ImageAsset puts seeded avatars through
 * exactly the same path as an avatar a user uploads, so every client gets a resolvable absolute URL.
 *
 * Mirrors `createDefaultIssueTypes`, which already does this for task icons in the same seed run.
 * Any failure returns `undefined` so the caller can fall back rather than abort seeding.
 */
export declare const createSeededUserAvatar: (dataSource: DataSource, imageUrl: string | null | undefined, tenant?: ITenant, config?: Partial<ApplicationPluginConfig>) => Promise<ISeededUserAvatar | undefined>;
