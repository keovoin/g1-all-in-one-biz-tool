import { Repository } from 'typeorm';
import { TimeSlotSession } from '../time-slot-session.entity';
export declare class TypeOrmTimeSlotSessionRepository extends Repository<TimeSlotSession> {
    readonly repository: Repository<TimeSlotSession>;
    constructor(repository: Repository<TimeSlotSession>);
}
