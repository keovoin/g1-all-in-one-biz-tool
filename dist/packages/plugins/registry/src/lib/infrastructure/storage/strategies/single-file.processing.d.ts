import { UploadedFile } from '@gauzy/contracts';
import { FileProcessingStrategy } from '../../../shared/models/file-processing.interface';
/**
 * Strategy for processing single file
 */
export declare class SingleFileProcessingStrategy implements FileProcessingStrategy {
    process(file: any, provider: any): Promise<UploadedFile>;
}
