"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpworkTransactionService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const uuid_1 = require("uuid");
const fs = require("fs");
const fse = require("fs-extra");
const csv = require("csv-parser");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
let UpworkTransactionService = class UpworkTransactionService {
    constructor(_userService, _employeeService, _orgVendorService, _orgClientService, _expenseCategoryService, _commandBus) {
        this._userService = _userService;
        this._employeeService = _employeeService;
        this._orgVendorService = _orgVendorService;
        this._orgClientService = _orgClientService;
        this._expenseCategoryService = _expenseCategoryService;
        this._commandBus = _commandBus;
        this.commandBusMapper = {
            [contracts_1.IncomeTypeEnum.HOURLY]: {
                command: ({ dto, client }) => new core_1.IncomeCreateCommand({
                    ...dto,
                    clientName: client.name,
                    clientId: client.id
                })
            },
            [contracts_1.ExpenseCategoriesEnum.SERVICE_FEE]: {
                command: ({ dto, category, vendor }) => new core_1.ExpenseCreateCommand({
                    ...dto,
                    vendor,
                    category
                })
            }
        };
    }
    /**
     *
     */
    async handleTransactions(file, { organizationId }) {
        const uuid = (0, uuid_1.v4)();
        const dirPath = `./upwork/csv/${uuid}`;
        const csvData = file.buffer.toString();
        const filePath = `${dirPath}/${file.originalname}`;
        let results = [];
        fs.mkdirSync(dirPath, { recursive: true });
        fs.writeFileSync(filePath, csvData);
        const csvReader = fs
            .createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => (results = results.concat(data)));
        const tenantId = core_1.RequestContext.currentTenantId();
        return new Promise((resolve, reject) => {
            csvReader.on('end', async () => {
                fse.removeSync(dirPath);
                const transactions = results
                    .filter((result) => result.Type === contracts_1.IncomeTypeEnum.HOURLY || result.Type === contracts_1.ExpenseCategoriesEnum.SERVICE_FEE)
                    .map(async (result) => {
                    const { Date: date, Amount, Freelancer, Currency, Team } = result;
                    const [firstName, lastName] = Freelancer.split(' ');
                    const { record: user } = await this._findRecordOrThrow(this._userService, {
                        where: {
                            firstName,
                            lastName
                        }
                    }, `User: ${Freelancer} not found`);
                    const { record: employee } = await this._findRecordOrThrow(this._employeeService, { where: { user, organizationId, tenantId } }, `Employee ${Freelancer} not found`);
                    const { record: category } = await this._findRecordOrThrow(this._expenseCategoryService, {
                        where: {
                            name: contracts_1.ExpenseCategoriesEnum.SERVICE_FEE,
                            organizationId,
                            tenantId
                        }
                    }, `Category: ${contracts_1.ExpenseCategoriesEnum.SERVICE_FEE} not found`);
                    const { record: vendor } = await this._findRecordOrThrow(this._orgVendorService, {
                        where: {
                            name: contracts_1.OrganizationVendorEnum.UPWORK,
                            organizationId,
                            tenantId
                        }
                    }, `Vendor: ${contracts_1.OrganizationVendorEnum.UPWORK} not found`);
                    const { record: client } = await this._findRecordOrThrow(this._orgClientService, {
                        where: { name: Team, organizationId, tenantId }
                    }, `Client: ${Team} not found`);
                    const dto = {
                        amount: Amount,
                        reference: result['Ref ID'],
                        valueDate: new Date(date),
                        employeeId: employee.id,
                        currency: Currency,
                        organizationId
                    };
                    const cmd = this.commandBusMapper[result.Type];
                    return await this._commandBus.execute(cmd.command({
                        dto,
                        client,
                        vendor,
                        category
                    }));
                });
                const processedTransactions = await Promise.all(transactions.map(core_1.reflect));
                const { rejectedTransactions, totalExpenses, totalIncomes } = this._processTransactions(processedTransactions);
                if (rejectedTransactions.length) {
                    const errors = rejectedTransactions.map(({ error }) => error.response.message);
                    const message = this._formatErrorMessage([...new Set(errors)], totalExpenses, totalIncomes);
                    return reject(new common_1.BadRequestException(message));
                }
                resolve({ totalExpenses, totalIncomes });
            });
        });
    }
    /**
     *
     * @param errors
     * @param totalExpenses
     * @param totalIncomes
     * @returns
     */
    _formatErrorMessage(errors, totalExpenses, totalIncomes) {
        return `Total succeed expenses transactions: ${totalExpenses}.
			Total succeed incomes transactions: ${totalIncomes}.
			Failed transactions: ${errors.join(', ')}
		`;
    }
    /**
     *
     * @param processedTransactions
     * @returns
     */
    _processTransactions(processedTransactions) {
        const { rejectedTransactions, totalExpenses, totalIncomes } = processedTransactions.reduce((prev, current) => {
            return {
                rejectedTransactions: current.status === 'rejected'
                    ? prev.rejectedTransactions.concat(current)
                    : prev.rejectedTransactions,
                totalExpenses: current.item instanceof core_1.Expense
                    ? (prev.totalExpenses++, prev.totalExpenses)
                    : prev.totalExpenses,
                totalIncomes: current.item instanceof core_1.Income ? (prev.totalIncomes++, prev.totalIncomes) : prev.totalIncomes
            };
        }, {
            rejectedTransactions: [],
            totalExpenses: 0,
            totalIncomes: 0
        });
        return {
            rejectedTransactions,
            totalExpenses,
            totalIncomes
        };
    }
    /**
     *
     * @param service
     * @param condition
     * @param errorMsg
     * @returns
     */
    async _findRecordOrThrow(service, condition, errorMsg) {
        const response = await service.findOneOrFailByOptions(condition);
        if (response.success) {
            return { record: response.record };
        }
        throw new common_1.BadRequestException(errorMsg);
    }
};
exports.UpworkTransactionService = UpworkTransactionService;
exports.UpworkTransactionService = UpworkTransactionService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.UserService,
        core_1.EmployeeService,
        core_1.OrganizationVendorService,
        core_1.OrganizationContactService,
        core_1.ExpenseCategoriesService,
        cqrs_1.CommandBus])
], UpworkTransactionService);
//# sourceMappingURL=upwork-transaction.service.js.map