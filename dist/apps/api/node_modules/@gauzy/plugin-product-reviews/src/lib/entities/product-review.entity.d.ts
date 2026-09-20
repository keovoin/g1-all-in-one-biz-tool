import { ID, IProduct, IUser } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
import { IProductReview, ProductReviewStatus } from '../product-review.types';
export declare class ProductReview extends TenantOrganizationBaseEntity implements IProductReview {
    title: string;
    description: string;
    rating: number;
    upvotes: number;
    downvotes: number;
    status: ProductReviewStatus;
    editedAt: Date;
    isEdited: boolean;
    /**
     * Product that is being reviewed
     */
    product?: IProduct;
    productId?: ID;
    /**
     * User`s who have reviewed the product
     */
    user?: IUser;
    userId?: ID;
}
