"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRegistrationHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const event_bus_1 = require("../../event-bus");
const account_registration_event_1 = require("../account-registration.event");
let AccountRegistrationHandler = class AccountRegistrationHandler {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }
    onModuleInit() {
        const event$ = this.eventBus.ofType(account_registration_event_1.AccountRegistrationEvent);
        this.subscription = event$.pipe((0, rxjs_1.tap)((event) => this.execute(event))).subscribe();
    }
    /**
     * Handles the account registration event.
     * @param event The event containing the registration details.
     */
    async execute(event) {
        try {
            // Perform any necessary actions with the event data
            const { ctx, user } = event;
            // Log the successful handling of the event
            console.log(`Account Registered Successfully: ${user.name} : ${ctx.id}`);
        }
        catch (error) {
            // Handle any errors that occur during event handling
            console.error('Error handling during account registered event:', error);
        }
    }
    onModuleDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
};
exports.AccountRegistrationHandler = AccountRegistrationHandler;
exports.AccountRegistrationHandler = AccountRegistrationHandler = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [event_bus_1.EventBus])
], AccountRegistrationHandler);
//# sourceMappingURL=account-registration.handler.js.map