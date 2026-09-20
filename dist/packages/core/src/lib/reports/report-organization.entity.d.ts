import { IReport, IReportOrganization } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class ReportOrganization extends TenantOrganizationBaseEntity implements IReportOrganization {
    isEnabled?: boolean;
    report?: IReport;
    reportId?: IReport['id'];
}
