import { CommandBus } from '@nestjs/cqrs';
import { ID, IIncome, IPagination } from '@gauzy/contracts';
import { DeleteResult, FindOptionsWhere } from 'typeorm';
import { CrudController, BaseQueryDTO } from './../core/crud';
import { EmployeeService } from '../employee/employee.service';
import { Income } from './income.entity';
import { IncomeService } from './income.service';
import { CreateIncomeDTO, DeleteIncomeDTO, UpdateIncomeDTO } from './dto';
export declare class IncomeController extends CrudController<Income> {
    private readonly incomeService;
    private readonly employeeService;
    private readonly commandBus;
    constructor(incomeService: IncomeService, employeeService: EmployeeService, commandBus: CommandBus);
    findMyIncome(data: any): Promise<IPagination<IIncome>>;
    /**
     * GET income count
     *
     * @param options
     * @returns
     */
    getCount(options: FindOptionsWhere<Income>): Promise<number>;
    pagination(params: BaseQueryDTO<Income>): Promise<IPagination<IIncome>>;
    findAll(data: any): Promise<IPagination<IIncome>>;
    /**
     * Find income by primary ID
     *
     * @param id
     * @returns
     */
    findById(id: string): Promise<IIncome>;
    create(entity: CreateIncomeDTO): Promise<IIncome>;
    update(id: ID, entity: UpdateIncomeDTO): Promise<IIncome>;
    delete(incomeId: ID, options: DeleteIncomeDTO): Promise<DeleteResult>;
}
