import { EventBus } from '@nestjs/cqrs';
import { UpdateResult } from 'typeorm';
import { IComment, ICommentCreateInput, ICommentUpdateInput, ID } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../core/crud';
import { EmployeeService } from '../employee/employee.service';
import { MentionService } from '../mention/mention.service';
import { Comment } from './comment.entity';
import { TypeOrmCommentRepository } from './repository/type-orm-comment.repository';
import { MikroOrmCommentRepository } from './repository/mikro-orm-comment.repository';
export declare class CommentService extends TenantAwareCrudService<Comment> {
    readonly typeOrmCommentRepository: TypeOrmCommentRepository;
    readonly mikroOrmCommentRepository: MikroOrmCommentRepository;
    private readonly _eventBus;
    private readonly _employeeService;
    private readonly _mentionService;
    constructor(typeOrmCommentRepository: TypeOrmCommentRepository, mikroOrmCommentRepository: MikroOrmCommentRepository, _eventBus: EventBus, _employeeService: EmployeeService, _mentionService: MentionService);
    /**
     * Creates a new comment with the provided input, handling employee validation,
     * publishing mention notifications, and subscribing the comment creator to the related entity.
     *
     * This function retrieves context-specific IDs from the RequestContext (tenant, employee)
     * and falls back to the values in the input if necessary. It verifies that the employee exists,
     * creates the comment, publishes mention notifications for each mentioned employee, and
     * triggers a subscription event for the creator.
     *
     * @param {ICommentCreateInput} input - The input data required to create a comment, including text, mentions, and organization details.
     * @returns {Promise<IComment>} A promise that resolves to the newly created comment.
     * @throws {NotFoundException} If the employee associated with the comment is not found.
     * @throws {BadRequestException} If any error occurs during the creation of the comment.
     */
    create(input: ICommentCreateInput): Promise<IComment>;
    /**
     * Updates an existing comment based on the provided id and update input.
     *
     * This function first retrieves the current employee's ID from the request context,
     * then attempts to locate the comment matching the provided id and employeeId.
     * If the comment is found, it creates an updated version of the comment using the input data.
     * Additionally, it synchronizes any mention updates via the _mentionService.
     *
     * @param {ID} id - The unique identifier of the comment to update.
     * @param {ICommentUpdateInput} input - The update data for the comment, including any mention updates.
     * @returns {Promise<IComment | UpdateResult>} A promise that resolves to the updated comment or an update result.
     * @throws {BadRequestException} If the comment is not found or if the update operation fails.
     */
    update(id: ID, input: ICommentUpdateInput): Promise<IComment | UpdateResult>;
}
