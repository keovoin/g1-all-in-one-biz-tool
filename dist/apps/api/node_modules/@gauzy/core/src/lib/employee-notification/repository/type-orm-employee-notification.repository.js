"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmEmployeeNotificationRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_notification_entity_1 = require("../employee-notification.entity");
let TypeOrmEmployeeNotificationRepository = class TypeOrmEmployeeNotificationRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmEmployeeNotificationRepository = TypeOrmEmployeeNotificationRepository;
exports.TypeOrmEmployeeNotificationRepository = TypeOrmEmployeeNotificationRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(employee_notification_entity_1.EmployeeNotification)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmEmployeeNotificationRepository);
//# sourceMappingURL=type-orm-employee-notification.repository.js.map