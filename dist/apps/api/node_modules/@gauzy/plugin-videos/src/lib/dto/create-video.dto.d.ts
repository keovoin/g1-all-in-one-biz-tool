import { BaseVideoDTO } from './base-video.dto';
import { FileDTO } from './file.dto';
export declare class CreateVideoDTO extends BaseVideoDTO {
    title: string;
    file: FileDTO;
}
