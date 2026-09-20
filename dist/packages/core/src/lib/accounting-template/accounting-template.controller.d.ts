import { QueryBus } from '@nestjs/cqrs';
import { FindOptionsWhere, UpdateResult } from 'typeorm';
import { IAccountingTemplate, IAccountingTemplateUpdateInput, ID, IPagination, LanguagesEnum } from '@gauzy/contracts';
import { CrudController, BaseQueryDTO } from '../core/crud';
import { AccountingTemplate } from './accounting-template.entity';
import { AccountingTemplateService } from './accounting-template.service';
import { AccountingTemplateQueryDTO, SaveAccountingTemplateDTO } from './dto';
export declare class AccountingTemplateController extends CrudController<AccountingTemplate> {
    private readonly accountingTemplateService;
    private readonly queryBus;
    constructor(accountingTemplateService: AccountingTemplateService, queryBus: QueryBus);
    /**
     * GET count for accounting template
     *
     * @param options
     * @returns
     */
    getCount(options: FindOptionsWhere<AccountingTemplate>): Promise<number>;
    /**
     * GET accounting templates using pagination params
     *
     * @param options
     * @returns
     */
    pagination(options: BaseQueryDTO<AccountingTemplate>): Promise<IPagination<IAccountingTemplate>>;
    /**
     * GET accounting template
     *
     * @param options
     * @param themeLanguage
     * @returns
     */
    getAccountingTemplate(options: AccountingTemplateQueryDTO, themeLanguage: LanguagesEnum): Promise<IAccountingTemplate>;
    generatePreview(input: any): Promise<any>;
    /**
     * Save accounting template to the organization
     *
     * @param entity
     * @returns
     */
    saveTemplate(entity: SaveAccountingTemplateDTO): Promise<IAccountingTemplate | UpdateResult>;
    findAll(options: BaseQueryDTO<AccountingTemplate>): Promise<IPagination<IAccountingTemplate>>;
    findById(id: ID): Promise<IAccountingTemplate>;
    update(id: ID, input: IAccountingTemplateUpdateInput): Promise<IAccountingTemplate>;
    delete(id: ID): Promise<import("typeorm").DeleteResult>;
}
