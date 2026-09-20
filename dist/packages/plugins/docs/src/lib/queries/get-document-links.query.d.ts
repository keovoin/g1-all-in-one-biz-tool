import { IQuery } from '@nestjs/cqrs';
import { BaseEntityEnum, ID } from '@gauzy/contracts';
/**
 * Serves both link list directions: by business record (`entity` + `entityId`) or by document
 * (`documentId`).
 */
export declare class GetDocumentLinksQuery implements IQuery {
    readonly filter: {
        entity?: BaseEntityEnum;
        entityId?: ID;
        documentId?: ID;
        organizationId?: ID;
    };
    static readonly type = "[Document Links] Get All";
    constructor(filter: {
        entity?: BaseEntityEnum;
        entityId?: ID;
        documentId?: ID;
        organizationId?: ID;
    });
}
