import { ID, IMerchant, IPagination } from '@gauzy/contracts';
import { FindOptionsWhere } from 'typeorm';
import { CrudController, BaseQueryDTO } from './../core/crud';
import { RelationsQueryDTO } from './../shared/dto';
import { Merchant } from './merchant.entity';
import { MerchantService } from './merchant.service';
import { CreateMerchantDTO, UpdateMerchantDTO } from './dto';
export declare class MerchantController extends CrudController<Merchant> {
    private readonly merchantService;
    constructor(merchantService: MerchantService);
    /**
     * GET merchant stores count
     *
     * @param options
     * @returns
     */
    getCount(options: FindOptionsWhere<Merchant>): Promise<IPagination<Merchant>['total']>;
    /**
     * GET merchant stores by pagination
     *
     * @param params
     * @returns
     */
    pagination(params: BaseQueryDTO<Merchant>): Promise<IPagination<IMerchant>>;
    /**
     * GET merchant stores
     *
     * @param params
     * @returns
     */
    findAll(params: BaseQueryDTO<Merchant>): Promise<IPagination<IMerchant>>;
    /**
     * GET merchant by id
     *
     * @param id
     * @param query
     * @returns
     */
    findById(id: ID, query: RelationsQueryDTO): Promise<IMerchant>;
    /**
     * CREATE new merchant store
     *
     * @param entity
     * @returns
     */
    create(entity: CreateMerchantDTO): Promise<IMerchant>;
    /**
     * UPDATE merchant store by id
     *
     * @param id
     * @param entity
     * @returns
     */
    update(id: ID, entity: UpdateMerchantDTO): Promise<IMerchant>;
}
