"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSeededUserAvatar = void 0;
const path = require("path");
const config_1 = require("@gauzy/config");
const contracts_1 = require("@gauzy/contracts");
const internal_1 = require("./../core/entities/internal");
const file_storage_1 = require("./../core/file-storage");
const utils_1 = require("./../core/seeds/utils");
const user_avatar_1 = require("./user-avatar");
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
const createSeededUserAvatar = async (dataSource, imageUrl, tenant, config = (0, config_1.getConfig)()) => {
    const fileName = (0, user_avatar_1.getSeedAvatarFileName)(imageUrl);
    if (!fileName)
        return undefined;
    try {
        // Copy the avatar out of the seed directory into the API's public assets.
        const storagePath = (0, utils_1.copyAssets)(fileName, config, user_avatar_1.SEED_AVATARS_DIR);
        if (!storagePath)
            return undefined;
        // Resolve where that public directory actually is, the same way the issue-type seed does.
        const isDist = __dirname.includes('dist');
        const publicDir = isDist
            ? path.resolve(process.cwd(), 'apps/api/public')
            : path.resolve(__dirname, '../../../apps/api/public');
        const assetPublicPath = config_1.environment.isElectron
            ? path.resolve(config_1.environment.gauzyUserPath, 'public')
            : config.assetOptions?.assetPublicPath || publicDir;
        const { height, width, size } = await (0, utils_1.getImageDimensions)(path.join(assetPublicPath, storagePath));
        // `copyAssets` returns a `path.join` result, so on Windows it is backslash-separated. A storage
        // key is part of a URL and must always use forward slashes.
        const storageKey = storagePath.split(path.sep).join('/');
        // Resolve the absolute URL BEFORE persisting anything, so a failure here cannot leave an
        // ImageAsset row behind that nothing references. The URL is also stored on `imageUrl` so the
        // column is usable on its own, without a reader having to load the `image` relation.
        const store = new file_storage_1.FileStorage().setProvider(contracts_1.FileStorageProviderEnum.LOCAL).getProviderInstance();
        const url = await store.url(storageKey);
        if (!url)
            return undefined;
        const asset = new internal_1.ImageAsset();
        asset.name = fileName;
        asset.url = storageKey;
        asset.storageProvider = contracts_1.FileStorageProviderEnum.LOCAL;
        asset.height = height;
        asset.width = width;
        asset.size = size;
        if (tenant)
            asset.tenant = tenant;
        const image = await dataSource.getRepository(internal_1.ImageAsset).save(asset);
        return { image, url };
    }
    catch (error) {
        console.error(`Error while seeding avatar "${fileName}":`, error?.message);
        return undefined;
    }
};
exports.createSeededUserAvatar = createSeededUserAvatar;
//# sourceMappingURL=user-avatar.seed.js.map