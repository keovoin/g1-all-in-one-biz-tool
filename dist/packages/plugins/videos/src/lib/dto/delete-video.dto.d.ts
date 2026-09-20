import { ID } from '@gauzy/contracts';
import { IDeleteVideo } from '../video.model';
export declare class DeleteVideoDTO {
    /**
     * The ID of the video to delete
     */
    readonly id: ID;
    /**
     * The options to delete the video
     */
    options?: IDeleteVideo;
}
