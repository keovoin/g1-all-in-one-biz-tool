"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const type_orm_product_repository_1 = require("./repository/type-orm-product.repository");
const mikro_orm_product_repository_1 = require("./repository/mikro-orm-product.repository");
const type_orm_product_translation_repository_1 = require("./repository/type-orm-product-translation.repository");
let ProductService = class ProductService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmProductRepository, mikroOrmProductRepository, typeOrmProductTranslationRepository) {
        super(typeOrmProductRepository, mikroOrmProductRepository);
        this.typeOrmProductRepository = typeOrmProductRepository;
        this.mikroOrmProductRepository = mikroOrmProductRepository;
        this.typeOrmProductTranslationRepository = typeOrmProductTranslationRepository;
        this.propsTranslate = [
            {
                prop: 'root',
                propsTranslate: [
                    { key: 'name', alias: 'name' },
                    { key: 'description', alias: 'description' }
                ]
            },
            {
                prop: 'productCategory',
                propsTranslate: [{ key: 'name', alias: 'productCategory' }]
            },
            {
                prop: 'productType',
                propsTranslate: [{ key: 'name', alias: 'productType' }]
            },
            {
                prop: 'description',
                propsTranslate: [{ key: 'description', alias: 'description' }]
            }
        ];
    }
    async pagination(filter, language) {
        if ('where' in filter) {
            const { where } = filter;
            if ('languageCode' in where) {
                const { languageCode } = where;
                language = languageCode;
                delete where['languageCode'];
            }
        }
        const { items, total } = await super.paginate(filter);
        return await this.mapTranslatedProducts(items, language).then((items) => {
            return { items, total };
        });
    }
    async findProducts(input, language) {
        const { relations = [], findInput } = input;
        const { items, total } = await this.findAll({
            where: {
                ...findInput
            },
            relations
        });
        return await this.mapTranslatedProducts(items, language).then((items) => {
            return { items, total };
        });
    }
    async findAllProducts(langCode, relations, findInput, options = { page: 1, limit: 10 }) {
        const { items, total } = await this.findAll({
            relations: relations,
            where: {
                ...findInput
            }
        });
        return await this.mapTranslatedProducts(items, langCode).then((items) => {
            return { items, total };
        });
    }
    async findByIdTranslated(langCode, id, relations) {
        return await this.findOneByOptions({
            where: { id: id },
            relations: relations
        }).then((result) => {
            if (result) {
                return result.translateNested(langCode, this.propsTranslate);
            }
            return result;
        });
    }
    async findById(id, options) {
        return await this.findOneByIdString(id, options);
    }
    async saveProduct(productRequest) {
        let res = await this.create(productRequest);
        return await this.findOneByIdString(res.id, {
            relations: ['variants', 'optionGroups', 'productType', 'productCategory', 'tags', 'gallery']
        });
    }
    async addGalleryImages(productId, images) {
        try {
            let product = await this.findOneByIdString(productId, {
                relations: ['gallery']
            });
            product.gallery = product.gallery.concat(images);
            return await this.save(product);
        }
        catch (err) {
            throw new common_1.BadRequestException(err);
        }
    }
    async setAsFeatured(productId, image) {
        try {
            let product = await this.findOneByIdString(productId);
            product.featuredImage = image;
            return await this.save(product);
        }
        catch (err) {
            throw new common_1.BadRequestException(err);
        }
    }
    async deleteGalleryImage(productId, imageId) {
        try {
            let product = await this.findOneByIdString(productId, {
                relations: ['gallery', 'variants']
            });
            if (product.variants.find((variant) => variant.image.id == imageId)) {
                throw new common_1.HttpException('Image is used in product variants', common_1.HttpStatus.BAD_REQUEST);
            }
            product.gallery = product.gallery.filter((image) => image.id !== imageId);
            return await this.save(product);
        }
        catch (err) {
            throw new common_1.BadRequestException(err);
        }
    }
    async deleteFeaturedImage(productId) {
        try {
            let product = await this.findOneByIdString(productId);
            product.featuredImage = null;
            return await this.save(product);
        }
        catch (err) {
            throw new common_1.BadRequestException(err);
        }
    }
    async saveProductTranslation(productTranslation) {
        return await this.typeOrmProductTranslationRepository.save(productTranslation);
    }
    async mapTranslatedProducts(items, languageCode) {
        if (languageCode) {
            return Promise.all(items.map((product) => Object.assign({}, product, product.translateNested(languageCode, this.propsTranslate))));
        }
        else {
            return items;
        }
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_product_repository_1.TypeOrmProductRepository,
        mikro_orm_product_repository_1.MikroOrmProductRepository,
        type_orm_product_translation_repository_1.TypeOrmProductTranslationRepository])
], ProductService);
//# sourceMappingURL=product.service.js.map