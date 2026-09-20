import { CreateVideoHandler } from './create-video.handler';
import { DeleteVideoHandler } from './delete-video.handler';
import { UpdateVideoHandler } from './update-video.handler';
export declare const CommandHandlers: (typeof CreateVideoHandler | typeof DeleteVideoHandler | typeof UpdateVideoHandler)[];
