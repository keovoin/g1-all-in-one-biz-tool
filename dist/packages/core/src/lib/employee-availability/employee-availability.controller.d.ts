import { UpdateResult } from 'typeorm';
import { CommandBus } from '@nestjs/cqrs';
import { ID, IEmployeeAvailability, IPagination } from '@gauzy/contracts';
import { CrudController, BaseQueryDTO } from '../core/crud';
import { EmployeeAvailabilityService } from './employee-availability.service';
import { EmployeeAvailability } from './employee-availability.entity';
import { CreateEmployeeAvailabilityDTO } from './dto/create-employee-availability.dto';
import { UpdateEmployeeAvailabilityDTO } from './dto/update-employee-availability.dto';
export declare class EmployeeAvailabilityController extends CrudController<EmployeeAvailability> {
    private readonly availabilityService;
    private readonly commandBus;
    constructor(availabilityService: EmployeeAvailabilityService, commandBus: CommandBus);
    /**
     * Create multiple employee availability records in bulk.
     *
     * @param entities List of availability records to create
     * @returns The created availability records
     */
    createBulk(entities: CreateEmployeeAvailabilityDTO[]): Promise<IEmployeeAvailability[]>;
    /**
     * Retrieve all employee availability records.
     *
     * @param data Query parameters, including relations and filters
     * @returns A paginated list of availability records
     */
    findAll(filter: BaseQueryDTO<EmployeeAvailability>): Promise<IPagination<IEmployeeAvailability>>;
    /**
     * Create a new employee availability record.
     *
     * @param entity The data for the new availability record
     * @returns The created availability record
     */
    create(entity: CreateEmployeeAvailabilityDTO): Promise<IEmployeeAvailability>;
    /**
     * Update an existing employee availability record by its ID.
     *
     * @param id The ID of the availability record
     * @param entity The updated data for the record
     * @returns The updated availability record
     */
    update(id: ID, entity: UpdateEmployeeAvailabilityDTO): Promise<IEmployeeAvailability | UpdateResult>;
}
