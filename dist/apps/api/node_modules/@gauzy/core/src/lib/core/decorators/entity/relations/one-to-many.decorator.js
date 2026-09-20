"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiORMOneToMany = MultiORMOneToMany;
const core_1 = require("@mikro-orm/core");
const underscore_1 = require("underscore");
const utils_1 = require("@gauzy/utils");
const utils_2 = require("../../../../core/utils");
const type_orm_1 = require("./type-orm");
const mikro_orm_1 = require("./mikro-orm");
/**
 * Decorator for defining One-to-Many relationships that works with both MikroORM and TypeORM.
 *
 * @param typeFunctionOrTarget - Type or target function for the related entity.
 * @param inverseSide - Inverse side of the relationship or additional options (if options is provided first).
 * @param options - Additional options for the One-to-Many relationship.
 * @returns PropertyDecorator.
 */
function MultiORMOneToMany(typeFunctionOrTarget, inverseSide, options) {
    // Normalize parameters.
    let inverseSideProperty;
    if ((0, utils_1.isObject)(inverseSide)) {
        options = inverseSide;
    }
    else {
        inverseSideProperty = inverseSide;
    }
    // The decorator function applied to the target property
    return (target, propertyKey) => {
        // If options are not provided, initialize an empty object
        if (!options)
            options = {};
        // Determine which ORM is in use
        const ormType = (0, utils_2.getORMType)();
        // Apply TypeORM One-to-Many decorator when using TypeORM
        if (ormType === utils_2.MultiORMEnum.TypeORM) {
            (0, type_orm_1.TypeOrmOneToMany)(typeFunctionOrTarget, inverseSideProperty, options)(target, propertyKey);
        }
        // Apply MikroORM One-to-Many decorator when using MikroORM
        if (ormType === utils_2.MultiORMEnum.MikroORM) {
            (0, mikro_orm_1.MikroOrmOneToMany)(mapOneToManyArgsForMikroORM({
                typeFunctionOrTarget,
                inverseSide: inverseSideProperty,
                options
            }))(target, propertyKey);
        }
    };
}
/**
 * Maps TypeORM OneToMany relation options to MikroORM options for MikroORM integration with TypeORM.
 *
 * @param typeFunctionOrTarget - Type or target function for the related entity.
 * @param inverseSide - Inverse side of the relationship.
 * @param options - Additional options for the One-to-Many relationship.
 * @returns MikroORM-specific One-to-Many relationship options.
 */
function mapOneToManyArgsForMikroORM({ typeFunctionOrTarget, inverseSide, options }) {
    // Cast options to RelationOptions
    const typeOrmOptions = (0, utils_1.deepClone)(options);
    // Initialize an array to store MikroORM cascade options
    let mikroORMCascade = [];
    // Check if TypeORM cascade options are provided
    if (typeOrmOptions?.cascade) {
        // Handle boolean cascade option
        if (typeof typeOrmOptions.cascade === 'boolean') {
            mikroORMCascade = typeOrmOptions.cascade ? [core_1.Cascade.ALL] : [];
        }
        // Handle array cascade options
        if (typeOrmOptions?.cascade instanceof Array) {
            mikroORMCascade = typeOrmOptions.cascade
                .map((c) => {
                switch (c) {
                    case 'insert':
                        return core_1.Cascade.PERSIST;
                    case 'update':
                        return core_1.Cascade.MERGE;
                    case 'remove':
                        return core_1.Cascade.REMOVE;
                    case 'soft-remove':
                    case 'recover':
                        return null;
                    default:
                        return null;
                }
            })
                .filter((c) => c);
        }
    }
    // Create MikroORM relation options
    const mikroOrmOptions = {
        ...(0, underscore_1.omit)(options, 'onDelete', 'onUpdate'),
        entity: typeFunctionOrTarget,
        mappedBy: inverseSide,
        cascade: mikroORMCascade,
        ...(typeOrmOptions?.nullable ? { nullable: typeOrmOptions?.nullable } : {}),
        ...(typeOrmOptions?.lazy ? { lazy: typeOrmOptions?.lazy } : {})
    };
    return mikroOrmOptions;
}
//# sourceMappingURL=one-to-many.decorator.js.map