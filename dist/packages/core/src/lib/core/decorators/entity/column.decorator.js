"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiORMColumn = MultiORMColumn;
const core_1 = require("@mikro-orm/core");
const typeorm_1 = require("typeorm");
const utils_1 = require("@gauzy/utils");
const column_helper_1 = require("./column.helper");
const utils_2 = require("../../utils");
/**
 * Decorator for creating column definitions for both MikroORM and TypeORM.
 * Applies only the active ORM's decorator based on the DB_ORM environment variable.
 *
 * `primary` must reach BOTH ORMs, not just TypeORM. The options object is forwarded
 * verbatim to TypeORM's `@Column()`, which understands `primary: true`; the MikroORM side
 * used to always emit a plain `@Property()`, so a column declared
 * `@MultiORMColumn({ primary: true })` gave TypeORM a primary key and MikroORM none, and
 * `discoverEntities` refused to boot the API with
 * `MetadataError: <Entity> is missing @PrimaryKey()`. When `primary` is set we therefore
 * emit MikroORM's `@PrimaryKey()` instead of `@Property()`, with the same mapped options.
 *
 * @template T - The type of the column.
 * @param typeOrOptions - The column type or additional options if provided.
 * @param options - The options for the column.
 * @returns PropertyDecorator.
 */
function MultiORMColumn(typeOrOptions, options) {
    // normalize parameters
    let type;
    if (typeof typeOrOptions === 'string' || typeof typeOrOptions === 'function') {
        // If typeOrOptions is a string or function, set 'type' to the resolved type and 'options' to an empty object.
        type = (0, column_helper_1.resolveDbType)(typeOrOptions);
    }
    else if ((0, utils_1.isObject)(typeOrOptions)) {
        // If typeOrOptions is an object, assume it is 'options' and set 'type' accordingly.
        options = typeOrOptions;
        type = (0, column_helper_1.resolveDbType)(options.type);
    }
    // Ensure 'options' is initialized to an empty object if it is null or undefined.
    if (!options)
        options = {};
    return (target, propertyKey) => {
        // Determine which ORM is in use
        const ormType = (0, utils_2.getORMType)();
        // Apply TypeORM decorator when using TypeORM
        if (ormType === utils_2.MultiORMEnum.TypeORM) {
            (0, typeorm_1.Column)({ type, ...options })(target, propertyKey);
        }
        // Apply MikroORM decorator when using MikroORM
        if (ormType === utils_2.MultiORMEnum.MikroORM) {
            // Generic left to inference, as before: `Property()`/`PrimaryKey()` constrain their type
            // parameter to `object`, so an explicit `<T>` (the column's value type) would not fit.
            const mikroOrmOptions = (0, column_helper_1.parseMikroOrmColumnOptions)({ type, options });
            if (options.primary) {
                // Unlike `Property()`, MikroORM's `PrimaryKey()` does not rename the `name` option
                // to `fieldName` when it differs from the class property (compare the two files in
                // @mikro-orm/core/decorators/) — it would register the property under the database
                // column name instead. Do that rename here so a primary column keeps behaving like
                // every other `@MultiORMColumn`.
                const { name: columnName, ...rest } = mikroOrmOptions;
                (0, core_1.PrimaryKey)(columnName && columnName !== propertyKey ? { ...rest, fieldName: columnName } : mikroOrmOptions)(target, propertyKey);
            }
            else {
                (0, core_1.Property)(mikroOrmOptions)(target, propertyKey);
            }
        }
    };
}
//# sourceMappingURL=column.decorator.js.map