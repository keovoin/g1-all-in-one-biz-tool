"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const type_orm_contact_repository_1 = require("./repository/type-orm-contact.repository");
const mikro_orm_contact_repository_1 = require("./repository/mikro-orm-contact.repository");
const decorators_1 = require("../core/decorators");
let ContactService = class ContactService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmContactRepository, mikroOrmContactRepository) {
        super(typeOrmContactRepository, mikroOrmContactRepository);
        this.typeOrmContactRepository = typeOrmContactRepository;
        this.mikroOrmContactRepository = mikroOrmContactRepository;
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = tslib_1.__decorate([
    (0, decorators_1.FavoriteService)(contracts_1.BaseEntityEnum.Contact),
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_contact_repository_1.TypeOrmContactRepository,
        mikro_orm_contact_repository_1.MikroOrmContactRepository])
], ContactService);
//# sourceMappingURL=contact.service.js.map