import { Soundshot } from '../entity/soundshot.entity';
declare const CreateSoundshotDTO_base: import("@nestjs/common").Type<Omit<Soundshot, "fileKey" | "id" | "createdAt" | "updatedAt" | "deletedAt">>;
export declare class CreateSoundshotDTO extends CreateSoundshotDTO_base {
}
export {};
