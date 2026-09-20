import { DataSource } from 'typeorm';
import { IOrganization } from '@gauzy/contracts';
import { ProductCategory } from './product-category.entity';
export declare const createDefaultProductCategories: (dataSource: DataSource, organizations: IOrganization[]) => Promise<ProductCategory[]>;
