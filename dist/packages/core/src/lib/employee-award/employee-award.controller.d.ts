import { DeleteResult, UpdateResult } from 'typeorm';
import { IEmployeeAward, IPagination } from '@gauzy/contracts';
import { EmployeeAward } from './employee-award.entity';
import { EmployeeAwardService } from './employee-award.service';
import { CrudController, BaseQueryDTO } from './../core/crud';
import { CreateEmployeeAwardDTO, UpdateEmployeeAwardDTO } from './dto';
export declare class EmployeeAwardController extends CrudController<EmployeeAward> {
    private readonly employeeAwardService;
    constructor(employeeAwardService: EmployeeAwardService);
    findAll(params: BaseQueryDTO<EmployeeAward>): Promise<IPagination<IEmployeeAward>>;
    create(entity: CreateEmployeeAwardDTO): Promise<IEmployeeAward>;
    update(id: IEmployeeAward['id'], entity: UpdateEmployeeAwardDTO): Promise<IEmployeeAward | UpdateResult>;
    delete(id: IEmployeeAward['id']): Promise<DeleteResult>;
}
