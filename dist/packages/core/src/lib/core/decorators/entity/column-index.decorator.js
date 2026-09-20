"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnIndex = ColumnIndex;
exports.applyTypeOrmIndex = applyTypeOrmIndex;
exports.applyMikroOrmIndex = applyMikroOrmIndex;
exports.parseToMikroOrmIndexOptions = parseToMikroOrmIndexOptions;
const typeorm_1 = require("typeorm");
const core_1 = require("@mikro-orm/core");
const utils_1 = require("@gauzy/utils");
const utils_2 = require("../../utils");
/**
 * ColumnIndex decorator for TypeOrm and MikroOrm.
 * Applies only the active ORM's index decorator based on the DB_ORM environment variable.
 *
 * @param nameOrFieldsOrOptions
 * @param maybeFieldsOrOptions
 * @param maybeOptions
 * @returns
 */
function ColumnIndex(nameOrFieldsOrOptions, maybeFieldsOrOptions, maybeOptions) {
    // normalize parameters
    const name = typeof nameOrFieldsOrOptions === 'string' ? nameOrFieldsOrOptions : undefined;
    const fields = typeof nameOrFieldsOrOptions === 'string'
        ? maybeFieldsOrOptions
        : nameOrFieldsOrOptions;
    let options = (0, utils_1.isPlainObject)(nameOrFieldsOrOptions) ? nameOrFieldsOrOptions : maybeOptions;
    if (!options) {
        options = (0, utils_1.isPlainObject)(maybeFieldsOrOptions) ? maybeFieldsOrOptions : maybeOptions;
    }
    /**
     * Decorator for applying indexes in both TypeORM and MikroORM.
     * It can be used to decorate fields in an entity class.
     *
     * @param target The prototype of the class (in case of class decorator) or the constructor of the class (in case of property decorator).
     * @param propertyKey The name of the property to which the decorator is applied. This is undefined for class decorators.
     */
    return (target, propertyKey) => {
        // Determine which ORM is in use
        const ormType = (0, utils_2.getORMType)();
        // Apply TypeORM index when using TypeORM
        if (ormType === utils_2.MultiORMEnum.TypeORM) {
            applyTypeOrmIndex(target, propertyKey, name, fields, options);
        }
        // Apply MikroORM index when using MikroORM
        if (ormType === utils_2.MultiORMEnum.MikroORM) {
            applyMikroOrmIndex(target, propertyKey, name, fields, options);
        }
    };
}
/**
 * Applies a TypeORM index to the specified target.
 *
 * @param target The class or class property to which the index will be applied.
 * @param propertyKey The name of the property, if applying to a specific property.
 * @param name Optional name of the index for named indexes.
 * @param properties Optional list of properties to be indexed.
 * @param options Optional TypeORM indexing options.
 */
function applyTypeOrmIndex(target, propertyKey, name, fields, options = {}) {
    if (name && fields) {
        // Applies a named index on specified properties with additional options
        (0, typeorm_1.Index)(name, fields, options)(target, propertyKey);
    }
    else if (name) {
        // Applies a named index with additional options (without specifying properties)
        (0, typeorm_1.Index)(name, options)(target, propertyKey);
    }
    else if (fields) {
        // Applies an index on specified properties without a name or additional options
        (0, typeorm_1.Index)(fields)(target, propertyKey);
    }
    else if (options) {
        // Applies an index with only options, without specifying a name or properties
        (0, typeorm_1.Index)(options)(target, propertyKey);
    }
    else {
        // Applies a default index when no name, properties, or options are specified
        (0, typeorm_1.Index)()(target, propertyKey);
    }
}
/**
 * Applies a MikroORM index to the specified target. If 'unique' option is set,
 * also applies a unique constraint. This function adapts TypeORM index options
 * to MikroORM.
 *
 * @param target The class or class property to which the index will be applied.
 * @param propertyKey The name of the property, if applying to a specific property.
 * @param name Optional name of the index for named indexes.
 * @param properties Optional list of properties to be indexed.
 * @param options Optional TypeORM indexing options that will be adapted for MikroORM.
 */
function applyMikroOrmIndex(target, propertyKey, name, properties, options) {
    // Converts provided indexing parameters into MikroORM-compatible index options.
    const mikroOptions = parseToMikroOrmIndexOptions({ name, properties });
    if (mikroOptions.name && mikroOptions.properties && Array.isArray(properties)) {
        // Applies a named index on specified properties
        (0, core_1.Index)(mikroOptions)(target, propertyKey);
    }
    else if (mikroOptions.name) {
        // Applies a named index without specific properties
        (0, core_1.Index)({ name: mikroOptions.name })(target, propertyKey);
    }
    else {
        // Applies a default index without specific options or fields
        (0, core_1.Index)({})(target, propertyKey);
    }
    // Apply a MikroORM unique constraint if 'unique' is specified in the options
    if (options?.unique && Array.isArray(properties)) {
        (0, core_1.Unique)({ properties: properties })(target, propertyKey);
    }
}
/**
 * Transforms index options from TypeORM format to MikroORM format.
 * This function should be implemented based on the specific requirements and
 * differences between TypeORM and MikroORM index options.
 *
 * @param options The TypeORM index options to be transformed.
 * @returns The transformed MikroORM index options.
 */
function parseToMikroOrmIndexOptions(options) {
    // Logic to transform options to MikroORM compatible format
    // This is a placeholder, actual implementation depends on how the options differ.
    return options;
}
//# sourceMappingURL=column-index.decorator.js.map