import { IPagination } from '@gauzy/contracts';
import { BaseQueryDTO } from './../core/crud';
import { ReportCategory } from './report-category.entity';
import { ReportCategoryService } from './report-category.service';
export declare class ReportCategoryController {
    private reportCategoryService;
    constructor(reportCategoryService: ReportCategoryService);
    findAll(filter?: BaseQueryDTO<ReportCategory>): Promise<IPagination<ReportCategory>>;
}
