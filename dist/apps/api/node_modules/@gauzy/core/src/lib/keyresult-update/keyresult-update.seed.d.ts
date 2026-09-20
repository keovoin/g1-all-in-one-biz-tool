import { KeyResultUpdate } from './keyresult-update.entity';
import { DataSource } from 'typeorm';
import { KeyResult } from '../keyresult/keyresult.entity';
import { IOrganization, ITenant } from '@gauzy/contracts';
export declare const createDefaultKeyResultUpdates: (dataSource: DataSource, tenant: ITenant, organization: IOrganization, keyResults: KeyResult[] | void) => Promise<KeyResultUpdate[]>;
