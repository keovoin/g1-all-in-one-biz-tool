import { ICountry } from '@gauzy/contracts';
import { BaseEntity } from '../core/entities/internal';
export declare class Country extends BaseEntity implements ICountry {
    isoCode: string;
    country: string;
}
