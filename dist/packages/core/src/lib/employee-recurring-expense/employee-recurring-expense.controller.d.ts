import { IStartUpdateTypeInfo, IRecurringExpenseEditInput, IEmployeeRecurringExpense, IPagination, ID } from '@gauzy/contracts';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CrudController, BaseQueryDTO } from './../core/crud';
import { CreateEmployeeRecurringExpenseDTO, UpdateEmployeeRecurringExpenseDTO } from './dto';
import { EmployeeRecurringExpenseQueryDTO } from './dto/employee-recurring-expense-query.dto';
import { EmployeeRecurringExpense } from './employee-recurring-expense.entity';
import { EmployeeRecurringExpenseService } from './employee-recurring-expense.service';
export declare class EmployeeRecurringExpenseController extends CrudController<EmployeeRecurringExpense> {
    private readonly employeeRecurringExpenseService;
    private readonly queryBus;
    private readonly commandBus;
    constructor(employeeRecurringExpenseService: EmployeeRecurringExpenseService, queryBus: QueryBus, commandBus: CommandBus);
    findAllByMonth(options: EmployeeRecurringExpenseQueryDTO): Promise<IPagination<IEmployeeRecurringExpense>>;
    findStartDateUpdateType(data: any): Promise<IStartUpdateTypeInfo>;
    findAll(params: BaseQueryDTO<EmployeeRecurringExpense>): Promise<IPagination<IEmployeeRecurringExpense>>;
    create(entity: CreateEmployeeRecurringExpenseDTO): Promise<IEmployeeRecurringExpense>;
    update(id: ID, entity: UpdateEmployeeRecurringExpenseDTO): Promise<IRecurringExpenseEditInput>;
    delete(id: ID, data: any): Promise<any>;
}
