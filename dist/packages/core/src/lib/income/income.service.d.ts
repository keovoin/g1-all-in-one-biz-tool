import { FindManyOptions } from 'typeorm';
import { IIncome, IPagination } from '@gauzy/contracts';
import { BaseQueryDTO, TenantAwareCrudService } from './../core/crud';
import { Income } from './income.entity';
import { MikroOrmIncomeRepository } from './repository/mikro-orm-income.repository';
import { TypeOrmIncomeRepository } from './repository/type-orm-income.repository';
export declare class IncomeService extends TenantAwareCrudService<Income> {
    readonly typeOrmIncomeRepository: TypeOrmIncomeRepository;
    readonly mikroOrmIncomeRepository: MikroOrmIncomeRepository;
    constructor(typeOrmIncomeRepository: TypeOrmIncomeRepository, mikroOrmIncomeRepository: MikroOrmIncomeRepository);
    /**
     * Retrieves a paginated list of incomes, optionally filtering by a specific month.
     *
     * @param filter - Optional filtering options for incomes.
     * @param filterDate - Optional date string used to filter incomes for its month.
     * @returns A promise that resolves to a paginated list of incomes.
     */
    findAllIncomes(filter?: FindManyOptions<Income>, filterDate?: string): Promise<IPagination<Income>>;
    /**
     * Computes the average of the non-falsy numbers in the given array.
     *
     * @param data - An array of numbers.
     * @returns The average of the non-falsy numbers, or 0 if there are none.
     */
    countStatistic(data: number[]): number;
    /**
     * Paginates records for SomeEntity based on provided filters.
     *
     * @param filter - Pagination parameters including custom filters.
     * @returns A promise resolving to paginated results.
     */
    pagination(filter?: BaseQueryDTO<any>): Promise<IPagination<IIncome>>;
}
