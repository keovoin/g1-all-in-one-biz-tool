"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmEmployeeRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_entity_1 = require("../employee.entity");
let TypeOrmEmployeeRepository = class TypeOrmEmployeeRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
    /**
     * Fetches an employee based on the provided query.
     *
     * @param query - The query parameters to find the employee.
     * @returns A Promise resolving to the employee entity or null.
     */
    async findOneByOptions(query) {
        return await this.repository.findOneBy(query);
    }
};
exports.TypeOrmEmployeeRepository = TypeOrmEmployeeRepository;
exports.TypeOrmEmployeeRepository = TypeOrmEmployeeRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmEmployeeRepository);
//# sourceMappingURL=type-orm-employee.repository.js.map