import { Camshot } from '../entity/camshot.entity';
declare const CreateCamshotDTO_base: import("@nestjs/common").Type<Omit<Camshot, "fileKey" | "thumbKey" | "title" | "id" | "createdAt" | "updatedAt" | "deletedAt">>;
export declare class CreateCamshotDTO extends CreateCamshotDTO_base {
}
export {};
