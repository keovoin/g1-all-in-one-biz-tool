import { Repository } from 'typeorm';
import { AiProviderCredential } from '../ai-provider-credential.entity';
export declare class TypeOrmAiProviderCredentialRepository extends Repository<AiProviderCredential> {
    readonly repository: Repository<AiProviderCredential>;
    constructor(repository: Repository<AiProviderCredential>);
}
