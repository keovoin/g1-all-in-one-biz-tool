import { HttpClient } from '@angular/common/http';
import { IEventType, IEventTypeFindInput, IEventTypeCreateInput, IEventTypeUpdateInput, IPagination, ID } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class EventTypeService {
    private readonly http;
    API_BASE_URI: string;
    constructor(http: HttpClient);
    /**
     * Creates a new event type.
     *
     * @param input - The input data to create a new event type.
     * @returns An observable of the created event type.
     */
    create(input: IEventTypeCreateInput): Promise<any>;
    /**
     * Gets an event type by ID.
     *
     * @param id - The ID of the event type to get.
     * @param relations - Optional array of relations to include in the response.
     * @returns An observable of the event type.
     */
    getEventTypeById(id: ID, relations?: string[]): Promise<IEventType>;
    /**
     * Gets all event types.
     *
     * @param relations
     * @param findInput
     * @returns
     */
    getAll(relations?: string[], findInput?: IEventTypeFindInput): Promise<IPagination<IEventType>>;
    /**
     * Updates an event type.
     *
     * @param id
     * @param input
     * @returns
     */
    update(id: ID, input: IEventTypeUpdateInput): Promise<IEventType>;
    /**
     * Deletes an event type.
     *
     * @param id
     * @returns
     */
    delete(id: ID): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<EventTypeService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EventTypeService>;
}
