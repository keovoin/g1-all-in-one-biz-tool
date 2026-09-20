"use strict";
var ChangelogService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangelogService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@gauzy/core");
const type_orm_changelog_repository_1 = require("./repository/type-orm-changelog.repository");
const mikro_orm_changelog_repository_1 = require("./repository/mikro-orm-changelog.repository");
let ChangelogService = ChangelogService_1 = class ChangelogService extends core_1.CrudService {
    constructor(typeOrmChangelogRepository, mikroOrmChangelogRepository) {
        super(typeOrmChangelogRepository, mikroOrmChangelogRepository);
    }
    /**
     * GET changelog entries for the public consumers, newest first.
     *
     * Ordering lives here, not in the clients: the seeded rows all share one
     * creation date, so without `date DESC` the display order was whatever the
     * database felt like returning.
     *
     * @param where filter (e.g. `{ isFeature: true }`), already validated/whitelisted by the controller
     * @returns
     */
    async findAllChangelogs(where) {
        // An absent query param can still surface as an `undefined`-valued key,
        // which TypeORM must never see in a `where`.
        const filter = Object.fromEntries(Object.entries(where ?? {}).filter(([, value]) => value !== undefined));
        return await this.findAll({
            ...(Object.keys(filter).length ? { where: filter } : {}),
            order: { date: 'DESC', createdAt: 'DESC' },
            take: ChangelogService_1.MAX_PUBLIC_ITEMS
        });
    }
};
exports.ChangelogService = ChangelogService;
/**
 * Upper bound for the public listing. The endpoint is unauthenticated and
 * the consumers (What's New sidebar, login/register panels) only ever show
 * a handful of entries, so an unbounded SELECT is all downside.
 */
ChangelogService.MAX_PUBLIC_ITEMS = 20;
exports.ChangelogService = ChangelogService = ChangelogService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_changelog_repository_1.TypeOrmChangelogRepository,
        mikro_orm_changelog_repository_1.MikroOrmChangelogRepository])
], ChangelogService);
//# sourceMappingURL=changelog.service.js.map