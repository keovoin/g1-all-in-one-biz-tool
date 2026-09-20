import { FiltersQueryDTO, SelectorsQueryDTO, RelationsQueryDTO } from '../../../shared/dto';
declare const CustomTrackingSessionsQueryDTO_base: import("@nestjs/common").Type<FiltersQueryDTO & RelationsQueryDTO & SelectorsQueryDTO>;
/**
 * DTO for querying custom tracking sessions
 */
export declare class CustomTrackingSessionsQueryDTO extends CustomTrackingSessionsQueryDTO_base {
    /**
     * Whether to group by sessionId
     */
    readonly groupBySession?: boolean;
    /**
     * Whether to include decoded data in the response
     */
    readonly includeDecodedData?: boolean;
    /**
     * Filter by specific session ID
     */
    readonly sessionId?: string;
}
export {};
