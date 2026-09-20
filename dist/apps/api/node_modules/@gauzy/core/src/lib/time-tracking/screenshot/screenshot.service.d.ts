import { ID, IDeleteScreenshot, IScreenshot } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../../core/crud/tenant-aware-crud.service';
import { Screenshot } from './screenshot.entity';
import { TypeOrmScreenshotRepository } from './repository/type-orm-screenshot.repository';
import { MikroOrmScreenshotRepository } from './repository/mikro-orm-screenshot.repository';
export declare class ScreenshotService extends TenantAwareCrudService<Screenshot> {
    constructor(typeOrmScreenshotRepository: TypeOrmScreenshotRepository, mikroOrmScreenshotRepository: MikroOrmScreenshotRepository);
    /**
     * Delete screenshot by ID
     *
     * @param id - The ID of the screenshot to delete
     * @param options - Optional additional conditions for finding the screenshot
     * @returns The deleted screenshot
     * @throws ForbiddenException if the screenshot cannot be found or deleted
     */
    deleteScreenshot(id: ID, options?: IDeleteScreenshot): Promise<IScreenshot>;
}
