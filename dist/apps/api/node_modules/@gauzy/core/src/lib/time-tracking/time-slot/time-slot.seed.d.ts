import { TimeSlot } from './time-slot.entity';
/**
 * Generates an array of time slots between the provided start and end times.
 *
 * This function generates time slots using the `generateTimeSlots` function,
 * which creates slot data with a duration, start time, and end time. For each
 * time slot, the function randomly generates keyboard and mouse activity
 * using Faker, calculates the overall activity, and constructs a `TimeSlot` object.
 *
 * @param start - The starting time of the time slots (as a Date object).
 * @param end - The ending time of the time slots (as a Date object).
 * @returns An array of `TimeSlot` objects containing the generated time slots.
 */
export declare function createTimeSlots(start: Date, end: Date): TimeSlot[];
