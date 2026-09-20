import { IIntegration, IIntegrationType } from '@gauzy/contracts';
import { BaseEntity } from '../core/entities/internal';
export declare class IntegrationType extends BaseEntity implements IIntegrationType {
    name: string;
    description: string;
    icon: string;
    groupName: string;
    order: number;
    integrations: IIntegration[];
}
