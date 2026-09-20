"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomTrackingService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const utils_1 = require("@gauzy/utils");
const context_1 = require("../../core/context");
const crud_1 = require("../../core/crud");
const utils_2 = require("../../core/utils");
const moment_extend_1 = require("../../core/moment-extend");
const database_helper_1 = require("../../database/database.helper");
const commands_1 = require("./commands");
const type_orm_time_slot_repository_1 = require("../time-slot/repository/type-orm-time-slot.repository");
const mikro_orm_time_slot_repository_1 = require("../time-slot/repository/mikro-orm-time-slot.repository");
const type_orm_time_slot_session_repository_1 = require("../time-slot-session/repository/type-orm-time-slot-session.repository");
const mikro_orm_time_slot_session_repository_1 = require("../time-slot-session/repository/mikro-orm-time-slot-session.repository");
const db_serialization_util_1 = require("../../core/util/db-serialization-util");
let CustomTrackingService = class CustomTrackingService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmTimeSlotRepository, mikroOrmTimeSlotRepository, typeOrmTimeSlotSessionRepository, mikroOrmTimeSlotSessionRepository, commandBus) {
        super(typeOrmTimeSlotRepository, mikroOrmTimeSlotRepository);
        this.typeOrmTimeSlotRepository = typeOrmTimeSlotRepository;
        this.mikroOrmTimeSlotRepository = mikroOrmTimeSlotRepository;
        this.typeOrmTimeSlotSessionRepository = typeOrmTimeSlotSessionRepository;
        this.mikroOrmTimeSlotSessionRepository = mikroOrmTimeSlotSessionRepository;
        this.commandBus = commandBus;
    }
    /**
     * Submit custom tracking data
     */
    async submitTrackingData(input) {
        const { startTime } = input;
        if (isNaN(new Date(startTime).getTime())) {
            throw new common_1.BadRequestException('Invalid start Time');
        }
        return await this.commandBus.execute(new commands_1.ProcessTrackingDataCommand({
            ...input,
            startTime: new Date(startTime)
        }));
    }
    /**
     * Submit bulk custom tracking data
     */
    async submitBulkTrackingData(input) {
        if (!input || !Array.isArray(input) || input.length === 0) {
            throw new common_1.BadRequestException('Invalid bulk input: array of tracking data is required');
        }
        // Execute bulk creation command
        const results = await this.commandBus.execute(new commands_1.CustomTrackingBulkCreateCommand(input));
        // Calculate summary statistics
        const total = results.length;
        const successful = results.filter((r) => r.success).length;
        const failed = total - successful;
        return {
            results,
            summary: {
                total,
                successful,
                failed
            }
        };
    }
    /**
     * Get custom tracking sessions with optional filtering and grouping
     */
    async getTrackingSessions(query) {
        const tenantId = context_1.RequestContext.currentTenantId();
        const { organizationId } = query;
        let employeeIds = query.employeeIds || [];
        if (employeeIds.length === 0) {
            const employeeId = context_1.RequestContext.currentEmployeeId();
            if (employeeId) {
                employeeIds = [employeeId];
            }
            else {
                const currentUser = context_1.RequestContext.currentUser();
                if (currentUser?.employee?.id) {
                    employeeIds = [currentUser.employee.id];
                }
            }
        }
        if (!tenantId || !organizationId) {
            throw new common_1.BadRequestException('Tenant and Organization contexts are required');
        }
        const { start, end } = this.getDateRangeWithDefaults(query);
        const timeSlotSessions = await this.getTimeSlotSessionsWithFilters(query, employeeIds, tenantId, organizationId, start, end);
        const sessions = this.extractTrackingSessionsFromTimeSlotSessions(timeSlotSessions, query.includeDecodedData);
        let workSessions = [];
        if (query.groupBySession) {
            workSessions = this.groupSessionsBySessionId(sessions);
        }
        else {
            workSessions = sessions;
        }
        return {
            sessions: workSessions,
            summary: this.calculateSessionsSummary(workSessions)
        };
    }
    /**
     * Get tracking data for a specific TimeSlot
     */
    async getTimeSlotTrackingData(timeSlotId) {
        const tenantId = context_1.RequestContext.currentTenantId();
        const currentUser = context_1.RequestContext.currentUser();
        const organizationId = currentUser?.employee?.organizationId;
        if (!tenantId || !organizationId) {
            throw new common_1.BadRequestException('Tenant and organization contexts are required');
        }
        const timeSlot = await this.typeOrmTimeSlotRepository.findOne({
            where: {
                id: timeSlotId,
                tenantId,
                organizationId
            },
            relations: {
                timeLogs: {
                    employee: true,
                    project: true
                }
            }
        });
        if (!timeSlot) {
            throw new common_1.NotFoundException('TimeSlot not found');
        }
        const customActivity = (0, db_serialization_util_1.parseFromDatabase)(timeSlot.customActivity);
        if (!customActivity?.trackingSessions) {
            return {
                timeSlotId,
                hasTrackingData: false,
                message: 'No custom tracking data found for this TimeSlot'
            };
        }
        return {
            timeSlotId,
            hasTrackingData: true,
            timeSlot: {
                startedAt: timeSlot.startedAt,
                duration: timeSlot.duration,
                timeLogs: timeSlot.timeLogs
            },
            trackingSessions: customActivity.trackingSessions
        };
    }
    /**
     * Get date range with defaults to prevent loading millions of records
     * Default to last 48 hours if no dates provided
     */
    getDateRangeWithDefaults(query) {
        const { start, end } = (0, utils_2.getDateRangeFormat)(moment_extend_1.moment.utc(query.startDate || (0, moment_extend_1.moment)().subtract(48, 'hours')), moment_extend_1.moment.utc(query.endDate || (0, moment_extend_1.moment)()));
        return {
            start: start,
            end: end
        };
    }
    /**
     * Get TimeSlotSessions
     */
    async getTimeSlotSessionsWithFilters(query, employeeIds, tenantId, organizationId, startDate, endDate) {
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const mikroWhere = {
                    tenantId,
                    organizationId,
                    createdAt: { $gte: startDate, $lte: endDate },
                    timeSlot: { customActivity: { $ne: null } }
                };
                if ((0, utils_1.isNotEmpty)(employeeIds)) {
                    mikroWhere.employeeId = { $in: employeeIds };
                }
                if (query.sessionId) {
                    mikroWhere.sessionId = query.sessionId;
                }
                if ((0, utils_1.isNotEmpty)(query.projectIds)) {
                    mikroWhere.timeSlot = {
                        ...mikroWhere.timeSlot,
                        timeLogs: { projectId: { $in: query.projectIds } }
                    };
                }
                const items = await this.mikroOrmTimeSlotSessionRepository.find(mikroWhere, {
                    populate: ['timeSlot', 'timeSlot.timeLogs'],
                    orderBy: { createdAt: 'ASC' }
                });
                return items;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                const qb = this.typeOrmTimeSlotSessionRepository.createQueryBuilder('tss');
                qb.leftJoinAndSelect('tss.timeSlot', 'timeSlot');
                qb.leftJoinAndSelect('timeSlot.timeLogs', 'timeLogs');
                qb.where((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."tenantId" = :tenantId`), { tenantId });
                qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."organizationId" = :organizationId`), { organizationId });
                qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."createdAt" BETWEEN :startDate AND :endDate`), { startDate, endDate });
                if ((0, utils_1.isNotEmpty)(employeeIds)) {
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."employeeId" IN (:...employeeIds)`), { employeeIds });
                }
                if (query.sessionId) {
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."sessionId" = :sessionId`), { sessionId: query.sessionId });
                }
                if ((0, utils_1.isNotEmpty)(query.projectIds)) {
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."projectId" IN (:...projectIds)`), { projectIds: query.projectIds });
                }
                qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeSlot"."customActivity" IS NOT NULL`));
                qb.addOrderBy((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."createdAt"`), 'ASC');
                return await qb.getMany();
            }
        }
    }
    /**
     * Extract tracking sessions from TimeSlotSessions
     */
    extractTrackingSessionsFromTimeSlotSessions(timeSlotSessions, includeDecodedData = false) {
        const sessions = [];
        for (const timeSlotSession of timeSlotSessions) {
            const timeSlot = timeSlotSession.timeSlot;
            if (!timeSlot)
                continue;
            const customActivity = (0, db_serialization_util_1.parseFromDatabase)(timeSlot.customActivity);
            if (!customActivity?.trackingSessions)
                continue;
            const session = customActivity.trackingSessions.find((s) => s.sessionId === timeSlotSession.sessionId);
            if (!session)
                continue;
            const processedPayloads = session.payloads.map((payload) => {
                if (includeDecodedData) {
                    return {
                        timestamp: payload.timestamp,
                        encodedData: payload.encodedData,
                        decodedData: payload.decodedData
                    };
                }
                else {
                    return {
                        timestamp: payload.timestamp,
                        encodedData: payload.encodedData
                    };
                }
            });
            const sessionData = {
                sessionId: session.sessionId,
                timeLogs: timeSlot.timeLogs || [],
                session: {
                    sessionId: session.sessionId,
                    startTime: session.startTime,
                    lastActivity: session.lastActivity,
                    createdAt: session.createdAt,
                    updatedAt: session.updatedAt,
                    payloads: processedPayloads
                },
                timeSlots: [
                    {
                        timeSlotId: timeSlot.id,
                        timeSlot: {
                            startedAt: timeSlot.startedAt,
                            duration: timeSlot.duration
                        }
                    }
                ]
            };
            sessions.push(sessionData);
        }
        return sessions;
    }
    /**
     * Group tracking sessions by sessionId across multiple TimeSlots
     */
    groupSessionsBySessionId(sessions) {
        const sessionMap = new Map();
        sessions.forEach((session) => {
            const sessionId = session.sessionId;
            if (sessionMap.has(sessionId)) {
                const existingSession = sessionMap.get(sessionId);
                existingSession.session.payloads = [...existingSession.session.payloads, ...session.session.payloads];
                if (session.session.startTime < existingSession.session.startTime) {
                    existingSession.session.startTime = session.session.startTime;
                }
                if (session.session.lastActivity > existingSession.session.lastActivity) {
                    existingSession.session.lastActivity = session.session.lastActivity;
                }
                if (!existingSession.timeSlots) {
                    existingSession.timeSlots = [];
                }
                const timeSlotToAdd = session.timeSlots?.[0] || {
                    timeSlotId: session.timeSlotId,
                    timeSlot: session.timeSlot
                };
                const timeSlotExists = existingSession.timeSlots.some((ts) => ts.timeSlotId === timeSlotToAdd.timeSlotId);
                if (!timeSlotExists) {
                    existingSession.timeSlots.push(timeSlotToAdd);
                }
            }
            else {
                const newSession = {
                    sessionId: session.sessionId,
                    timeLogs: session.timeLogs,
                    session: session.session,
                    timeSlots: session.timeSlots || [
                        {
                            timeSlotId: session.timeSlotId,
                            timeSlot: session.timeSlot
                        }
                    ]
                };
                sessionMap.set(sessionId, newSession);
            }
        });
        return Array.from(sessionMap.values());
    }
    /**
     * Calculate summary statistics for sessions
     */
    calculateSessionsSummary(sessions) {
        const allTimeSlotIds = new Set();
        sessions.forEach((session) => {
            if (session.timeSlots) {
                session.timeSlots.forEach((ts) => allTimeSlotIds.add(ts.timeSlotId));
            }
        });
        let minStart = null;
        let maxStart = null;
        for (const s of sessions) {
            for (const ts of s.timeSlots || []) {
                const t = ts.timeSlot?.startedAt ? new Date(ts.timeSlot.startedAt) : null;
                if (!t || isNaN(t.getTime()))
                    continue;
                minStart = !minStart || t < minStart ? t : minStart;
                maxStart = !maxStart || t > maxStart ? t : maxStart;
            }
        }
        return {
            totalSessions: new Set(sessions.map((s) => s.sessionId)).size,
            totalTimeSlots: allTimeSlotIds.size,
            dateRange: minStart && maxStart ? { start: minStart, end: maxStart } : null
        };
    }
    /**
     * Get tracking sessions by sessionId
     */
    async getSessionsBySessionId(sessionId, tenantId, organizationId, startDate, endDate) {
        const contextTenantId = tenantId || context_1.RequestContext.currentTenantId();
        const contextOrgId = organizationId || context_1.RequestContext.currentUser()?.employee?.organizationId;
        if (!contextTenantId || !contextOrgId) {
            throw new common_1.BadRequestException('Tenant and Organization contexts are required');
        }
        const defaultStart = startDate || new Date(Date.now() - 24 * 60 * 60 * 1000);
        const defaultEnd = endDate || new Date();
        const timeSlotSessions = await this.typeOrmTimeSlotSessionRepository.find({
            where: {
                sessionId,
                tenantId: contextTenantId,
                organizationId: contextOrgId,
                createdAt: (0, typeorm_1.Between)(defaultStart, defaultEnd)
            },
            relations: {
                timeSlot: {
                    timeLogs: true
                }
            },
            order: { createdAt: 'ASC' }
        });
        return this.extractTrackingSessionsFromTimeSlotSessions(timeSlotSessions, false);
    }
    /**
     * Get active sessions for an employee
     * Sessions with activity in the last N minutes
     */
    async getActiveSessions(employeeId, activityThresholdMinutes = 30, tenantId, organizationId) {
        const contextTenantId = tenantId || context_1.RequestContext.currentTenantId();
        const contextOrgId = organizationId || context_1.RequestContext.currentUser()?.employee?.organizationId;
        const contextEmployeeId = employeeId || context_1.RequestContext.currentEmployeeId();
        if (!contextTenantId || !contextOrgId) {
            throw new common_1.BadRequestException('Tenant and Organization context is required');
        }
        const thresholdDate = new Date(Date.now() - activityThresholdMinutes * 60 * 1000);
        const whereCondition = {
            tenantId: contextTenantId,
            organizationId: contextOrgId,
            lastActivity: (0, typeorm_1.Between)(thresholdDate, new Date())
        };
        if (contextEmployeeId) {
            whereCondition.employeeId = contextEmployeeId;
        }
        const timeSlotSessions = await this.typeOrmTimeSlotSessionRepository.find({
            where: whereCondition,
            relations: {
                timeSlot: {
                    timeLogs: true
                }
            },
            order: { lastActivity: 'DESC' }
        });
        return this.extractTrackingSessionsFromTimeSlotSessions(timeSlotSessions, false);
    }
};
exports.CustomTrackingService = CustomTrackingService;
exports.CustomTrackingService = CustomTrackingService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_time_slot_repository_1.TypeOrmTimeSlotRepository,
        mikro_orm_time_slot_repository_1.MikroOrmTimeSlotRepository,
        type_orm_time_slot_session_repository_1.TypeOrmTimeSlotSessionRepository,
        mikro_orm_time_slot_session_repository_1.MikroOrmTimeSlotSessionRepository,
        cqrs_1.CommandBus])
], CustomTrackingService);
//# sourceMappingURL=custom-tracking.service.js.map