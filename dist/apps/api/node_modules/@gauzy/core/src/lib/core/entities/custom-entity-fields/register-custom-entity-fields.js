"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerFields = void 0;
exports.registerTypeOrmCustomFields = registerTypeOrmCustomFields;
exports.registerMikroOrmCustomFields = registerMikroOrmCustomFields;
const typeorm_1 = require("typeorm");
const core_1 = require("@mikro-orm/core");
const chalk = require("chalk");
const column_helper_1 = require("../../../core/decorators/entity/column.helper");
const decorators_1 = require("../../../core/decorators");
const column_index_decorator_1 = require("../../../core/decorators/entity/column-index.decorator");
const utils_1 = require("../../../core/utils");
const custom_entity_fields_1 = require("./custom-entity-fields");
const mikro_orm_base_custom_entity_field_1 = require("./mikro-orm-base-custom-entity-field");
/**
 * Defines a column with or without a relation ID and optional indexing.
 * Applies only the decorator for the specified ORM type.
 *
 * @param config - The application configuration.
 * @param customField - Configuration for the custom field.
 * @param name - The name of the field.
 * @param instance - The instance of the class where the field is defined.
 * @param ormType - The ORM type ('typeorm' or 'mikro-orm') to apply decorators for.
 */
const defineColumn = (config, customField, name, instance, ormType) => {
    const { nullable, relationId, index = false } = customField;
    // Get the database type from the connection options
    let dbEngine = (0, utils_1.getDBType)(config.dbConnectionOptions);
    const options = {
        type: (0, column_helper_1.getColumnType)(dbEngine, customField.type),
        name,
        nullable: nullable === false ? false : true,
        unique: customField.unique ?? false
    };
    if (ormType === 'typeorm') {
        // Apply TypeORM-specific decorators
        if (relationId) {
            (0, typeorm_1.RelationId)((it) => it.customFields[customField.relation])(instance, name);
        }
        if (index) {
            (0, column_index_decorator_1.applyTypeOrmIndex)(instance, name, undefined, undefined, {});
        }
        (0, typeorm_1.Column)(options)(instance, name);
    }
    else {
        // Apply MikroORM-specific decorators
        if (index) {
            (0, column_index_decorator_1.applyMikroOrmIndex)(instance, name, undefined, undefined, {});
        }
        const type = (0, column_helper_1.resolveDbType)(options.type);
        (0, core_1.Property)((0, column_helper_1.parseMikroOrmColumnOptions)({ type, options: options }))(instance, name);
    }
};
/**
 * Registers a custom field for an entity based on the custom field configuration.
 * Uses MultiORM* decorators for relations (which already have ORM-type guards)
 * but ORM-specific decorators for columns and indexes.
 *
 * @param config - The application configuration.
 * @param customField - The custom field configuration.
 * @param name - The name of the custom field.
 * @param instance - The entity instance to which the field is being registered.
 * @param ormType - The ORM type ('typeorm' or 'mikro-orm') to apply decorators for.
 */
const registerFields = async (config, customField, name, instance, ormType) => {
    if (customField.type === 'relation') {
        switch (customField.relationType) {
            case 'many-to-many': {
                const options = {
                    ...(customField.pivotTable && { pivotTable: customField.pivotTable }),
                    ...(customField.joinColumn && { joinColumn: customField.joinColumn }),
                    ...(customField.inverseJoinColumn && { inverseJoinColumn: customField.inverseJoinColumn })
                };
                // MultiORMManyToMany already has ORM-type guards via getORMType()
                (0, decorators_1.MultiORMManyToMany)(() => customField.entity, customField.inverseSide, options)(instance, name);
                (0, typeorm_1.JoinTable)({ name: customField.pivotTable })(instance, name);
                break;
            }
            case 'many-to-one': {
                const options = {
                    nullable: customField.nullable === false ? false : true,
                    unique: customField.unique ?? false,
                    ...(customField.onDelete && { onDelete: customField.onDelete })
                };
                // MultiORMManyToOne already has ORM-type guards via getORMType()
                (0, decorators_1.MultiORMManyToOne)(() => customField.entity, customField.inverseSide, options)(instance, name);
                (0, typeorm_1.JoinColumn)()(instance, name);
                break;
            }
            default:
                throw new Error(`Unsupported relation type: ${customField.relationType}`);
        }
    }
    else {
        defineColumn(config, customField, name, instance, ormType);
    }
};
exports.registerFields = registerFields;
/**
 * Registers custom fields for a specific entity in the provided application configuration.
 * Uses ORM-specific decorators based on the ormType parameter.
 *
 * @param config - The application configuration.
 * @param entityName - The name of the entity for which custom fields are registered.
 * @param ctor - The constructor function for the custom fields.
 * @param ormType - The ORM type ('typeorm' or 'mikro-orm') to apply decorators for.
 */
async function registerCustomFieldsForEntity(config, entityName, ctor, ormType) {
    // Get the list of custom fields for the specified entity, defaulting to an empty array if none are found
    const customFields = config.customFields?.[entityName] ?? [];
    // Create a single instance of the constructor
    const instance = new ctor();
    // Register each custom field
    await Promise.all(customFields.map(async (customField) => {
        const { name } = customField; // Destructure to get property path
        await (0, exports.registerFields)(config, customField, name, instance, ormType); // Register the custom column
    }));
    /**
     * If there are only relations are defined for an Entity for customFields, then TypeORM not saving relations for entity ("Cannot set properties of undefined (<fieldName>)").
     * So we have to add a "fake" column to the customFields embedded type to prevent this error from occurring.
     */
    if (customFields.length > 0) {
        if (ormType === 'typeorm') {
            // Apply TypeORM Column directly
            (0, typeorm_1.Column)({
                type: 'boolean',
                nullable: true,
                select: false // This ensures the property is not selected by default
            })(instance, mikro_orm_base_custom_entity_field_1.__FIX_RELATIONAL_CUSTOM_FIELDS__);
        }
        else {
            // Apply MikroORM Property directly
            (0, core_1.Property)({
                type: 'boolean',
                nullable: true,
                hidden: true
            })(instance, mikro_orm_base_custom_entity_field_1.__FIX_RELATIONAL_CUSTOM_FIELDS__);
        }
    }
}
/**
 * Registers custom fields for TypeORM entities based on a given configuration.
 *
 * @param config The configuration for the application plugins.
 * @throws Error if there's a failure during the registration process.
 */
async function registerTypeOrmCustomFields(config) {
    console.time(chalk.yellow('✔ Registering Custom Entity Fields for TypeORM'));
    try {
        // Loop through the custom field registrations and register each for the corresponding entity
        for (const registration of custom_entity_fields_1.typeOrmCustomEntityFieldRegistrations) {
            await registerCustomFieldsForEntity(config, registration.entityName, registration.customFields, 'typeorm');
        }
    }
    catch (error) {
        console.error('Error registering custom entity fields:', error);
        throw new Error('Failed to register custom entity fields');
    }
    console.timeEnd(chalk.yellow('✔ Registering Custom Entity Fields for TypeORM'));
}
/**
 * Registers custom fields for MikroORM entities based on a given configuration.
 *
 * @param config The configuration for the application plugins.
 * @throws Error if there's a failure during the registration process.
 */
async function registerMikroOrmCustomFields(config) {
    console.time(chalk.yellow('✔ Registering Custom Entity Fields for MikroORM'));
    try {
        // Loop through the custom field registrations for MikroORM
        for (const registration of custom_entity_fields_1.mikroOrmCustomEntityFieldRegistrations) {
            await registerCustomFieldsForEntity(config, registration.entityName, registration.customFields, 'mikro-orm');
        }
    }
    catch (error) {
        console.error('Error registering custom entity fields for MikroORM:', error);
        throw new Error('Failed to register custom entity fields for MikroORM');
    }
    console.timeEnd(chalk.yellow('✔ Registering Custom Entity Fields for MikroORM'));
}
//# sourceMappingURL=register-custom-entity-fields.js.map