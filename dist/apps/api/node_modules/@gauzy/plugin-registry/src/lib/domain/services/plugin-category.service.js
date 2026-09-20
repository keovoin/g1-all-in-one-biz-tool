"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginCategoryService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const plugin_category_entity_1 = require("../entities/plugin-category.entity");
const mikro_orm_plugin_category_repository_1 = require("../repositories/mikro-orm-plugin-category.repository");
const type_orm_plugin_category_repository_1 = require("../repositories/type-orm-plugin-category.repository");
let PluginCategoryService = class PluginCategoryService extends core_1.TenantAwareCrudService {
    constructor(typeOrmPluginCategoryRepository, mikroOrmPluginCategoryRepository) {
        super(typeOrmPluginCategoryRepository, mikroOrmPluginCategoryRepository);
        this.typeOrmPluginCategoryRepository = typeOrmPluginCategoryRepository;
        this.mikroOrmPluginCategoryRepository = mikroOrmPluginCategoryRepository;
    }
    /**
     * Get hierarchical tree of plugin categories
     */
    async getTree(options) {
        switch (this.ormType) {
            case core_1.MultiORMEnum.MikroORM: {
                // MikroORM: Use Knex for the tree query with filtering
                const knex = this.mikroOrmRepository.getKnex();
                let qb = knex('plugin_category as category').leftJoin('plugin_category as parent', 'category.parentId', 'parent.id');
                if (options?.isActive !== undefined) {
                    qb = qb.where('category.isActive', options.isActive);
                }
                if (options?.name) {
                    qb = qb.andWhere('category.name', 'ILIKE', `%${options.name}%`);
                }
                qb = qb.select('category.*').orderBy('category.order', 'asc').orderBy('category.name', 'asc');
                const rawCategories = await qb;
                const categories = rawCategories.map((row) => this.mikroOrmRepository.map(row));
                // Build tree structure
                return this.buildTree(categories);
            }
            case core_1.MultiORMEnum.TypeORM:
            default: {
                const queryBuilder = this.typeOrmPluginCategoryRepository.createQueryBuilder('category');
                // Add conditions based on options
                if (options?.isActive !== undefined) {
                    queryBuilder.andWhere('category.isActive = :isActive', { isActive: options.isActive });
                }
                if (options?.name) {
                    queryBuilder.andWhere('category.name ILIKE :name', { name: `%${options.name}%` });
                }
                // Get all categories with their relationships
                const categories = await queryBuilder
                    .leftJoinAndSelect('category.parent', 'parent')
                    .leftJoinAndSelect('category.children', 'children')
                    .leftJoinAndSelect('category.plugins', 'plugins')
                    .orderBy('category.order', 'ASC')
                    .addOrderBy('category.name', 'ASC')
                    .getMany();
                // Build tree structure
                return this.buildTree(categories);
            }
        }
    }
    /**
     * Check if a category is a descendant of another category
     */
    async isDescendantOf(ancestorId, descendantId) {
        switch (this.ormType) {
            case core_1.MultiORMEnum.MikroORM: {
                // MikroORM: Walk the parent chain from descendantId to check for ancestorId
                const descendants = await this.getDescendants(ancestorId);
                return descendants.some((desc) => desc.id === descendantId);
            }
            case core_1.MultiORMEnum.TypeORM:
            default: {
                const treeRepo = this.typeOrmPluginCategoryRepository.manager.getTreeRepository(plugin_category_entity_1.PluginCategory);
                const ancestor = await treeRepo.findOne({
                    where: { id: ancestorId }
                });
                if (!ancestor) {
                    return false;
                }
                const descendants = await treeRepo.findDescendants(ancestor);
                return descendants.some((desc) => desc.id === descendantId);
            }
        }
    }
    /**
     * Get all ancestors of a category
     */
    async getAncestors(categoryId) {
        switch (this.ormType) {
            case core_1.MultiORMEnum.MikroORM: {
                // MikroORM: Walk the parent chain iteratively
                const ancestors = [];
                let currentId = categoryId;
                while (currentId) {
                    const category = await this.mikroOrmRepository.findOne({ id: currentId }, {
                        populate: ['parent']
                    });
                    if (!category || !category.parentId)
                        break;
                    const parent = await this.mikroOrmRepository.findOne({ id: category.parentId });
                    if (parent) {
                        ancestors.push(parent);
                        currentId = parent.parentId;
                    }
                    else {
                        break;
                    }
                }
                return ancestors;
            }
            case core_1.MultiORMEnum.TypeORM:
            default: {
                const treeRepo = this.typeOrmPluginCategoryRepository.manager.getTreeRepository(plugin_category_entity_1.PluginCategory);
                const category = await treeRepo.findOne({
                    where: { id: categoryId }
                });
                if (!category) {
                    return [];
                }
                return await treeRepo.findAncestors(category);
            }
        }
    }
    /**
     * Get all descendants of a category
     */
    async getDescendants(categoryId) {
        switch (this.ormType) {
            case core_1.MultiORMEnum.MikroORM: {
                // MikroORM: Find all children recursively
                const descendants = [];
                const children = await this.mikroOrmRepository.find({ parentId: categoryId });
                for (const child of children) {
                    descendants.push(child);
                    const grandChildren = await this.getDescendants(child.id);
                    descendants.push(...grandChildren);
                }
                return descendants;
            }
            case core_1.MultiORMEnum.TypeORM:
            default: {
                const treeRepo = this.typeOrmPluginCategoryRepository.manager.getTreeRepository(plugin_category_entity_1.PluginCategory);
                const category = await treeRepo.findOne({
                    where: { id: categoryId }
                });
                if (!category) {
                    return [];
                }
                return await treeRepo.findDescendants(category);
            }
        }
    }
    /**
     * Build hierarchical tree structure from flat category list
     */
    buildTree(categories) {
        const categoryMap = new Map();
        const rootCategories = [];
        // First pass: create tree nodes
        categories.forEach((category) => {
            const treeNode = {
                ...category,
                level: 0,
                path: [],
                hasChildren: false,
                childCount: 0,
                pluginCount: category.plugins ? category.plugins.length : 0
            };
            categoryMap.set(category.id, treeNode);
        });
        // Second pass: build hierarchy and calculate metrics
        categories.forEach((category) => {
            const treeNode = categoryMap.get(category.id);
            if (category.parent) {
                const parent = categoryMap.get(category.parent.id);
                if (parent) {
                    treeNode.level = parent.level + 1;
                    treeNode.path = [...parent.path, parent.name];
                    parent.hasChildren = true;
                    parent.childCount++;
                }
            }
            else {
                rootCategories.push(treeNode);
            }
        });
        return rootCategories.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
    }
    /**
     * Validate category hierarchy rules
     */
    async validateHierarchy(categoryId, parentId) {
        if (!parentId) {
            return;
        }
        // Check if parent exists
        const parent = await this.findOneByIdString(parentId);
        if (!parent) {
            throw new Error(`Parent category with ID '${parentId}' not found`);
        }
        // Prevent self-reference
        if (categoryId === parentId) {
            throw new Error('Category cannot be its own parent');
        }
        // Prevent circular references
        const isCircular = await this.isDescendantOf(categoryId, parentId);
        if (isCircular) {
            throw new Error('Cannot create circular reference in category hierarchy');
        }
    }
    /**
     * Generate unique slug from name
     */
    async generateUniqueSlug(name, tenantId, organizationId, excludeId) {
        let baseSlug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-)|(-$)/g, '');
        let slug = baseSlug;
        let counter = 1;
        while (true) {
            const existing = await this.findOneByWhereOptions({
                slug,
                tenantId,
                organizationId,
                ...(excludeId && { id: (0, typeorm_1.Not)(excludeId) })
            });
            if (!existing) {
                return slug;
            }
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
    }
};
exports.PluginCategoryService = PluginCategoryService;
exports.PluginCategoryService = PluginCategoryService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_plugin_category_repository_1.TypeOrmPluginCategoryRepository,
        mikro_orm_plugin_category_repository_1.MikroOrmPluginCategoryRepository])
], PluginCategoryService);
//# sourceMappingURL=plugin-category.service.js.map