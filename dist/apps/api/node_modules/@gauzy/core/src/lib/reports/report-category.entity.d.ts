import { IReport, IReportCategory } from '@gauzy/contracts';
import { BaseEntity } from '../core/entities/internal';
export declare class ReportCategory extends BaseEntity implements IReportCategory {
    name?: string;
    iconClass?: string;
    /**
     *
     */
    reports: IReport[];
}
