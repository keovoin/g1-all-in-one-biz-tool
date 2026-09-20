"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountVerifiedHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const event_bus_1 = require("../../event-bus");
const account_verified_event_1 = require("../account-verified.event");
let AccountVerifiedHandler = class AccountVerifiedHandler {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }
    onModuleInit() {
        const event$ = this.eventBus.ofType(account_verified_event_1.AccountVerifiedEvent);
        this.subscription = event$.pipe((0, rxjs_1.tap)((event) => this.execute(event))).subscribe();
    }
    /**
     * Handles the account verification event.
     * @param event The event containing the verification details.
     */
    async execute(event) {
        try {
            // Perform any necessary actions with the event data
            const { ctx, user } = event;
            // Log the successful handling of the event
            console.log(`Account Verified Successfully: ${user.name} : ${ctx.id}`);
        }
        catch (error) {
            // Handle any errors that occur during event handling
            console.error('Error handling during account verified event:', error);
        }
    }
    onModuleDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
};
exports.AccountVerifiedHandler = AccountVerifiedHandler;
exports.AccountVerifiedHandler = AccountVerifiedHandler = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [event_bus_1.EventBus])
], AccountVerifiedHandler);
//# sourceMappingURL=account-verified.handler.js.map