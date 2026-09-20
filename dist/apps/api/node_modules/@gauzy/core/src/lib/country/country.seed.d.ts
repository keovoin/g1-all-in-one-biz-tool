import { DataSource } from 'typeorm';
import { ICountry } from '@gauzy/contracts';
export declare const createCountries: (dataSource: DataSource) => Promise<ICountry[]>;
