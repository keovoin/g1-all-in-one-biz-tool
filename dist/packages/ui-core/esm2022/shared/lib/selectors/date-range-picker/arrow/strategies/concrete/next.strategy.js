import moment from 'moment';
export class Next {
    constructor() {
        // declaration of variable
        this.disable = false;
    }
    /**
     * Implementation of action method
     * @param request
     * @returns any type of request
     */
    action(request, unitOfTime) {
        const { startDate, endDate, isCustomDate } = request;
        let start = moment(endDate).add(1, 'days');
        let end;
        if (isCustomDate) {
            const range = moment(endDate).diff(moment(startDate), 'days');
            end = moment(start).add(range, 'days');
        }
        else {
            end = moment(start).endOf(unitOfTime);
        }
        return {
            startDate: start.startOf('day').toDate(),
            endDate: end.endOf('day').toDate(),
            isCustomDate
        };
    }
    /**
     * getter of disable
     */
    get isDisable() {
        return this.disable;
    }
    /**
     * setter of enable
     */
    set isDisable(disable) {
        this.disable = disable;
    }
}
//# sourceMappingURL=next.strategy.js.map