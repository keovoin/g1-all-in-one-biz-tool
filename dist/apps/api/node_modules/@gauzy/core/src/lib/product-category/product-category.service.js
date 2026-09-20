"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCategoryService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const utils_1 = require("./../core/utils");
const type_orm_product_category_repository_1 = require("./repository/type-orm-product-category.repository");
const mikro_orm_product_category_repository_1 = require("./repository/mikro-orm-product-category.repository");
let ProductCategoryService = class ProductCategoryService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmProductCategoryRepository, mikroOrmProductCategoryRepository) {
        super(typeOrmProductCategoryRepository, mikroOrmProductCategoryRepository);
    }
    /**
     * GET product categories using pagination
     *
     * @param options
     * @param language
     * @returns
     */
    async pagination(options, language) {
        const { items, total } = await super.paginate(options);
        return await this.mapTranslatedProductCategories(items, language).then((items) => {
            return { items, total };
        });
    }
    /**
     * UPDATE product category
     *
     * @param id
     * @param entity
     * @returns
     */
    async updateProductCategory(id, entity) {
        try {
            // This is a delete-then-recreate, so an id matching nothing in the caller's tenant would
            // leave `delete` affecting zero rows and `save` INSERTING a brand-new category at that
            // arbitrary URL id. `findOneByIdString` is tenant-scoped and THROWS NotFoundException, so
            // the recreate can only ever replace a row that was already ours.
            await this.findOneByIdString(id);
            await super.delete(id);
            // Persist under the verified path id, never a body-supplied one (save() with an existing PK
            // updates THAT row).
            //
            // MikroORM only: `save()` is `upsert()` there, which does NOT cascade relations, so a
            // translatable entity came back with its translations dropped. `create()` goes through
            // persistAndFlush, which does cascade. The TypeORM path keeps `save()` unchanged — its
            // behaviour is already correct and this is not the place to alter it.
            return this.ormType === utils_1.MultiORMEnum.MikroORM
                ? await this.create({ ...entity, id })
                : await this.save({ ...entity, id });
        }
        catch (err) {
            // Preserve the 404 above instead of flattening it to a 400.
            if (err instanceof common_1.HttpException) {
                throw err;
            }
            throw new common_1.BadRequestException(err);
        }
    }
    /**
     * GET all product categories
     *
     * @param input
     * @param language
     * @returns
     */
    async findProductCategories(options, language) {
        const { relations = [], where } = options;
        const { items, total } = await this.findAll({
            where,
            relations
        });
        return await this.mapTranslatedProductCategories(items, language).then((items) => {
            return { items, total };
        });
    }
    /**
     * MAP product category translations
     *
     * @param items
     * @param languageCode
     * @returns
     */
    async mapTranslatedProductCategories(items, languageCode) {
        if (languageCode) {
            return Promise.all(items.map((category) => Object.assign({}, category, category.translate(languageCode))));
        }
        else {
            return items;
        }
    }
    /**
     * MAP product category translations
     *
     * @param type
     * @param languageCode
     * @returns
     */
    async mapTranslatedProductType(type, languageCode) {
        try {
            if (languageCode) {
                return Object.assign({}, type, type.translate(languageCode));
            }
            else {
                return type;
            }
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.ProductCategoryService = ProductCategoryService;
exports.ProductCategoryService = ProductCategoryService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_product_category_repository_1.TypeOrmProductCategoryRepository,
        mikro_orm_product_category_repository_1.MikroOrmProductCategoryRepository])
], ProductCategoryService);
//# sourceMappingURL=product-category.service.js.map