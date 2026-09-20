import { CreateCamshotDTO } from "../dtos/create-camshot.dto";
import { ICamshot } from '../models/camshot.model';
export declare class CamshotFactory {
    static create(input: CreateCamshotDTO): Partial<ICamshot>;
    private static common;
}
