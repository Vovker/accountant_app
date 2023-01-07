import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { validateHash } from '../../../common/utils';
import { ApiConfigService } from '../../../shared/services/api-config.service';
import { AwsSesService } from '../../../shared/services/aws-ses/aws-ses.service';
import { AuthService } from '../../auth/auth.service';
import { UserEntity } from '../user.entity';
import type { ChangePasswordDto } from './dtos/change-password.dto';
import { UserPasswordsEntity } from './user-passwords.entity';

@Injectable()
export class UserPasswordsService {
  private awsSesService: AwsSesService;

  constructor(
    @InjectRepository(UserPasswordsEntity)
    private userPasswordsRepository: Repository<UserPasswordsEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private apiConfigService: ApiConfigService,
    @Inject(AuthService)
    private authService: AuthService,
  ) {
    this.awsSesService = new AwsSesService(apiConfigService);
  }

  async updatePassword(user: UserEntity, changePassword: ChangePasswordDto) {
    const userPasswords = await this.userPasswordsRepository
      .createQueryBuilder('user_passwords')
      .leftJoinAndSelect('user_passwords.user', 'user')
      .where('user.id = :id', { id: user.id })
      .andWhere('user_passwords.createdAt > :date', {
        date: new Date(new Date().setMonth(new Date().getMonth() - 6)),
      })
      .getMany();

    for (const userPassword of userPasswords) {
      // eslint-disable-next-line no-await-in-loop
      const isUsed = await validateHash(
        changePassword.password,
        userPassword.password,
      );

      if (isUsed) {
        throw new HttpException('Password already used', 400);
      }
    }

    user.password = changePassword.password;

    return this.userRepository.save(user);
  }

  async changePasswordRequest(user: UserEntity) {
    const token = await this.authService
      .createRequestChangePasswordToken(user)
      .then((data) => data.accessToken);

    return this.awsSesService.sendEmail({
      to: [user.email],
      subject: 'Change password request',
      text: 'Change password',
      html: ` 
                <h1>Change password</h1>
                <p>Click on the link to change your password</p>
                <p>${token}</p>
                <a
                 style="background-color: #4CAF50;"
                 href="${process.env.FRONTENT_URL}/change-password/${token}"
                 >
                 Change password
                 </a>
            `,
    });
  }

  async changePasswordRequestByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (user) {
      return this.changePasswordRequest(user);
    }

    throw new HttpException('User not found', 404);
  }
}
