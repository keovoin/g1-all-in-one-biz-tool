import { TimeLogSourceEnum } from '@gauzy/contracts';
import { BrowserExtensionTimerIcon, DesktopTimerIcon, HubstaffTimerIcon, MobileTimerIcon, TeamTimerIcon, UpworkTimerIcon, WebTimerIcon } from '../concretes';
export class TimerIconFactory {
    static create(source) {
        switch (source) {
            case TimeLogSourceEnum.MOBILE:
                return new MobileTimerIcon();
            case TimeLogSourceEnum.DESKTOP:
                return new DesktopTimerIcon();
            case TimeLogSourceEnum.BROWSER_EXTENSION:
                return new BrowserExtensionTimerIcon();
            case TimeLogSourceEnum.HUBSTAFF:
                return new HubstaffTimerIcon();
            case TimeLogSourceEnum.UPWORK:
                return new UpworkTimerIcon();
            case TimeLogSourceEnum.TEAMS:
                return new TeamTimerIcon();
            default:
                return new WebTimerIcon();
        }
    }
}
//# sourceMappingURL=timer-icon-factory.js.map