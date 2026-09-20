import { DataSource } from 'typeorm';
import { IChangelog } from '@gauzy/contracts';
export declare const createChangelog: (dataSource: DataSource) => Promise<IChangelog[]>;
