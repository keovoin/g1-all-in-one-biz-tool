"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomeService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const moment = require("moment");
const crud_1 = require("./../core/crud");
const util_1 = require("../core/util");
const mikro_orm_income_repository_1 = require("./repository/mikro-orm-income.repository");
const type_orm_income_repository_1 = require("./repository/type-orm-income.repository");
let IncomeService = class IncomeService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmIncomeRepository, mikroOrmIncomeRepository) {
        super(typeOrmIncomeRepository, mikroOrmIncomeRepository);
        this.typeOrmIncomeRepository = typeOrmIncomeRepository;
        this.mikroOrmIncomeRepository = mikroOrmIncomeRepository;
    }
    /**
     * Retrieves a paginated list of incomes, optionally filtering by a specific month.
     *
     * @param filter - Optional filtering options for incomes.
     * @param filterDate - Optional date string used to filter incomes for its month.
     * @returns A promise that resolves to a paginated list of incomes.
     */
    async findAllIncomes(filter, filterDate) {
        if (filterDate) {
            // Calculate the start and end of the month using Moment.js.
            const startOfMonth = moment(filterDate).startOf('month').toDate();
            const endOfMonth = moment(filterDate).endOf('month').toDate();
            return filter
                ? await this.findAll({
                    where: {
                        valueDate: (0, typeorm_1.Between)(startOfMonth, endOfMonth),
                        ...filter.where
                    },
                    relations: filter?.relations || []
                })
                : await this.findAll({
                    where: {
                        valueDate: (0, typeorm_1.Between)(startOfMonth, endOfMonth)
                    }
                });
        }
        return await this.findAll(filter || {});
    }
    /**
     * Computes the average of the non-falsy numbers in the given array.
     *
     * @param data - An array of numbers.
     * @returns The average of the non-falsy numbers, or 0 if there are none.
     */
    countStatistic(data) {
        return data.filter(Number).reduce((a, b) => a + b, 0) !== 0
            ? data.filter(Number).reduce((a, b) => a + b, 0) / data.filter(Number).length
            : 0;
    }
    /**
     * Paginates records for SomeEntity based on provided filters.
     *
     * @param filter - Pagination parameters including custom filters.
     * @returns A promise resolving to paginated results.
     */
    pagination(filter) {
        if (filter?.where) {
            const { where } = filter;
            // Apply like filter for notes field
            if (where.notes) {
                filter['where']['notes'] = (0, typeorm_1.Raw)((alias) => `${alias} ${util_1.LIKE_OPERATOR} :notes`, {
                    notes: `%${where.notes}%`
                });
            }
            // Apply date range filter for valueDate field
            if (where.valueDate) {
                const { startDate, endDate } = where.valueDate;
                const start = startDate ? moment.utc(startDate) : moment().startOf('month').utc();
                const end = endDate ? moment.utc(endDate) : moment().endOf('month').utc();
                filter['where']['valueDate'] = (0, typeorm_1.Between)(start.format('YYYY-MM-DD HH:mm:ss'), end.format('YYYY-MM-DD HH:mm:ss'));
            }
            // Apply filter for tags field
            if (where.tags) {
                const { tags } = where;
                filter['where']['tags'] = {
                    id: (0, typeorm_1.In)(tags)
                };
            }
        }
        return super.paginate(filter ?? {});
    }
};
exports.IncomeService = IncomeService;
exports.IncomeService = IncomeService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_income_repository_1.TypeOrmIncomeRepository,
        mikro_orm_income_repository_1.MikroOrmIncomeRepository])
], IncomeService);
//# sourceMappingURL=income.service.js.map