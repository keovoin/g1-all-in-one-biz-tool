"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentSharing = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_equipment_sharing_repository_1 = require("./repository/mikro-orm-equipment-sharing.repository");
let EquipmentSharing = class EquipmentSharing extends internal_1.TenantOrganizationBaseEntity {
};
exports.EquipmentSharing = EquipmentSharing;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], EquipmentSharing.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], EquipmentSharing.prototype, "shareRequestDay", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], EquipmentSharing.prototype, "shareStartDay", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], EquipmentSharing.prototype, "shareEndDay", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Number)
], EquipmentSharing.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => internal_1.Equipment }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Equipment, (equipment) => equipment.equipmentSharings, {
        nullable: true, // Indicates if relation column value can be nullable or not.
        onDelete: 'CASCADE' // Database cascade action on delete.
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], EquipmentSharing.prototype, "equipment", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.equipment),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], EquipmentSharing.prototype, "equipmentId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => internal_1.EquipmentSharingPolicy }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.EquipmentSharingPolicy, (it) => it.equipmentSharings, {
        nullable: true, // Indicates if relation column value can be nullable or not.
        onDelete: 'CASCADE' // Database cascade action on delete.
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], EquipmentSharing.prototype, "equipmentSharingPolicy", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.equipmentSharingPolicy),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], EquipmentSharing.prototype, "equipmentSharingPolicyId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.Employee, (it) => it.equipmentSharings, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        owner: true,
        pivotTable: 'equipment_shares_employees',
        joinColumn: 'equipmentSharingId',
        inverseJoinColumn: 'employeeId'
    }),
    (0, typeorm_1.JoinTable)({
        name: 'equipment_shares_employees'
    }),
    tslib_1.__metadata("design:type", Array)
], EquipmentSharing.prototype, "employees", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.OrganizationTeam, (it) => it.equipmentSharings, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        owner: true,
        pivotTable: 'equipment_shares_teams',
        joinColumn: 'equipmentSharingId',
        inverseJoinColumn: 'organizationTeamId'
    }),
    (0, typeorm_1.JoinTable)({
        name: 'equipment_shares_teams'
    }),
    tslib_1.__metadata("design:type", Array)
], EquipmentSharing.prototype, "teams", void 0);
exports.EquipmentSharing = EquipmentSharing = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('equipment_sharing', { mikroOrmRepository: () => mikro_orm_equipment_sharing_repository_1.MikroOrmEquipmentSharingRepository })
], EquipmentSharing);
//# sourceMappingURL=equipment-sharing.entity.js.map