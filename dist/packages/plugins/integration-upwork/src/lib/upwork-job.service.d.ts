import { IUpworkApiConfig } from '@gauzy/contracts';
export declare class UpworkJobService {
    getJobProfileByKey(config: IUpworkApiConfig, jobKey: string): Promise<any>;
}
