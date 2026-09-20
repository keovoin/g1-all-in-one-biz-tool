"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubEventSubscriber = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const commands_1 = require("./commands");
let GithubEventSubscriber = class GithubEventSubscriber {
    constructor(_eventBus, _commandBus) {
        this._eventBus = _eventBus;
        this._commandBus = _commandBus;
        this.logger = new common_1.Logger('GithubEventSubscriber');
        this.onDestroy$ = new rxjs_1.Subject();
    }
    /**
     * Initializes the module and sets up a subscription to listen for IntegrationEvent events.
     * The subscription filters the events to only process those related to GitHub integrations.
     * When an event is received, a GithubInstallationDeleteCommand is executed.
     */
    async onModuleInit() {
        this.setupIntegrationEvent();
        this.setupTaskEvent();
    }
    /**
     * Sets up a subscription to listen for IntegrationEvent events.
     * Depending on the event type, it will execute the appropriate command.
     */
    setupIntegrationEvent() {
        this._eventBus
            .ofType(core_1.IntegrationEvent)
            .pipe((0, operators_1.filter)((event) => !!event.entity), (0, operators_1.filter)((event) => event.entity.integration.provider === contracts_1.IntegrationEnum.GITHUB), (0, operators_1.tap)(async (event) => {
            switch (event.type) {
                case core_1.BaseEntityEventTypeEnum.DELETED:
                    const command = new commands_1.GithubInstallationDeleteCommand(event.entity);
                    await this._commandBus.execute(command);
                    break;
                default:
                    this.logger.warn(`Unhandled event type: ${event.type}`);
                    break;
            }
        }), (0, operators_1.catchError)((error) => {
            // Handle errors and return an appropriate error response
            this.logger.error(`Error processing IntegrationEvent: ${error.message}`, error.message);
            // Throw an HttpException to propagate the error
            throw new common_1.HttpException(`Error processing IntegrationEvent: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }), (0, operators_1.takeUntil)(this.onDestroy$))
            .subscribe();
    }
    /**
     * Sets up a subscription to listen for TaskEvent events.
     * Depending on the event type, it will execute the appropriate command.
     */
    setupTaskEvent() {
        this._eventBus
            .ofType(core_1.TaskEvent)
            .pipe((0, operators_1.tap)(async (event) => {
            try {
                const { organizationId, projectId } = event.input;
                const tenantId = core_1.RequestContext.currentTenantId() || event.input.tenantId;
                switch (event.type) {
                    case core_1.BaseEntityEventTypeEnum.CREATED:
                    case core_1.BaseEntityEventTypeEnum.UPDATED:
                        // Only execute command if projectId exists
                        if (projectId) {
                            const command = new commands_1.GithubTaskUpdateOrCreateCommand(event.entity, {
                                tenantId,
                                organizationId,
                                projectId
                            });
                            await this._commandBus.execute(command);
                        }
                        break;
                    default:
                        this.logger.warn(`Unhandled event type: ${event.type}`);
                        break;
                }
            }
            catch (error) {
                this.logger.error('Error while processing task event', error.message);
                throw new common_1.HttpException(`Error while processing task event: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }), (0, operators_1.catchError)((error) => {
            this.logger.error('Error in event subscription', error.message);
            throw new common_1.HttpException(`Error in event subscription: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }), (0, operators_1.takeUntil)(this.onDestroy$))
            .subscribe();
    }
    /**
     * This method is called when the module is destroyed.
     * It emits a value and completes the onDestroy$ subject to ensure
     * all subscriptions are properly unsubscribed, preventing memory leaks.
     */
    async onModuleDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
};
exports.GithubEventSubscriber = GithubEventSubscriber;
exports.GithubEventSubscriber = GithubEventSubscriber = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.EventBus, cqrs_1.CommandBus])
], GithubEventSubscriber);
//# sourceMappingURL=github-event.subscriber.js.map