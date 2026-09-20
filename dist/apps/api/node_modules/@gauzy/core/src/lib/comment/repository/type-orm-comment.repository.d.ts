import { Repository } from 'typeorm';
import { Comment } from '../comment.entity';
export declare class TypeOrmCommentRepository extends Repository<Comment> {
    readonly repository: Repository<Comment>;
    constructor(repository: Repository<Comment>);
}
