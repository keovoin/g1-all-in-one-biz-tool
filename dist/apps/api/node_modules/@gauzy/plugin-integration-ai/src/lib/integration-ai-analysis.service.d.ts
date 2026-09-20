import { IScreenshot, UploadedFile } from '@gauzy/contracts';
import { ConnectionEntityManager, IntegrationTenantService, ScreenshotEvent } from '@gauzy/core';
import { GauzyAIService, ImageAnalysisResult } from './gauzy-ai.service';
export declare class IntegrationAIAnalysisService {
    private readonly _connectionEntityManager;
    private readonly _integrationTenantService;
    private readonly _gauzyAIService;
    constructor(_connectionEntityManager: ConnectionEntityManager, _integrationTenantService: IntegrationTenantService, _gauzyAIService: GauzyAIService);
    /**
     * Analyze screenshot using Gauzy AI service.
     *
     * @param event The screenshot event containing necessary data.
     */
    analyzeAndSaveScreenshot(event: ScreenshotEvent): Promise<void>;
    /**
     * Analyze an image using Gauzy AI service.
     * @param input The screenshot input data.
     * @param data The image data buffer.
     * @param file The uploaded file information.
     * @param callback The callback function to handle the analysis result.
     * @returns The image analysis result.
     */
    analyzeImage(input: IScreenshot, data: Buffer, file: UploadedFile, callback?: (analysis: ImageAnalysisResult['data']['analysis']) => void): Promise<ImageAnalysisResult>;
}
