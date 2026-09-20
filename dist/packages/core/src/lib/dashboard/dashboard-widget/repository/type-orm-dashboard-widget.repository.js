"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmDashboardWidgetRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const dashboard_widget_entity_1 = require("../dashboard-widget.entity");
let TypeOrmDashboardWidgetRepository = class TypeOrmDashboardWidgetRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmDashboardWidgetRepository = TypeOrmDashboardWidgetRepository;
exports.TypeOrmDashboardWidgetRepository = TypeOrmDashboardWidgetRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(dashboard_widget_entity_1.DashboardWidget)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmDashboardWidgetRepository);
//# sourceMappingURL=type-orm-dashboard-widget.repository.js.map