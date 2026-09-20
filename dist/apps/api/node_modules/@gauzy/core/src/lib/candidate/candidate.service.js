"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const crud_1 = require("./../core/crud");
const utils_2 = require("./../core/utils");
const context_1 = require("./../core/context");
const database_helper_1 = require("./../database/database.helper");
const type_orm_candidate_repository_1 = require("./repository/type-orm-candidate.repository");
const mikro_orm_candidate_repository_1 = require("./repository/mikro-orm-candidate.repository");
const decorators_1 = require("../core/decorators");
let CandidateService = class CandidateService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmCandidateRepository, mikroOrmCandidateRepository) {
        super(typeOrmCandidateRepository, mikroOrmCandidateRepository);
        this.typeOrmCandidateRepository = typeOrmCandidateRepository;
        this.mikroOrmCandidateRepository = mikroOrmCandidateRepository;
    }
    /**
     *
     * @param input
     * @returns
     */
    async createBulk(input) {
        return Promise.all(input.map((candidate) => {
            candidate.user.tenant = {
                id: candidate.organization.tenantId
            };
            return this.create(candidate);
        }));
    }
    /**
     * Candidate Custom Pagination
     *
     * @param options
     * @returns
     */
    async pagination(options) {
        // This method builds its own query instead of going through the CRUD read methods, so the
        // sink-level check in `CrudService` never runs for it. Assert the sensitive-relation table
        // here too: every tenant-scoped entity exposes an `organization` relation, so a client-supplied
        // `relations` reaches the protected rows from any entity, not only from the ones whose
        // controller mounts `SensitiveRelationsInterceptor`.
        this.assertRelationsPermitted(options);
        try {
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const tenantId = context_1.RequestContext.currentTenantId();
                    const mikroWhere = { tenantId };
                    if ((0, utils_1.isNotEmpty)(options?.where)) {
                        const { where } = options;
                        if ((0, utils_1.isNotEmpty)(where.organizationId)) {
                            mikroWhere.organizationId = where.organizationId;
                        }
                        if ((0, utils_1.isNotEmpty)(where.isArchived) && (0, utils_1.isNotEmpty)(Boolean(JSON.parse(where.isArchived)))) {
                            mikroWhere.isArchived = false;
                        }
                        if ((0, utils_1.isNotEmpty)(where.tags)) {
                            mikroWhere.tags = { id: { $in: where.tags } };
                        }
                        if ((0, utils_1.isNotEmpty)(where.user)) {
                            const userFilter = [];
                            if ((0, utils_1.isNotEmpty)(where.user.name)) {
                                const keywords = where.user.name.split(' ');
                                for (const keyword of keywords) {
                                    userFilter.push({ user: { firstName: { $ilike: `%${keyword}%` } } });
                                    userFilter.push({ user: { lastName: { $ilike: `%${keyword}%` } } });
                                }
                            }
                            if ((0, utils_1.isNotEmpty)(where.user.email)) {
                                userFilter.push({ user: { email: { $ilike: `%${where.user.email}%` } } });
                            }
                            if (userFilter.length > 0) {
                                mikroWhere.$or = userFilter;
                            }
                        }
                    }
                    const [items, total] = await this.mikroOrmRepository.findAndCount(mikroWhere, {
                        ...(options?.relations ? { populate: (0, utils_2.flatten)(options.relations) } : {}),
                        offset: options?.skip ? (options.take || 10) * (options.skip - 1) : 0,
                        limit: options?.take || 10
                    });
                    return { items: items.map((e) => this.serialize(e)), total };
                }
                case utils_2.MultiORMEnum.TypeORM:
                default: {
                    const query = this.typeOrmRepository.createQueryBuilder('candidate');
                    query.setFindOptions({
                        skip: options && options.skip ? options.take * (options.skip - 1) : 0,
                        take: options && options.take ? options.take : 10,
                        ...(options && options.relations
                            ? {
                                relations: (0, utils_2.parseFindOptionsRelations)(options.relations)
                            }
                            : {})
                    });
                    /**
                     * The `join` find-option was removed in TypeORM v1 (passing it throws, which surfaced as a
                     * blanket 400 for every paginated request). Declare the aliases the raw predicates below
                     * rely on explicitly instead.
                     */
                    query.leftJoin(`${query.alias}.user`, 'user');
                    query.where((qb) => {
                        qb.andWhere(new typeorm_1.Brackets((web) => {
                            web.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."tenantId" = :tenantId`), {
                                tenantId: context_1.RequestContext.currentTenantId()
                            });
                            if ((0, utils_1.isNotEmpty)(options.where)) {
                                const { where } = options;
                                if ((0, utils_1.isNotEmpty)(where.organizationId)) {
                                    const { organizationId } = where;
                                    web.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."organizationId" = :organizationId`), {
                                        organizationId
                                    });
                                }
                            }
                        }));
                        if ((0, utils_1.isNotEmpty)(options.where)) {
                            const { where } = options;
                            qb.andWhere(new typeorm_1.Brackets((web) => {
                                if ((0, utils_1.isNotEmpty)(where.isArchived) &&
                                    (0, utils_1.isNotEmpty)(Boolean(JSON.parse(where.isArchived)))) {
                                    web.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."isArchived" = :isArchived`), {
                                        isArchived: false
                                    });
                                }
                            }));
                            qb.andWhere(new typeorm_1.Brackets((web) => {
                                if ((0, utils_1.isNotEmpty)(where.tags)) {
                                    const { tags } = where;
                                    web.andWhere((0, database_helper_1.prepareSQLQuery)(`"tags"."id" IN (:...tags)`), { tags });
                                }
                            }));
                            qb.andWhere(new typeorm_1.Brackets((web) => {
                                if ((0, utils_1.isNotEmpty)(where.user)) {
                                    if ((0, utils_1.isNotEmpty)(where.user.name)) {
                                        const keywords = where.user.name.split(' ');
                                        keywords.forEach((keyword, index) => {
                                            web.orWhere((0, database_helper_1.prepareSQLQuery)(`LOWER("user"."firstName") like LOWER(:keyword_${index})`), {
                                                [`keyword_${index}`]: `%${keyword}%`
                                            });
                                            web.orWhere((0, database_helper_1.prepareSQLQuery)(`LOWER("user"."lastName") like LOWER(:${index}_keyword)`), {
                                                [`${index}_keyword`]: `%${keyword}%`
                                            });
                                        });
                                    }
                                    if ((0, utils_1.isNotEmpty)(where.user.email)) {
                                        const { email } = where.user;
                                        web.orWhere((0, database_helper_1.prepareSQLQuery)(`LOWER("user"."email") like LOWER(:email)`), {
                                            email: `%${email}%`
                                        });
                                    }
                                }
                            }));
                        }
                    });
                    const [items, total] = await query.getManyAndCount();
                    return { items, total };
                }
            }
        }
        catch (error) {
            // Preserve the underlying reason, otherwise the client only ever sees `400 {}`.
            throw new common_1.BadRequestException(error?.message ?? error);
        }
    }
};
exports.CandidateService = CandidateService;
exports.CandidateService = CandidateService = tslib_1.__decorate([
    (0, decorators_1.FavoriteService)(contracts_1.BaseEntityEnum.Candidate),
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_candidate_repository_1.TypeOrmCandidateRepository,
        mikro_orm_candidate_repository_1.MikroOrmCandidateRepository])
], CandidateService);
//# sourceMappingURL=candidate.service.js.map