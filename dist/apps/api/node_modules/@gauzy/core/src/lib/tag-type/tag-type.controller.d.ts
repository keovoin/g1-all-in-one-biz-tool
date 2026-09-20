import { FindOptionsWhere, UpdateResult } from 'typeorm';
import { ID, IPagination, ITagType } from '@gauzy/contracts';
import { CrudController, BaseQueryDTO } from '../core/crud';
import { TagType } from './tag-type.entity';
import { TagTypeService } from './tag-type.service';
import { CreateTagTypeDTO, UpdateTagTypeDTO } from './dto';
export declare class TagTypeController extends CrudController<TagType> {
    private readonly tagTypesService;
    constructor(tagTypesService: TagTypeService);
    /**
     * GET tag types count
     *
     * @param data
     * @returns
     */
    getCount(options: FindOptionsWhere<TagType>): Promise<number>;
    /**
     * GET all tag types
     *
     * @param options
     * @returns
     */
    findAll(options: BaseQueryDTO<TagType>): Promise<IPagination<TagType>>;
    /**
     * Create new tag type
     *
     * @param entity
     * @returns
     */
    create(entity: CreateTagTypeDTO): Promise<ITagType>;
    /**
     * Update existing tag Type by ID
     *
     * @param id
     * @param entity
     * @returns
     */
    update(id: ID, entity: UpdateTagTypeDTO): Promise<ITagType | UpdateResult>;
}
