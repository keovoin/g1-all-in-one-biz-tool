"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailHistoryResendHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const email_service_1 = require("../../../email-send/email.service");
const email_history_resend_command_1 = require("../email-history.resend.command");
let EmailHistoryResendHandler = class EmailHistoryResendHandler {
    constructor(emailService) {
        this.emailService = emailService;
    }
    /**
     * Executes the EmailHistoryResendCommand to resend an email.
     *
     * @param command - The command containing email input and language code.
     * @returns A promise that resolves with either an UpdateResult or an updated IEmailHistory.
     */
    execute(command) {
        const { id, input, languageCode } = command;
        return this.emailService.resendEmail(id, input, languageCode);
    }
};
exports.EmailHistoryResendHandler = EmailHistoryResendHandler;
exports.EmailHistoryResendHandler = EmailHistoryResendHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(email_history_resend_command_1.EmailHistoryResendCommand),
    tslib_1.__metadata("design:paramtypes", [email_service_1.EmailService])
], EmailHistoryResendHandler);
//# sourceMappingURL=email-history.resend.handler.js.map