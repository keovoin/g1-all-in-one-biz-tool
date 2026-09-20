import moment from 'moment';
export class Previous {
    /**
     * Implementation of action method
     * @param request
     * @returns any type of request
     */
    action(request, unitOfTime) {
        const { startDate, endDate, isCustomDate } = request;
        let end = moment(startDate).subtract(1, 'days');
        let start;
        if (isCustomDate) {
            const range = moment(endDate).diff(moment(startDate), 'days');
            start = moment(end).subtract(range, 'days');
        }
        else {
            start = moment(end).startOf(unitOfTime);
        }
        return {
            startDate: start.startOf('day').toDate(),
            endDate: end.endOf('day').toDate(),
            isCustomDate
        };
    }
}
//# sourceMappingURL=previous.strategy.js.map