import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { Calendar } from '../../../constants/calendar';
import { UseDto } from '../../../decorators';
import { CalendarDto } from './dtos/calendar.dto';

@Entity('calendar')
@UseDto(CalendarDto)
export class CalendarEntity extends AbstractEntity<CalendarDto> {
  @Column({ type: 'timestamp' })
  day: Date;

  @Column({ type: 'enum', enum: Calendar })
  type: Calendar;

  @Column({ type: 'text', nullable: true })
  description?: string;
}
