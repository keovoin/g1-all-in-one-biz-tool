"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSlotSessionService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const repository_1 = require("./repository");
const core_1 = require("../../core");
let TimeSlotSessionService = class TimeSlotSessionService extends core_1.TenantAwareCrudService {
    constructor(typeOrmTimeSlotSessionRepository, mikroOrmTimeSlotSessionRepository) {
        super(typeOrmTimeSlotSessionRepository, mikroOrmTimeSlotSessionRepository);
        this.typeOrmTimeSlotSessionRepository = typeOrmTimeSlotSessionRepository;
        this.mikroOrmTimeSlotSessionRepository = mikroOrmTimeSlotSessionRepository;
    }
    /**
     * Create a new TimeSlotSession entry
     */
    async createSession(sessionId, timeSlotId, employeeId, tenantId, organizationId, startTime, lastActivity) {
        const session = super.create({
            sessionId,
            timeSlotId,
            employeeId,
            tenantId,
            organizationId,
            startTime,
            lastActivity
        });
        return await super.save(session);
    }
    /**
     * Update session activity time
     */
    async updateSessionActivity(sessionId, timeSlotId, lastActivity) {
        await super.update({ sessionId, timeSlotId }, { lastActivity, updatedAt: new Date() });
    }
    /**
     * Delete sessions for a specific TimeSlot
     */
    async deleteSessionsByTimeSlot(timeSlotId) {
        await super.delete({ timeSlotId });
    }
    /**
     * Find sessions by TimeSlot ID
     */
    async findSessionsByTimeSlotId(timeSlotId, tenantId, organizationId) {
        return await super.find({
            where: {
                timeSlotId,
                tenantId,
                organizationId
            },
            relations: {
                timeSlot: true,
                employee: true
            }
        });
    }
    /**
     * Find sessions by Employee ID with optional date range filter
     */
    async findSessionsByEmployeeId(employeeId, tenantId, organizationId, startDate, endDate) {
        // Default to last 24 hours if no date range provided
        const defaultStartDate = startDate || new Date(Date.now() - 24 * 60 * 60 * 1000);
        const defaultEndDate = endDate || new Date();
        return await super.find({
            where: {
                employeeId,
                tenantId,
                organizationId,
                createdAt: (0, typeorm_1.Between)(defaultStartDate, defaultEndDate)
            },
            relations: {
                timeSlot: true,
                employee: true
            },
            order: { createdAt: 'DESC' }
        });
    }
    /**
     * Private helper to find TimeSlots by sessionId with optional date range
     */
    async findTimeSlotsBySessionIdWithRange(sessionId, tenantId, organizationId, startDate, endDate) {
        // Default to last 24 hours if no date range provided
        const defaultStartDate = startDate || new Date(Date.now() - 24 * 60 * 60 * 1000);
        const defaultEndDate = endDate || new Date();
        return await super.find({
            where: {
                sessionId,
                tenantId,
                organizationId,
                createdAt: (0, typeorm_1.Between)(defaultStartDate, defaultEndDate)
            },
            relations: {
                timeSlot: true,
                employee: true
            },
            order: { createdAt: 'ASC' }
        });
    }
    /**
     * Find TimeSlots by sessionId with time range filter for performance
     */
    async findTimeSlotsBySessionId(sessionId, tenantId, organizationId) {
        return this.findTimeSlotsBySessionIdWithRange(sessionId, tenantId, organizationId);
    }
    /**
     * Find TimeSlots by sessionId with custom date range
     */
    async findTimeSlotsBySessionIdWithDateRange(sessionId, tenantId, organizationId, startDate, endDate) {
        return this.findTimeSlotsBySessionIdWithRange(sessionId, tenantId, organizationId, startDate, endDate);
    }
    /**
     * Find active sessions (sessions with recent activity)
     */
    async findActiveSessions(tenantId, organizationId, employeeId, activityThresholdMinutes = 30) {
        const thresholdDate = new Date(Date.now() - activityThresholdMinutes * 60 * 1000);
        const whereCondition = {
            tenantId,
            organizationId,
            lastActivity: (0, typeorm_1.Between)(thresholdDate, new Date())
        };
        if (employeeId) {
            whereCondition.employeeId = employeeId;
        }
        return await super.find({
            where: whereCondition,
            relations: {
                timeSlot: true,
                employee: true
            },
            order: { lastActivity: 'DESC' }
        });
    }
    /**
     * Count sessions by sessionId
     */
    async countSessionsBySessionId(sessionId, tenantId, organizationId) {
        return await super.count({
            where: {
                sessionId,
                tenantId,
                organizationId
            }
        });
    }
};
exports.TimeSlotSessionService = TimeSlotSessionService;
exports.TimeSlotSessionService = TimeSlotSessionService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [repository_1.TypeOrmTimeSlotSessionRepository,
        repository_1.MikroOrmTimeSlotSessionRepository])
], TimeSlotSessionService);
//# sourceMappingURL=time-slot-session.service.js.map