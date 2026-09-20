import { DataSource } from 'typeorm';
import { ICurrency } from '@gauzy/contracts';
export declare const createCurrencies: (dataSource: DataSource) => Promise<ICurrency[]>;
