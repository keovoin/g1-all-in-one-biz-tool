/**
 * The Arrow class is a context that uses a strategy to perform actions.
 */
export class Arrow {
    /**
     * Sets the strategy to be used by the Arrow instance.
     * @param strategy - An implementation of IArrowStrategy.
     */
    setStrategy(strategy) {
        if (!strategy) {
            throw new Error('Strategy cannot be null or undefined.');
        }
        this.strategy = strategy;
    }
    /**
     * Executes the action defined by the current strategy.
     * @param request - The input request data.
     * @param unitOfTime - The unit of time for moment.js operations.
     * @returns The result of the strategy action.
     */
    execute(request, unitOfTime) {
        if (!this.strategy) {
            throw new Error('Strategy has not been set.');
        }
        return this.strategy.action(request, unitOfTime);
    }
}
//# sourceMappingURL=arrow.class.js.map