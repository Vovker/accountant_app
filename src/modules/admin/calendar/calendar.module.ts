import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '../../user/user.entity';
import { CalendarController } from './calendar.controller';
import { CalendarEntity } from './calendar.entity';
import { CalendarService } from './calendar.service';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarEntity, UserEntity])],
  providers: [CalendarService],
  controllers: [CalendarController],
})
export class CalendarModule {}
