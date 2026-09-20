"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const moment = require("moment");
const core_1 = require("@gauzy/core");
const mikro_orm_proposal_repository_1 = require("./repository/mikro-orm-proposal.repository");
const type_orm_proposal_repository_1 = require("./repository/type-orm-proposal.repository");
let ProposalService = class ProposalService extends core_1.TenantAwareCrudService {
    constructor(typeOrmProposalRepository, mikroOrmProposalRepository) {
        super(typeOrmProposalRepository, mikroOrmProposalRepository);
        this.typeOrmProposalRepository = typeOrmProposalRepository;
        this.mikroOrmProposalRepository = mikroOrmProposalRepository;
    }
    /**
     * Creates (or, via the proposal update command handler, upserts) a proposal, sanitizing the
     * rich-text `jobPostContent` and `proposalContent` HTML through the shared server-side
     * allowlist before persisting — both fields are re-rendered with `[innerHTML]` on the
     * proposal details view (see `sanitizeRichHtml`).
     *
     * @param entity - The proposal data to persist.
     * @returns The persisted proposal.
     */
    async create(entity) {
        if (typeof entity.jobPostContent === 'string') {
            entity.jobPostContent = (0, core_1.sanitizeRichHtml)(entity.jobPostContent);
        }
        if (typeof entity.proposalContent === 'string') {
            entity.proposalContent = (0, core_1.sanitizeRichHtml)(entity.proposalContent);
        }
        return await super.create(entity);
    }
    /**
     * Retrieves a paginated list of proposals based on optional filtering.
     *
     * @param filter Optional filtering criteria for retrieving proposals.
     * @returns A paginated list of proposals.
     */
    async findAll(filter) {
        return this.pagination(filter);
    }
    /**
     * Paginates data based on the provided filter options.
     *
     * @param {FindManyOptions} filter - The filter options for pagination.
     * @returns The paginated data.
     */
    async pagination(filter) {
        // Check if 'where' property exists in the filter
        if (!('where' in filter)) {
            // If 'where' property is missing, return paginated data without any modification
            return super.paginate(filter);
        }
        const { where } = filter;
        if ('valueDate' in where) {
            const { valueDate } = where;
            // If 'valueDate' property exists, extract start and end dates
            const { startDate, endDate } = valueDate;
            // Get the start and end of the current month in UTC format
            const startOfCurrentMonth = moment().startOf('month').utc().format('YYYY-MM-DD HH:mm:ss');
            const endOfCurrentMonth = moment().endOf('month').utc().format('YYYY-MM-DD HH:mm:ss');
            // Update the 'valueDate' property to filter records between the specified dates
            filter['where']['valueDate'] = (0, typeorm_1.Between)(startDate ? moment.utc(startDate).format('YYYY-MM-DD HH:mm:ss') : startOfCurrentMonth, endDate ? moment.utc(endDate).format('YYYY-MM-DD HH:mm:ss') : endOfCurrentMonth);
        }
        // Check if 'jobPostContent' property exists in the 'where' filter
        if ('jobPostContent' in where) {
            // If 'jobPostContent' property exists, construct a raw SQL query to perform a like search
            filter['where']['jobPostContent'] = (0, typeorm_1.Raw)((alias) => `${alias} ${core_1.LIKE_OPERATOR} :jobPostContent`, {
                jobPostContent: `%${where.jobPostContent}%`
            });
        }
        // Return the paginated data after applying any modifications
        return super.paginate(filter);
    }
};
exports.ProposalService = ProposalService;
exports.ProposalService = ProposalService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_proposal_repository_1.TypeOrmProposalRepository,
        mikro_orm_proposal_repository_1.MikroOrmProposalRepository])
], ProposalService);
//# sourceMappingURL=proposal.service.js.map