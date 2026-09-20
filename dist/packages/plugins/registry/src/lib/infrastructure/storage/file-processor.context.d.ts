import { UploadedFile } from '@gauzy/contracts';
import { FileProcessingStrategy } from '../../shared/models/file-processing.interface';
export declare class FileProcessorContext {
    private strategy;
    constructor(strategy: FileProcessingStrategy);
    setStrategy(strategy: FileProcessingStrategy): void;
    process(files: File | File[], provider: any): Promise<UploadedFile | UploadedFile[]>;
}
