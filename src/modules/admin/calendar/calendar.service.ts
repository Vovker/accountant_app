import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  async getDays(dates: GetCalendarDto): Promise<CalendarDto[]> {
    const queryBuilder = this.calendarRepository
      .createQueryBuilder('calendar')
      .where('calendar.day BETWEEN :from AND :to', {
        from: dates.from,
        to: dates.to,
      });

    return queryBuilder.getMany();
  }

  async setDays(date: AddDayDto): Promise<CalendarEntity> {
    const calendarEntity = this.calendarRepository.create(date);

    return this.calendarRepository.save(calendarEntity);
  }
}
