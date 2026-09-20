import { SelectQueryBuilder } from 'typeorm';
/**
 * Adds a date range condition to a TypeORM query builder
 * @param query - The TypeORM SelectQueryBuilder instance
 * @param field - The date field to filter on
 * @param from - Start date (inclusive, UTC)
 * @param to - End date (inclusive, UTC)
 * @param p - Optional transform function for the query string
 * @returns Modified query builder instance
 * @throws a BadRequestException if from date is after to date
 */
export declare function addBetween<T>(query: SelectQueryBuilder<T>, field: string, from?: Date, to?: Date, p?: (queryStr: string) => string): SelectQueryBuilder<T>;
