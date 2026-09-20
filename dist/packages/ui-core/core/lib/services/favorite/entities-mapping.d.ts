import { BaseEntityEnum } from '@gauzy/contracts';
/**
 * Maps entity types to their corresponding FontAwesome icon classes
 * Used for consistent icon representation across the favorites system
 */
export declare const ENTITY_ICONS: Record<BaseEntityEnum, string>;
export declare const ENTITY_LINKS: Record<BaseEntityEnum, (id: string) => string>;
