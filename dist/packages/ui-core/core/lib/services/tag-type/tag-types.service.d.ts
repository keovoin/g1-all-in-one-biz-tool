import { HttpClient } from '@angular/common/http';
import { IPagination, ITagType, ITagTypesFindInput } from '@gauzy/contracts';
import { CrudService } from '../crud/crud.service';
import * as i0 from "@angular/core";
export declare class TagTypesService extends CrudService<ITagType> {
    static readonly API_URL = "/api/tag-types";
    constructor(http: HttpClient);
    /**
     * Get all tag types with pagination and filter options
     *
     * @param where - Filtering options
     * @param relations - Optional relations to include in the response
     * @returns A promise resolving to a paginated list of tag types
     */
    getTagTypes(where: ITagTypesFindInput, relations?: string[]): Promise<IPagination<ITagType>>;
    /**
     * Get the count of tag types
     *
     * @param where - Optional filter criteria
     * @returns A promise resolving to the count of tag types
     */
    getTagTypesCount(where: ITagTypesFindInput): Promise<number>;
    /**
     * Create a new tag type
     *
     * @param tagType - The tag type data to create
     * @returns A promise resolving to the created tag type
     */
    createTagType(tagType: ITagType): Promise<ITagType>;
    /**
     * Update an existing tag type by its ID
     *
     * @param id - The ID of the tag type to update
     * @param tagType - The new data for the tag type
     * @returns A promise resolving to the updated tag type
     */
    updateTagType(id: string, tagType: ITagType): Promise<ITagType>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TagTypesService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TagTypesService>;
}
