import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Calendar } from '../../../constants/calendar';
import { CalendarEntity } from './calendar.entity';
import type { AddDayDto } from './dtos/add-day.dto';
import type { CalendarDto } from './dtos/calendar.dto';
import type { GetCalendarDto } from './dtos/get-calendar.dto';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarEntity)
    private calendarRepository: Repository<CalendarEntity>,
  ) {}

  async getHolidays(dates: GetCalendarDto): Promise<CalendarDto[]> {
    const queryBuilder = this.calendarRepository
      .createQueryBuilder('calendar')
      .where('calendar.day BETWEEN :from AND :to', {
        from: dates.from,
        to: dates.to,
      })
      .andWhere('calendar.type = :type', { type: Calendar.HOLIDAY });

    return queryBuilder.getMany();
  }

  async setDays(date: AddDayDto): Promise<CalendarEntity> {
    const calendarEntity = this.calendarRepository.create();
    calendarEntity.day = date.day;
    calendarEntity.type = date.type;

    return this.calendarRepository.save(calendarEntity);
  }
}
