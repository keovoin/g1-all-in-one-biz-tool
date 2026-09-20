import { TenantAwareCrudService } from '@gauzy/core';
import { IPluginCategoryFindInput, IPluginCategoryTree } from '../../shared/models';
import { PluginCategory } from '../entities/plugin-category.entity';
import { MikroOrmPluginCategoryRepository } from '../repositories/mikro-orm-plugin-category.repository';
import { TypeOrmPluginCategoryRepository } from '../repositories/type-orm-plugin-category.repository';
export declare class PluginCategoryService extends TenantAwareCrudService<PluginCategory> {
    readonly typeOrmPluginCategoryRepository: TypeOrmPluginCategoryRepository;
    readonly mikroOrmPluginCategoryRepository: MikroOrmPluginCategoryRepository;
    constructor(typeOrmPluginCategoryRepository: TypeOrmPluginCategoryRepository, mikroOrmPluginCategoryRepository: MikroOrmPluginCategoryRepository);
    /**
     * Get hierarchical tree of plugin categories
     */
    getTree(options?: IPluginCategoryFindInput): Promise<IPluginCategoryTree[]>;
    /**
     * Check if a category is a descendant of another category
     */
    isDescendantOf(ancestorId: string, descendantId: string): Promise<boolean>;
    /**
     * Get all ancestors of a category
     */
    getAncestors(categoryId: string): Promise<PluginCategory[]>;
    /**
     * Get all descendants of a category
     */
    getDescendants(categoryId: string): Promise<PluginCategory[]>;
    /**
     * Build hierarchical tree structure from flat category list
     */
    private buildTree;
    /**
     * Validate category hierarchy rules
     */
    validateHierarchy(categoryId: string, parentId?: string): Promise<void>;
    /**
     * Generate unique slug from name
     */
    generateUniqueSlug(name: string, tenantId: string, organizationId: string, excludeId?: string): Promise<string>;
}
