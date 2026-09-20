"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChangelog = void 0;
const changelog_entity_1 = require("./changelog.entity");
const initial_changelog_template_1 = require("./initial-changelog-template");
const createChangelog = async (dataSource) => {
    return await new Promise(async (resolve, reject) => {
        try {
            const changelogs = [];
            const templates = initial_changelog_template_1.INITIAL_CHANGELOG_TEMPLATE;
            for (const item of templates) {
                const changelog = {
                    icon: item.icon,
                    title: item.title,
                    date: item.date,
                    content: item.content,
                    isFeature: item.isFeature,
                    learnMoreUrl: item.learnMoreUrl,
                    imageUrl: item.imageUrl
                };
                changelogs.push(changelog);
            }
            await insertChangelog(dataSource, changelogs);
            resolve(changelogs);
        }
        catch (err) {
            console.log('Error parsing changelog:', err);
            reject(null);
            return;
        }
    });
};
exports.createChangelog = createChangelog;
const insertChangelog = async (dataSource, changelogs) => {
    await dataSource
        .createQueryBuilder()
        .insert()
        .into(changelog_entity_1.Changelog)
        .values(changelogs)
        .execute();
};
//# sourceMappingURL=changelog.seed.js.map