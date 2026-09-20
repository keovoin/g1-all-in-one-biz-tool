import { ObjectLiteral, SelectQueryBuilder, WhereExpressionBuilder } from "typeorm";
export declare const filterQuery: <T>(qb: SelectQueryBuilder<T>, wheres: ObjectLiteral) => SelectQueryBuilder<T>;
export declare const objectQueryMapper: (query: WhereExpressionBuilder, value: ObjectLiteral, alias: string) => WhereExpressionBuilder;
