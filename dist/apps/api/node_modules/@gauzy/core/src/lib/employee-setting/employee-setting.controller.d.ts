import { CommandBus } from '@nestjs/cqrs';
import { DeleteResult } from 'typeorm';
import { ID, IPagination } from '@gauzy/contracts';
import { CrudController, FindOptionsQueryDTO, BaseQueryDTO } from './../core/crud';
import { EmployeeSettingService } from './employee-setting.service';
import { EmployeeSetting } from './employee-setting.entity';
import { CreateEmployeeSettingDTO, UpdateEmployeeSettingDTO } from './dto';
export declare class EmployeeSettingController extends CrudController<EmployeeSetting> {
    private readonly employeeSettingService;
    private readonly commandBus;
    constructor(employeeSettingService: EmployeeSettingService, commandBus: CommandBus);
    findAll(params: BaseQueryDTO<EmployeeSetting>): Promise<IPagination<EmployeeSetting>>;
    findById(id: ID, params: FindOptionsQueryDTO<EmployeeSetting>): Promise<EmployeeSetting>;
    create(entity: CreateEmployeeSettingDTO): Promise<EmployeeSetting>;
    update(id: ID, entity: UpdateEmployeeSettingDTO): Promise<EmployeeSetting>;
    delete(id: ID): Promise<DeleteResult>;
}
