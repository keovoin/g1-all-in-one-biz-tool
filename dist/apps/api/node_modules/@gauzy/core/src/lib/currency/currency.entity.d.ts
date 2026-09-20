import { ICurrency } from '@gauzy/contracts';
import { BaseEntity } from '../core/entities/internal';
export declare class Currency extends BaseEntity implements ICurrency {
    isoCode: string;
    currency: string;
}
