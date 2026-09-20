"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const contact_create_commant_1 = require("../contact-create.commant");
const contact_service_1 = require("../../contact.service");
let ContactCreateHandler = class ContactCreateHandler {
    constructor(contactService) {
        this.contactService = contactService;
    }
    async execute(command) {
        const { input } = command;
        return await this.contactService.create(input);
    }
};
exports.ContactCreateHandler = ContactCreateHandler;
exports.ContactCreateHandler = ContactCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(contact_create_commant_1.ContactCreateCommand),
    tslib_1.__metadata("design:paramtypes", [contact_service_1.ContactService])
], ContactCreateHandler);
//# sourceMappingURL=contact-create.handler.js.map