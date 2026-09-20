import { Repository } from 'typeorm';
import { Token } from '../entities/token.entity';
import { ITokenRepository } from '../interfaces';
export declare function buildTypeOrmAdapter(repo: Repository<Token>): ITokenRepository;
export declare function buildMikroOrmAdapter(repo: any): ITokenRepository;
