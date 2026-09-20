"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductUpdateCommand = void 0;
class ProductUpdateCommand {
    constructor(id, productUpdateRequest) {
        this.id = id;
        this.productUpdateRequest = productUpdateRequest;
    }
}
exports.ProductUpdateCommand = ProductUpdateCommand;
ProductUpdateCommand.type = '[Product] Update';
//# sourceMappingURL=product.update.command.js.map