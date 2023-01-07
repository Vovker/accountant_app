import { AbstractDto } from '../../../../common/dto/abstract.dto';
import type { UserSettingsEntity } from '../user-settings.entity';

export class UserSettingsDto extends AbstractDto {
  vacationDays: number;

  sickDays: number;

  isVerified: boolean;

  constructor(userSettings: UserSettingsEntity) {
    super(userSettings);
    this.vacationDays = userSettings.vacationDays;
    this.sickDays = userSettings.sickDays;
    this.isVerified = userSettings.isVerified;
  }
}
