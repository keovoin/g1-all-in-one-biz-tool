import { IProfileActivity } from '@gauzy/contracts';
import { ProfileActivityQueryDTO } from './dto/profile-activity-query.dto';
import { StatisticService } from './statistic.service';
export declare class ProfileActivityController {
    private readonly statisticService;
    constructor(statisticService: StatisticService);
    getProfileActivity(query: ProfileActivityQueryDTO): Promise<IProfileActivity>;
}
