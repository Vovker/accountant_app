import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../../constants';
import { Auth } from '../../../decorators';
import { CalendarService } from './calendar.service';
import { AddDayDto } from './dtos/add-day.dto';
import { CalendarDto } from './dtos/calendar.dto';
import { GetCalendarDto } from './dtos/get-calendar.dto';

@Controller('calendar')
@ApiTags('calendar')
export class CalendarController {
  constructor(private calendarService: CalendarService) {}

  @Post('add')
  @Auth([RoleType.ADMIN])
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'The record has been successfully created.',
    type: CalendarDto,
  })
  setDay(@Body() date: AddDayDto) {
    return this.calendarService.setDays(date);
  }

  @Post('holiday')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'The list of special days in range.',
    type: CalendarDto,
    isArray: true,
  })
  getHolidays(@Body() range: GetCalendarDto) {
    return this.calendarService.getHolidays(range);
  }
}
