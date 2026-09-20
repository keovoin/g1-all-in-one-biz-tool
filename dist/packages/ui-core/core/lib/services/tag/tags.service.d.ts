import { HttpClient } from '@angular/common/http';
import { IPagination, ITag, ITagFindInput } from '@gauzy/contracts';
import { CrudService } from '../crud/crud.service';
import * as i0 from "@angular/core";
export declare class TagsService extends CrudService<ITag> {
    static readonly API_URL = "/api/tags";
    constructor(http: HttpClient);
    /**
     * Get tags
     *
     * @param relations
     * @param findInput
     * @returns
     */
    getTags(where: ITagFindInput, relations?: string[]): Promise<IPagination<ITag>>;
    /**
     * Get tags by level
     *
     * @param where
     * @param relations
     * @returns
     */
    getTagsByLevel(where: ITagFindInput, relations?: string[]): Promise<IPagination<ITag>>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TagsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TagsService>;
}
