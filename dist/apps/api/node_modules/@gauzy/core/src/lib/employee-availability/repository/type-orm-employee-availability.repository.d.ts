import { Repository } from 'typeorm';
import { EmployeeAvailability } from '../employee-availability.entity';
export declare class TypeOrmEmployeeAvailabilityRepository extends Repository<EmployeeAvailability> {
    readonly repository: Repository<EmployeeAvailability>;
    constructor(repository: Repository<EmployeeAvailability>);
}
