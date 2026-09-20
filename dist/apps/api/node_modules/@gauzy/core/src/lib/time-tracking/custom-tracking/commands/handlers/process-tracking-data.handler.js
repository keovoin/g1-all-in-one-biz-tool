"use strict";
var ProcessTrackingDataHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessTrackingDataHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const moment_extend_1 = require("../../../../core/moment-extend");
const utils_1 = require("../../../time-slot/utils");
const clarity_decode_1 = require("clarity-decode");
const context_1 = require("../../../../core/context");
const utils_2 = require("../../../../core/utils");
const time_slot_service_1 = require("../../../time-slot/time-slot.service");
const commands_1 = require("../../../time-slot/commands");
const process_tracking_data_command_1 = require("../process-tracking-data.command");
const type_orm_time_slot_repository_1 = require("../../../time-slot/repository/type-orm-time-slot.repository");
const mikro_orm_time_slot_repository_1 = require("../../../time-slot/repository/mikro-orm-time-slot.repository");
const type_orm_time_slot_session_repository_1 = require("../../../time-slot-session/repository/type-orm-time-slot-session.repository");
const mikro_orm_time_slot_session_repository_1 = require("../../../time-slot-session/repository/mikro-orm-time-slot-session.repository");
const db_serialization_util_1 = require("../../../../core/util/db-serialization-util");
let ProcessTrackingDataHandler = ProcessTrackingDataHandler_1 = class ProcessTrackingDataHandler {
    constructor(typeOrmTimeSlotRepository, mikroOrmTimeSlotRepository, typeOrmTimeSlotSessionRepository, mikroOrmTimeSlotSessionRepository, timeSlotService, commandBus) {
        this.typeOrmTimeSlotRepository = typeOrmTimeSlotRepository;
        this.mikroOrmTimeSlotRepository = mikroOrmTimeSlotRepository;
        this.typeOrmTimeSlotSessionRepository = typeOrmTimeSlotSessionRepository;
        this.mikroOrmTimeSlotSessionRepository = mikroOrmTimeSlotSessionRepository;
        this.timeSlotService = timeSlotService;
        this.commandBus = commandBus;
        this.logger = new common_1.Logger(ProcessTrackingDataHandler_1.name);
        this.ormType = (0, utils_2.getORMType)();
    }
    async execute(command) {
        const { input } = command;
        const { payload, startTime } = input;
        if (typeof payload !== 'string' || payload.trim().length === 0) {
            throw new common_1.BadRequestException('Payload must be a non-empty string');
        }
        try {
            const tenantId = context_1.RequestContext.currentTenantId() || input.tenantId;
            const currentUser = context_1.RequestContext.currentUser();
            const organizationId = input.organizationId || currentUser?.employee?.organizationId;
            if (!tenantId || !organizationId) {
                throw new common_1.BadRequestException('Tenant and Organization contexts are required');
            }
            let employeeId = input.employeeId;
            if (!employeeId) {
                const currentUser = context_1.RequestContext.currentUser();
                if (currentUser?.employee?.id) {
                    employeeId = currentUser.employee.id;
                }
                else {
                    const ctxEmpId = context_1.RequestContext.currentEmployeeId();
                    if (ctxEmpId)
                        employeeId = ctxEmpId;
                }
            }
            if (!employeeId) {
                throw new common_1.BadRequestException('Employee context is required for tracking data');
            }
            const { sessionId, timestampMs, decodedData } = await this.decodeTrackingPayload(payload);
            const trackingTime = startTime ? new Date(startTime) : new Date(timestampMs);
            const timeSlot = await this.findOrCreateTimeSlot(employeeId, organizationId, tenantId, trackingTime);
            const sessionData = await this.updateTimeSlotWithTrackingData(timeSlot, sessionId, payload, decodedData, trackingTime, employeeId, tenantId, organizationId);
            return {
                success: true,
                sessionId,
                timeSlotId: timeSlot.id,
                message: 'Tracking data processed successfully',
                session: sessionData
            };
        }
        catch (error) {
            this.logger.error('Failed to process tracking data', error.stack);
            throw new common_1.BadRequestException(`Failed to process tracking data: ${error.message}`);
        }
    }
    /**
     * Decode tracking payload to extract session information
     */
    async decodeTrackingPayload(payload) {
        try {
            const decodedData = (0, clarity_decode_1.decode)(payload);
            const sessionId = decodedData.envelope.sessionId;
            const ts = decodedData.timestamp;
            const timestampMs = ts > 1e12 ? ts : ts * 1000;
            return { sessionId, timestampMs, decodedData };
        }
        catch (error) {
            return {
                sessionId: `fallback-session-${Date.now()}`,
                timestampMs: Date.now(),
                decodedData: null
            };
        }
    }
    /**
     * Find existing TimeSlot or create new one for the tracking time
     */
    async findOrCreateTimeSlot(employeeId, organizationId, tenantId, trackingTime) {
        const { start, end } = (0, utils_1.getStartEndIntervals)(moment_extend_1.moment.utc(trackingTime), moment_extend_1.moment.utc(trackingTime).add(10, 'minutes'));
        let timeSlot;
        try {
            const timeSlots = await this.timeSlotService.find({
                where: {
                    employeeId,
                    organizationId,
                    tenantId,
                    startedAt: (0, typeorm_1.Raw)((alias) => `${alias} >= :start AND ${alias} < :end`, {
                        start: (0, moment_extend_1.moment)(start).toDate(),
                        end: (0, moment_extend_1.moment)(end).toDate()
                    })
                }
            });
            if (timeSlots.length > 0) {
                timeSlot = timeSlots.reduce((closest, current) => {
                    const target = moment_extend_1.moment.utc(trackingTime);
                    const closestDiff = Math.abs(moment_extend_1.moment.utc(closest.startedAt).diff(target));
                    const currentDiff = Math.abs(moment_extend_1.moment.utc(current.startedAt).diff(target));
                    return currentDiff < closestDiff ? current : closest;
                });
            }
            else {
                throw new Error('No time slot found in interval');
            }
        }
        catch (error) {
            this.logger.warn(`TimeSlot not found, creating new one: ${error.message}`);
            timeSlot = await this.commandBus.execute(new commands_1.CreateTimeSlotCommand({
                tenantId,
                organizationId,
                employeeId,
                duration: 0,
                keyboard: 0,
                mouse: 0,
                overall: 0,
                startedAt: moment_extend_1.moment.utc(start).toDate()
            }));
        }
        return timeSlot;
    }
    /**
     * Get complete session data across all TimeSlots with the same sessionId
     */
    async getCompleteSessionData(sessionId, employeeId, organizationId, tenantId) {
        const defaultStartDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const defaultEndDate = new Date();
        let timeSlotSessions;
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const em = this.mikroOrmTimeSlotSessionRepository.getEntityManager();
                timeSlotSessions = await em.find('TimeSlotSession', {
                    sessionId,
                    employeeId,
                    organizationId,
                    tenantId,
                    createdAt: { $gte: defaultStartDate, $lte: defaultEndDate }
                }, {
                    populate: ['timeSlot'],
                    orderBy: { createdAt: 'ASC' }
                });
                break;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default:
                timeSlotSessions = await this.typeOrmTimeSlotSessionRepository
                    .createQueryBuilder('tss')
                    .leftJoinAndSelect('tss.timeSlot', 'timeSlot')
                    .where('tss.sessionId = :sessionId', { sessionId })
                    .andWhere('tss.employeeId = :employeeId', { employeeId })
                    .andWhere('tss.organizationId = :organizationId', { organizationId })
                    .andWhere('tss.tenantId = :tenantId', { tenantId })
                    .andWhere('tss.createdAt BETWEEN :startDate AND :endDate', {
                    startDate: defaultStartDate,
                    endDate: defaultEndDate
                })
                    .orderBy('tss.createdAt', 'ASC')
                    .getMany();
                break;
        }
        if (timeSlotSessions.length === 0) {
            return null;
        }
        let allPayloads = [];
        let sessionInfo = null;
        for (const timeSlotSession of timeSlotSessions) {
            const timeSlot = timeSlotSession.timeSlot;
            const customActivity = (0, db_serialization_util_1.parseFromDatabase)(timeSlot.customActivity);
            if (!customActivity?.trackingSessions)
                continue;
            const session = customActivity.trackingSessions.find((s) => s.sessionId === sessionId);
            if (session) {
                if (!sessionInfo) {
                    sessionInfo = {
                        sessionId: session.sessionId,
                        startTime: session.startTime,
                        lastActivity: session.lastActivity,
                        createdAt: session.createdAt,
                        updatedAt: session.updatedAt
                    };
                }
                allPayloads = [...allPayloads, ...session.payloads];
            }
        }
        if (!sessionInfo) {
            return null;
        }
        allPayloads.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        return {
            ...sessionInfo,
            payloads: allPayloads
        };
    }
    /**
     * Update TimeSlot with tracking data (store both encoded and decoded data)
     */
    async updateTimeSlotWithTrackingData(timeSlot, sessionId, encodedPayload, decodedData, timestamp, employeeId, tenantId, organizationId) {
        const customActivity = {
            trackingSessions: []
        };
        if (timeSlot.customActivity) {
            const existingActivity = (0, db_serialization_util_1.parseFromDatabase)(timeSlot.customActivity);
            if (existingActivity.trackingSessions && Array.isArray(existingActivity.trackingSessions)) {
                customActivity.trackingSessions = existingActivity.trackingSessions;
            }
        }
        let existingSession = customActivity.trackingSessions.find((session) => session.sessionId === sessionId);
        const payload = {
            timestamp: timestamp.toISOString(),
            encodedData: encodedPayload,
            decodedData: decodedData || undefined
        };
        if (existingSession) {
            existingSession.payloads.push(payload);
            existingSession.updatedAt = new Date().toISOString();
            existingSession.lastActivity = timestamp.toISOString();
        }
        else {
            existingSession = {
                sessionId,
                startTime: timestamp.toISOString(),
                lastActivity: timestamp.toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                payloads: [payload]
            };
            customActivity.trackingSessions.push(existingSession);
        }
        await this.updateTimeSlotCustomActivity(timeSlot.id, customActivity);
        await this.createOrUpdateTimeSlotSession(sessionId, timeSlot.id, employeeId, tenantId, organizationId, timestamp);
        return await this.getCompleteSessionData(sessionId, employeeId, organizationId, tenantId);
    }
    /**
     * Update the customActivity field of a time slot using the active ORM.
     */
    async updateTimeSlotCustomActivity(timeSlotId, customActivity) {
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const knex = this.mikroOrmTimeSlotRepository.getKnex();
                await knex('time_slot')
                    .withSchema(knex.userParams.schema)
                    .where({ id: timeSlotId })
                    .update({ customActivity: (0, db_serialization_util_1.stringifyForDatabase)(customActivity) });
                break;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default:
                await this.typeOrmTimeSlotRepository.update(timeSlotId, {
                    customActivity: (0, db_serialization_util_1.stringifyForDatabase)(customActivity)
                });
                break;
        }
    }
    /**
     * Create or update TimeSlotSession mapping entry
     */
    async createOrUpdateTimeSlotSession(sessionId, timeSlotId, employeeId, tenantId, organizationId, timestamp) {
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const em = this.mikroOrmTimeSlotSessionRepository.getEntityManager();
                const existing = await em.findOne('TimeSlotSession', {
                    sessionId,
                    timeSlotId,
                    tenantId,
                    organizationId
                });
                if (!existing) {
                    const entity = em.create('TimeSlotSession', {
                        sessionId,
                        timeSlotId,
                        employeeId,
                        tenantId,
                        organizationId,
                        startTime: timestamp,
                        lastActivity: timestamp
                    });
                    await em.persistAndFlush(entity);
                }
                else {
                    em.assign(existing, { lastActivity: timestamp });
                    await em.persistAndFlush(existing);
                }
                break;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                const existingMapping = await this.typeOrmTimeSlotSessionRepository.findOne({
                    where: {
                        sessionId,
                        timeSlotId,
                        tenantId,
                        organizationId
                    }
                });
                if (!existingMapping) {
                    const timeSlotSession = this.typeOrmTimeSlotSessionRepository.create({
                        sessionId,
                        timeSlotId,
                        employeeId,
                        tenantId,
                        organizationId,
                        startTime: timestamp,
                        lastActivity: timestamp
                    });
                    await this.typeOrmTimeSlotSessionRepository.save(timeSlotSession);
                }
                else {
                    await this.typeOrmTimeSlotSessionRepository.update(existingMapping.id, {
                        lastActivity: timestamp
                    });
                }
                break;
            }
        }
    }
};
exports.ProcessTrackingDataHandler = ProcessTrackingDataHandler;
exports.ProcessTrackingDataHandler = ProcessTrackingDataHandler = ProcessTrackingDataHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(process_tracking_data_command_1.ProcessTrackingDataCommand),
    tslib_1.__metadata("design:paramtypes", [type_orm_time_slot_repository_1.TypeOrmTimeSlotRepository,
        mikro_orm_time_slot_repository_1.MikroOrmTimeSlotRepository,
        type_orm_time_slot_session_repository_1.TypeOrmTimeSlotSessionRepository,
        mikro_orm_time_slot_session_repository_1.MikroOrmTimeSlotSessionRepository,
        time_slot_service_1.TimeSlotService,
        cqrs_1.CommandBus])
], ProcessTrackingDataHandler);
//# sourceMappingURL=process-tracking-data.handler.js.map