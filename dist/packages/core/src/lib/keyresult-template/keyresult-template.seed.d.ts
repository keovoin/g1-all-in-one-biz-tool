import { DataSource } from 'typeorm';
import { ITenant } from '@gauzy/contracts';
import { KeyResultTemplate } from './keyresult-template.entity';
export declare const createDefaultKeyResultTemplates: (dataSource: DataSource, tenant: ITenant) => Promise<KeyResultTemplate[]>;
