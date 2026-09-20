import { KeyResult } from './keyresult.entity';
import { CrudController } from './../core/crud';
import { KeyResultService } from './keyresult.service';
import { ID, IKeyResult } from '@gauzy/contracts';
import { CreateKeyResultDTO, KeyResultBulkInputDTO, UpdateKeyResultDTO } from './dto';
import { DeleteResult } from 'typeorm';
export declare class KeyResultController extends CrudController<KeyResult> {
    private readonly keyResultService;
    constructor(keyResultService: KeyResultService);
    create(entity: CreateKeyResultDTO): Promise<KeyResult>;
    createBulkKeyResults(entity: KeyResultBulkInputDTO): Promise<KeyResult[]>;
    getAll(findInput: string): Promise<import("@gauzy/contracts").IPagination<KeyResult>>;
    update(id: ID, entity: UpdateKeyResultDTO): Promise<IKeyResult>;
    delete(id: ID): Promise<DeleteResult>;
}
