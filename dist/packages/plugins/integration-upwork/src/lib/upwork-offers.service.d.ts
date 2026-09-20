import { IUpworkApiConfig, IUpworkProposalStatusEnum, IUpworkOfferStatusEnum } from '@gauzy/contracts';
export declare class UpworkOffersService {
    /**
     * List freelancer’s offers
     * This call retrieves a list of offers received by a freelancer.
     */
    getOffersListByFreelancer(config: IUpworkApiConfig, status: IUpworkOfferStatusEnum): Promise<any>;
    /**
     * Get freelancer’s offer
     * This call retrieves details about a specific offer received by a freelancer.
     */
    getOfferByKey(config: IUpworkApiConfig, offerKey: string): Promise<any>;
    /**
     * List job applications as freelancer
     * This call lists all job applications made by a freelancer.
     */
    getProposalLisByFreelancer(config: IUpworkApiConfig, status: IUpworkProposalStatusEnum): Promise<any>;
    /**
     * Get job application as freelancer
     * This call retrieves details about a specific job application made by a freelancer.
     */
    getProposalBykey(config: IUpworkApiConfig, applicationId: string): Promise<any>;
}
