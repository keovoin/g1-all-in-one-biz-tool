import { Repository } from 'typeorm';
import { OAuthClient } from '../oauth-client.entity';
export declare class TypeOrmOAuthClientRepository extends Repository<OAuthClient> {
    readonly repository: Repository<OAuthClient>;
    constructor(repository: Repository<OAuthClient>);
}
