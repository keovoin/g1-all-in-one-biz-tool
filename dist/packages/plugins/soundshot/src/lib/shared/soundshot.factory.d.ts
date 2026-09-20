import { CreateSoundshotDTO } from "../dtos/create-soundshot.dto";
import { ISoundshot } from '../models/soundshot.model';
export declare class SoundshotFactory {
    static create(input: CreateSoundshotDTO): Partial<ISoundshot>;
    private static common;
}
