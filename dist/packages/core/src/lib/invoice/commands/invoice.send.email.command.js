"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceSendEmailCommand = void 0;
class InvoiceSendEmailCommand {
    constructor(languageCode, email, params, origin) {
        this.languageCode = languageCode;
        this.email = email;
        this.params = params;
        this.origin = origin;
    }
}
exports.InvoiceSendEmailCommand = InvoiceSendEmailCommand;
InvoiceSendEmailCommand.type = '[Invoice] Send Email';
//# sourceMappingURL=invoice.send.email.command.js.map