import { Repository } from 'typeorm';
import { ProductReview } from '../product-review.entity';
export declare class TypeOrmProductReviewRepository extends Repository<ProductReview> {
    readonly repository: Repository<ProductReview>;
    constructor(repository: Repository<ProductReview>);
}
