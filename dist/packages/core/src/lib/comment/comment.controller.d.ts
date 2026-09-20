import { CommandBus } from '@nestjs/cqrs';
import { DeleteResult } from 'typeorm';
import { IComment, ID, IPagination } from '@gauzy/contracts';
import { CrudController, FindOptionsQueryDTO, BaseQueryDTO } from '../core/crud';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';
import { CreateCommentDTO, UpdateCommentDTO } from './dto';
export declare class CommentController extends CrudController<Comment> {
    private readonly commentService;
    private readonly commandBus;
    constructor(commentService: CommentService, commandBus: CommandBus);
    /**
     * Finds all comments filtered by type (or other criteria) with pagination.
     *
     * @param params - Pagination and filter parameters.
     * @returns A promise that resolves with paginated comments.
     */
    findAll(params: BaseQueryDTO<Comment>): Promise<IPagination<IComment>>;
    /**
     * Finds a comment by its id.
     *
     * @param id - The id of the comment.
     * @param params - Optional parameters (e.g., relations to load).
     * @returns The found comment record.
     */
    findById(id: ID, params: FindOptionsQueryDTO<Comment>): Promise<Comment>;
    /**
     * Creates a new comment using the provided DTO.
     *
     * @param createCommentDto - Data transfer object containing comment data.
     * @returns A promise resolving to the created comment.
     */
    create(entity: CreateCommentDTO): Promise<IComment>;
    /**
     * Updates an existing comment identified by the provided id.
     *
     * @param id - The unique identifier of the comment.
     * @param updateCommentDto - The data transfer object containing update data.
     * @returns The updated comment.
     * @throws NotFoundException if the comment does not exist.
     */
    update(id: ID, entity: UpdateCommentDTO): Promise<IComment>;
    /**
     * Deletes a comment identified by the given id.
     *
     * @param id - The unique identifier of the comment to delete.
     * @returns A promise resolving to the result of the delete operation.
     * @throws NotFoundException if the comment is not found.
     */
    delete(id: ID): Promise<DeleteResult>;
}
