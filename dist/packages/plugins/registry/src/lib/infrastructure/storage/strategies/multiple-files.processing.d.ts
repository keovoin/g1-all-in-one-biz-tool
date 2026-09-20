import { UploadedFile } from '@gauzy/contracts';
import { FileProcessingStrategy } from '../../../shared/models/file-processing.interface';
/**
 * Strategy for processing multiple files
 */
export declare class MultipleFilesProcessingStrategy implements FileProcessingStrategy {
    process(files: any[], provider: any): Promise<UploadedFile[]>;
}
