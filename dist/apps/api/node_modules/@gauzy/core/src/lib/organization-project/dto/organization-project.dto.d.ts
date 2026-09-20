import { MemberEntityBasedDTO } from '../../core/dto';
import { OrganizationProject } from './../organization-project.entity';
import { UpdateTaskModeDTO } from './update-task-mode.dto';
declare const OrganizationProjectDTO_base: import("@nestjs/common").Type<Pick<OrganizationProject, "name" | "imageId" | "budgetType" | "billing"> & MemberEntityBasedDTO & Partial<UpdateTaskModeDTO>>;
/**
 * Organization Project DTO request validation
 */
export declare class OrganizationProjectDTO extends OrganizationProjectDTO_base {
}
export {};
