import { CommandBus } from '@nestjs/cqrs';
import { EmployeeService, ExpenseCategoriesService, OrganizationContactService, OrganizationVendorService, UserService } from '@gauzy/core';
export declare class UpworkTransactionService {
    private readonly _userService;
    private readonly _employeeService;
    private readonly _orgVendorService;
    private readonly _orgClientService;
    private readonly _expenseCategoryService;
    private readonly _commandBus;
    private commandBusMapper;
    constructor(_userService: UserService, _employeeService: EmployeeService, _orgVendorService: OrganizationVendorService, _orgClientService: OrganizationContactService, _expenseCategoryService: ExpenseCategoriesService, _commandBus: CommandBus);
    /**
     *
     */
    handleTransactions(file: Express.Multer.File, { organizationId }: {
        organizationId: any;
    }): Promise<unknown>;
    /**
     *
     * @param errors
     * @param totalExpenses
     * @param totalIncomes
     * @returns
     */
    private _formatErrorMessage;
    /**
     *
     * @param processedTransactions
     * @returns
     */
    private _processTransactions;
    /**
     *
     * @param service
     * @param condition
     * @param errorMsg
     * @returns
     */
    private _findRecordOrThrow;
}
