"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductTypeService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const utils_1 = require("@gauzy/utils");
const crud_1 = require("./../core/crud");
const utils_2 = require("./../core/utils");
const context_1 = require("./../core/context");
const product_type_entity_1 = require("./product-type.entity");
const mikro_orm_product_type_repository_1 = require("./repository/mikro-orm-product-type.repository");
const type_orm_product_type_repository_1 = require("./repository/type-orm-product-type.repository");
let ProductTypeService = class ProductTypeService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmProductTypeRepository, mikroOrmProductTypeRepository) {
        super(typeOrmProductTypeRepository, mikroOrmProductTypeRepository);
    }
    /**
     * GET product types using pagination
     *
     * @param options
     * @param language
     * @returns
     */
    async pagination(options, language) {
        const { items, total } = await super.paginate(options);
        return await this.mapTranslatedProductTypes(items, language).then((items) => {
            return { items, total };
        });
    }
    /**
     * UPDATE product type
     *
     * @param id
     * @param entity
     * @returns
     */
    async updateProductType(id, entity) {
        try {
            const tenantId = context_1.RequestContext.currentTenantId();
            // The update is a delete-then-recreate, and `translations` cascades on delete. Load the
            // current row (tenant-scoped, translations are eager) so the payload can be rebuilt under the
            // VERIFIED path id — never a body-supplied one, since a recreate with a foreign id would
            // write into another tenant's row — and so omitting `translations` does not erase them.
            // Throws NotFoundException when the row is not in the caller's tenant.
            const existing = await this.findOneByIdString(id);
            const payload = {
                ...entity,
                id,
                ...((0, utils_1.isNotEmpty)(tenantId) ? { tenantId } : {}),
                // A translation row is deleted with its parent, so the carried-over copies must be NEW
                // rows: keeping their old ids would make TypeORM issue an UPDATE that matches nothing.
                // `undefined`, not `isNotEmpty`: an explicit `translations: []` means "remove them", and
                // treating it as omitted would make the list impossible to clear.
                translations: entity?.translations !== undefined && entity?.translations !== null
                    ? entity.translations
                    : (existing.translations ?? []).map(({ id: _translationId, ...translation }) => translation)
            };
            if (this.ormType === utils_2.MultiORMEnum.TypeORM) {
                // The transactional manager below is raw: TenantAwareCrudService's create/save guards do not
                // run, so the ownership check has to be explicit here.
                await this.assertNotForeignRow({ id }, tenantId);
                return await this.typeOrmRepository.manager.transaction(async (transactionalEntityManager) => {
                    // 1. Ensure delete is scoped to the current tenant
                    await transactionalEntityManager.delete(product_type_entity_1.ProductType, {
                        id,
                        ...((0, utils_1.isNotEmpty)(tenantId) ? { tenantId } : {})
                    });
                    // 2. Save with an EXPLICIT entity target and a plain payload. The route validates with
                    // `transform: true`, so `entity` is a ProductTypeDTO instance; EntityManager.save()
                    // resolves metadata from the constructor and threw EntityMetadataNotFoundError for it —
                    // rolling the transaction back and turning every update into a 400.
                    return await transactionalEntityManager.save(product_type_entity_1.ProductType, payload);
                });
            }
            await super.delete(id);
            // NOT `save()`: on MikroORM that is `upsert()`, which does not cascade relations, so the
            // rebuilt `translations` were silently dropped and the row came back with none. `create()`
            // goes through persistAndFlush, which does cascade.
            return await this.create(payload);
        }
        catch (err) {
            // Preserve intentional HTTP exceptions (404 above, ForbiddenException from the ownership guard)
            if (err instanceof common_1.HttpException) {
                throw err;
            }
            throw new common_1.BadRequestException(err);
        }
    }
    /**
     * GET all product types
     *
     * @param options
     * @param language
     * @returns
     */
    async findProductTypes(options, language) {
        const { relations = [], where } = options;
        const { items, total } = await this.findAll({
            where,
            relations
        });
        return await this.mapTranslatedProductTypes(items, language).then((items) => {
            return { items, total };
        });
    }
    /**
     * MAP product types translations
     *
     * @param items
     * @param languageCode
     * @returns
     */
    async mapTranslatedProductTypes(items, languageCode) {
        if (languageCode) {
            return Promise.all(items.map((type) => Object.assign({}, type, type.translate(languageCode))));
        }
        else {
            return items;
        }
    }
    /**
     * MAP product type translations
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
exports.ProductTypeService = ProductTypeService;
exports.ProductTypeService = ProductTypeService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_product_type_repository_1.TypeOrmProductTypeRepository,
        mikro_orm_product_type_repository_1.MikroOrmProductTypeRepository])
], ProductTypeService);
//# sourceMappingURL=product-type.service.js.map