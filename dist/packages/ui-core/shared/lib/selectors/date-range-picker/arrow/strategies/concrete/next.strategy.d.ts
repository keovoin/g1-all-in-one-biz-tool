import moment from 'moment';
import { IDateRangePicker } from '@gauzy/contracts';
import { IArrowStrategy } from '../arrow-strategy.interface';
export declare class Next implements IArrowStrategy {
    private disable;
    /**
     * Implementation of action method
     * @param request
     * @returns any type of request
     */
    action(request: IDateRangePicker, unitOfTime: moment.unitOfTime.Base): IDateRangePicker;
    /**
     * getter of disable
     */
    get isDisable(): boolean;
    /**
     * setter of enable
     */
    set isDisable(disable: boolean);
}
