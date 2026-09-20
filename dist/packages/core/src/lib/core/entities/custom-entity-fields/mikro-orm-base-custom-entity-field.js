"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MikroOrmBaseCustomEntityFields = exports.__FIX_RELATIONAL_CUSTOM_FIELDS__ = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@mikro-orm/core");
exports.__FIX_RELATIONAL_CUSTOM_FIELDS__ = 'fix_relational_custom_fields';
// Define a new entity that extends the abstract base class
class MikroOrmBaseCustomEntityFields {
}
exports.MikroOrmBaseCustomEntityFields = MikroOrmBaseCustomEntityFields;
_a = exports.__FIX_RELATIONAL_CUSTOM_FIELDS__;
tslib_1.__decorate([
    (0, core_1.Property)({ type: 'boolean', nullable: true, hidden: true }),
    tslib_1.__metadata("design:type", Boolean)
], MikroOrmBaseCustomEntityFields.prototype, _a, void 0);
//# sourceMappingURL=mikro-orm-base-custom-entity-field.js.map