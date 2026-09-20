"use strict";
// Code from https://github.com/xmlking/ngx-starter-kit.
// MIT License, see https://github.com/xmlking/ngx-starter-kit/blob/develop/LICENSE
// Copyright (c) 2018 Sumanth Chinthagunta
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEntity = exports.BaseEntityActionByUser = exports.AccessTimestamps = exports.SoftDeletableBaseEntity = exports.Model = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const mikro_orm_soft_delete_1 = require("mikro-orm-soft-delete");
const core_1 = require("@mikro-orm/core");
const entity_1 = require("../decorators/entity");
const column_index_decorator_1 = require("../decorators/entity/column-index.decorator");
const internal_1 = require("./internal");
/**
 * Abstract base class for dynamically assigning properties.
 */
class Model {
    constructor(input) {
        if (input) {
            // Iterate over the key-value pairs in the input object
            for (const [key, value] of Object.entries(input)) {
                // Assign the value to the corresponding property in this instance
                this[key] = value;
            }
        }
    }
}
exports.Model = Model;
/**
 * Base entity class with soft-delete functionality.
 * All entities that extend this class will have soft-delete capability.
 */
let SoftDeletableBaseEntity = class SoftDeletableBaseEntity extends Model {
};
exports.SoftDeletableBaseEntity = SoftDeletableBaseEntity;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: 'string',
        format: 'date-time',
        example: '2018-11-21T06:20:32.232Z'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)()
    // Soft delete column that records the date/time when the entity was soft-deleted
    ,
    (0, typeorm_1.DeleteDateColumn)() // Indicates that this column is used for soft-delete
    ,
    (0, core_1.Property)({ nullable: true }) // Allows for Mikro-ORM compatibility
    ,
    tslib_1.__metadata("design:type", Date)
], SoftDeletableBaseEntity.prototype, "deletedAt", void 0);
exports.SoftDeletableBaseEntity = SoftDeletableBaseEntity = tslib_1.__decorate([
    (0, mikro_orm_soft_delete_1.SoftDeletable)(() => SoftDeletableBaseEntity, 'deletedAt', () => AccessTimestamps.getCurrentDate())
], SoftDeletableBaseEntity);
/**
 * Represents an entity with automatic timestamp management for creation and updates.
 * Extends the `SoftDeletableBaseEntity` to include support for soft deletes.
 */
class AccessTimestamps extends SoftDeletableBaseEntity {
    /**
     * Utility function to get the current date.
     * Used to set `createdAt` and `updatedAt` timestamps.
     *
     * @returns {Date} - The current date.
     */
    static getCurrentDate() {
        return new Date();
    }
}
exports.AccessTimestamps = AccessTimestamps;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: 'string',
        format: 'date-time',
        example: '2018-11-21T06:20:32.232Z',
        description: 'The creation timestamp of the entity.'
    }),
    (0, typeorm_1.CreateDateColumn)(),
    (0, core_1.Property)({
        // Automatically set the property value when entity gets created, executed during flush operation.
        onCreate: () => AccessTimestamps.getCurrentDate() // Set creation date on record creation
    }),
    tslib_1.__metadata("design:type", Date)
], AccessTimestamps.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: 'string',
        format: 'date-time',
        example: '2018-11-21T06:20:32.232Z',
        description: 'The last update timestamp of the entity.'
    }),
    (0, typeorm_1.UpdateDateColumn)(),
    (0, core_1.Property)({
        // Automatically set the property value when entity gets created, executed during flush operation.
        onCreate: () => AccessTimestamps.getCurrentDate(), // Set at record creation
        // Automatically update the property value every time entity gets updated, executed during flush operation.
        onUpdate: () => AccessTimestamps.getCurrentDate() // Update every time the entity is changed
    }),
    tslib_1.__metadata("design:type", Date)
], AccessTimestamps.prototype, "updatedAt", void 0);
/**
 * BaseEntityActionByUser provides a generic template for tracking
 * user actions (create) performed on an entity.
 */
class BaseEntityActionByUser extends AccessTimestamps {
}
exports.BaseEntityActionByUser = BaseEntityActionByUser;
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.User, {
        nullable: true, // Indicates if relation column value can be nullable.
        onDelete: 'CASCADE' // Database cascade action on update.
    }),
    tslib_1.__metadata("design:type", Object)
], BaseEntityActionByUser.prototype, "createdByUser", void 0);
tslib_1.__decorate([
    (0, typeorm_1.RelationId)((it) => it.createdByUser),
    (0, column_index_decorator_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], BaseEntityActionByUser.prototype, "createdByUserId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.User, {
        nullable: true, // Allows the relation column to be null if no updater is specified.
        onDelete: 'CASCADE' // Cascades the delete operation if the related User is removed.
    }),
    tslib_1.__metadata("design:type", Object)
], BaseEntityActionByUser.prototype, "updatedByUser", void 0);
tslib_1.__decorate([
    (0, typeorm_1.RelationId)((it) => it.updatedByUser),
    (0, column_index_decorator_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], BaseEntityActionByUser.prototype, "updatedByUserId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.User, {
        nullable: true, // Indicates if relation column value can be nullable.
        onDelete: 'CASCADE' // Database cascade action on update.
    }),
    tslib_1.__metadata("design:type", Object)
], BaseEntityActionByUser.prototype, "deletedByUser", void 0);
tslib_1.__decorate([
    (0, typeorm_1.RelationId)((it) => it.deletedByUser),
    (0, column_index_decorator_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], BaseEntityActionByUser.prototype, "deletedByUserId", void 0);
/**
 * Abstract base entity with common fields for UUID, creation, update timestamps, soft-delete, and more.
 */
class BaseEntity extends BaseEntityActionByUser {
}
exports.BaseEntity = BaseEntity;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, core_1.PrimaryKey)({ type: 'uuid', defaultRaw: 'gen_random_uuid()' }) // For Mikro-ORM compatibility
    ,
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], BaseEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Boolean,
        default: true
    }),
    (0, class_validator_1.IsOptional)() // Field can be optional
    ,
    (0, class_validator_1.IsBoolean)() // Should be a boolean type
    ,
    (0, column_index_decorator_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, default: true }) // TypeORM and Mikro-ORM compatibility
    ,
    tslib_1.__metadata("design:type", Boolean)
], BaseEntity.prototype, "isActive", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Boolean,
        default: false
    }),
    (0, class_validator_1.IsOptional)() // Field can be optional
    ,
    (0, class_validator_1.IsBoolean)() // Should be a boolean type
    ,
    (0, column_index_decorator_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, default: false }) // TypeORM and Mikro-ORM compatibility
    ,
    tslib_1.__metadata("design:type", Boolean)
], BaseEntity.prototype, "isArchived", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: 'string',
        format: 'date-time',
        example: '2018-11-21T06:20:32.232Z'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], BaseEntity.prototype, "archivedAt", void 0);
//# sourceMappingURL=base.entity.js.map