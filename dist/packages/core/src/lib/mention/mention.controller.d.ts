import { CrudController } from './../core/crud';
import { Mention } from './mention.entity';
import { MentionService } from './mention.service';
export declare class MentionController extends CrudController<Mention> {
    readonly mentionService: MentionService;
    constructor(mentionService: MentionService);
}
