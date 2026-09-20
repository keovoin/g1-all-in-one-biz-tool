import { Video } from '../entities/video.entity';
declare const BaseVideoDTO_base: import("@nestjs/common").Type<Omit<Video, "file" | "id" | "createdAt" | "updatedAt" | "deletedAt">>;
export declare class BaseVideoDTO extends BaseVideoDTO_base {
}
export {};
