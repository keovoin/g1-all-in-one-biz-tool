"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicEmployeeService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const internal_1 = require("./../../core/entities/internal");
const type_orm_employee_repository_1 = require("../../employee/repository/type-orm-employee.repository");
const utils_1 = require("../../core/utils");
const public_html_sanitizer_1 = require("../public-html-sanitizer");
/**
 * Display-safe field allowlist for the public employee profile.
 *
 * The public endpoints must NOT return the entire Employee entity (internal ids, job-search status,
 * offer/accept/reject dates, totals, etc.) nor the linked user's private fields (phoneNumber,
 * username, ...). Only the fields the public profile page actually renders are exposed
 * (GHSA-49ff-8859-537j). The virtual `name` column is intentionally omitted from the user
 * projection — it is repopulated from firstName/lastName by the UserSubscriber after load. Any
 * relations the caller requests (skills, awards, organizationEmploymentTypes) are not keyed here, so
 * TypeORM still loads them in full.
 */
const PUBLIC_EMPLOYEE_SELECT = {
    id: true,
    isActive: true,
    short_description: true,
    payPeriod: true,
    billRateValue: true,
    billRateCurrency: true,
    averageIncome: true,
    averageExpenses: true,
    averageBonus: true,
    startedWorkOn: true,
    show_billrate: true,
    show_payperiod: true,
    show_start_work_on: true,
    show_average_income: true,
    show_average_expenses: true,
    show_average_bonus: true,
    organizationId: true,
    // NOTE: the linked user's `email` is intentionally NOT exposed on the unauthenticated public
    // profile (GDPR-relevant PII); only display name + avatar are returned (GHSA-49ff-8859-537j).
    user: {
        id: true,
        firstName: true,
        lastName: true,
        imageUrl: true
    }
};
/**
 * Applies the employee's own `show_*` visibility flags server-side: financial fields are removed from
 * the response unless the employee has explicitly opted to display them. The `show_*` flags only
 * control UI rendering, so without this an unauthenticated caller could still read raw values the
 * employee chose to hide (GHSA-49ff-8859-537j).
 *
 * @param employee - The loaded (already field-projected) employee.
 * @returns The same employee with hidden financial fields stripped.
 */
function applyEmployeeVisibility(employee) {
    if (!employee) {
        return employee;
    }
    const e = employee;
    if (!e['show_billrate']) {
        delete e['billRateValue'];
        delete e['billRateCurrency'];
    }
    if (!e['show_payperiod']) {
        delete e['payPeriod'];
    }
    if (!e['show_start_work_on']) {
        delete e['startedWorkOn'];
    }
    if (!e['show_average_income']) {
        delete e['averageIncome'];
    }
    if (!e['show_average_expenses']) {
        delete e['averageExpenses'];
    }
    if (!e['show_average_bonus']) {
        delete e['averageBonus'];
    }
    return employee;
}
/**
 * Sanitizes the rich-text HTML this endpoint serves, on the way OUT — see
 * `sanitizePublicRichTextFields` for why the write-path pass is not enough on an unauthenticated
 * endpoint. Idempotent, so a row already clean round-trips byte-for-byte.
 *
 * @param employee - The loaded (already field-projected and visibility-filtered) employee.
 * @returns The same employee with its HTML fields sanitized.
 */
function sanitizeEmployeeHtml(employee) {
    return (0, public_html_sanitizer_1.sanitizePublicRichTextFields)(employee, public_html_sanitizer_1.PUBLIC_EMPLOYEE_HTML_FIELDS);
}
let PublicEmployeeService = class PublicEmployeeService {
    constructor(typeOrmEmployeeRepository) {
        this.typeOrmEmployeeRepository = typeOrmEmployeeRepository;
    }
    /**
     * GET all public employees by organization condition
     *
     * @param where
     * @param relations
     * @returns
     */
    async findPublicEmployeeByOrganization(where, relations = []) {
        try {
            const [items = [], total = 0] = await this.typeOrmEmployeeRepository.findAndCount({
                where,
                relations: (0, utils_1.parseFindOptionsRelations)(relations),
                // Restrict the response to display-safe fields only (GHSA-49ff-8859-537j).
                select: PUBLIC_EMPLOYEE_SELECT
            });
            return { items: items.map(applyEmployeeVisibility).map(sanitizeEmployeeHtml), total };
        }
        catch (error) {
            throw new common_1.BadRequestException(error, `Error while getting public employees`);
        }
    }
    /**
     * GET employee by profile link & primary ID
     *
     * @param where
     * @param relations
     * @returns
     */
    async findOneByConditions(where, relations) {
        try {
            const employee = await this.typeOrmEmployeeRepository.findOneOrFail({
                where,
                relations: (0, utils_1.parseFindOptionsRelations)(relations),
                // Restrict the response to display-safe fields only (GHSA-49ff-8859-537j).
                select: PUBLIC_EMPLOYEE_SELECT
            });
            return sanitizeEmployeeHtml(applyEmployeeVisibility(employee));
        }
        catch (error) {
            throw new common_1.NotFoundException(`The requested record was not found`);
        }
    }
};
exports.PublicEmployeeService = PublicEmployeeService;
exports.PublicEmployeeService = PublicEmployeeService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(internal_1.Employee)),
    tslib_1.__metadata("design:paramtypes", [type_orm_employee_repository_1.TypeOrmEmployeeRepository])
], PublicEmployeeService);
//# sourceMappingURL=public-employee.service.js.map