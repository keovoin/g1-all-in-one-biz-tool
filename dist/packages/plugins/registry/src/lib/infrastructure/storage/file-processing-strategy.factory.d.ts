import { FileProcessingStrategy } from '../../shared/models/file-processing.interface';
export declare class FileProcessingStrategyFactory {
    static createStrategy(isMultiple: boolean): FileProcessingStrategy;
}
