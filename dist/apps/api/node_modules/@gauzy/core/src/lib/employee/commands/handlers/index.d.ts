import { EmployeeBulkCreateHandler } from './employee.bulk.create.handler';
import { EmployeeCreateHandler } from './employee.create.handler';
import { EmployeeGetHandler } from './employee.get.handler';
import { EmployeeUpdateHandler } from './employee.update.handler';
import { WorkingEmployeeGetHandler } from './working-employee.get.handler';
export declare const CommandHandlers: (typeof EmployeeBulkCreateHandler | typeof EmployeeCreateHandler | typeof EmployeeGetHandler | typeof EmployeeUpdateHandler | typeof WorkingEmployeeGetHandler)[];
