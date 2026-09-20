"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectQueryMapper = exports.filterQuery = void 0;
const typeorm_1 = require("typeorm");
const database_helper_1 = require("./../../database/database.helper");
const filterQuery = (qb, wheres) => {
    qb.andWhere(new typeorm_1.Brackets((bck) => {
        const args = Object.entries(wheres);
        args.forEach((arg) => {
            const [column, entry] = arg;
            // query using find operator
            if (entry instanceof typeorm_1.FindOperator) {
                const operator = entry;
                const { type, value } = operator;
                bck.andWhere(new typeorm_1.Brackets((bck) => {
                    switch (type) {
                        case 'between':
                            const [start, end] = value;
                            bck.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."${column}" ${type} '${start}' AND '${end}'`));
                            break;
                        case 'ilike':
                            bck.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."${column}" ${type} :${column}`), {
                                [column]: value
                            });
                            break;
                        case 'like':
                            bck.andWhere((0, database_helper_1.prepareSQLQuery)(`LOWER("${qb.alias}"."${column}") ${type} LOWER(:${column})`), {
                                [column]: value
                            });
                            break;
                        case 'in':
                            bck.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."${column}" ${type} (:...${column})`), {
                                [column]: value
                            });
                            break;
                        case 'isNull':
                            bck.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."${column}" IS NULL`));
                            break;
                        default:
                            bck.where({ [column]: value });
                            break;
                    }
                }));
            }
            else if (entry instanceof Object) {
                (0, exports.objectQueryMapper)(bck, entry, column);
            }
            else if (entry instanceof Array) {
                bck.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."${column}" IN (:...${column})`), {
                    [column]: entry
                });
            }
            else {
                bck.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."${column}" = :${column}`), {
                    [column]: entry
                });
            }
        });
    }));
    return qb;
};
exports.filterQuery = filterQuery;
const objectQueryMapper = (query, value, alias) => {
    if (value instanceof Object) {
        query.andWhere(new typeorm_1.Brackets((bck) => {
            // relational tables query
            for (let [column, entry] of Object.entries(value)) {
                if (entry instanceof typeorm_1.FindOperator) {
                    const operator = entry;
                    const { type, value } = operator;
                    switch (type) {
                        case 'between':
                            const [start, end] = value;
                            bck.andWhere((0, database_helper_1.prepareSQLQuery)(`"${alias}"."${column}" ${type} '${start}' AND '${end}'`));
                            break;
                        case 'ilike':
                            bck.andWhere((0, database_helper_1.prepareSQLQuery)(`"${alias}"."${column}" ${type} :${column}`), {
                                [column]: value
                            });
                            break;
                        case 'like':
                            bck.andWhere((0, database_helper_1.prepareSQLQuery)(`LOWER("${alias}"."${column}") ${type} LOWER(:${column})`), {
                                [column]: value
                            });
                            break;
                        case 'in':
                            bck.andWhere((0, database_helper_1.prepareSQLQuery)(`"${alias}"."${column}" ${type} (:...${column})`), {
                                [column]: value
                            });
                            break;
                    }
                }
                else if (entry instanceof Object) {
                    (0, exports.objectQueryMapper)(bck, entry, column);
                }
                else if (value instanceof Array) {
                    bck.andWhere((0, database_helper_1.prepareSQLQuery)(`"${alias}"."${column}" IN (:...${column})`), {
                        [column]: value
                    });
                }
                else {
                    bck.andWhere((0, database_helper_1.prepareSQLQuery)(`"${alias}"."${column}" = :${column}`), {
                        [column]: value
                    });
                }
            }
        }));
    }
    return query;
};
exports.objectQueryMapper = objectQueryMapper;
//# sourceMappingURL=query-builder.js.map