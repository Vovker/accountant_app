import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import type { PageDto } from '../../common/dto/page.dto';
import { RoleType } from '../../constants';
import { UserNotFoundException } from '../../exceptions';
import { WrongSecretKeyException } from '../../exceptions/wrong-secret-key.exception';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import type { UpdateUserDto } from './dtos/update-user.dto';
import type { UserDto } from './dtos/user.dto';
import type { UsersPageOptionsDto } from './dtos/users-page-options.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Find single user
   */
  findOne(findData: FindOptionsWhere<UserEntity>): Promise<UserEntity | null> {
    return this.userRepository.findOneBy(findData);
  }

  @Transactional()
  async createAdmin(createAdminDto: CreateAdminDto): Promise<UserEntity> {
    if (createAdminDto.secretRootKey !== process.env.SECRET_ROOT_ACTIVATION) {
      throw new WrongSecretKeyException('Wrong root secret key!');
    }

    const admin = this.userRepository.create(createAdminDto);

    admin.role = RoleType.ADMIN;

    await this.userRepository.save(admin);

    return admin;
  }

  @Transactional()
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create(createUserDto);

    await this.userRepository.save(user);

    return user;
  }

  async getUsers(
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getUser(userId: Uuid): Promise<UserDto> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder.where('user.id = :userId', { userId });

    const userEntity = await queryBuilder.getOne();

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    return userEntity.toDto();
  }

  async updateUser(userId: Uuid, userDto: UpdateUserDto): Promise<UserDto> {
    const userEntity = this.userRepository.createQueryBuilder('user');
    userEntity.where('user.id = :userId', { userId });

    const user = await userEntity.getOne();

    if (!user) {
      throw new UserNotFoundException();
    }

    user.firstName = userDto.firstName;
    user.lastName = userDto.lastName;
    user.email = userDto.email;
    user.isActive = userDto.isActive || user.isActive;

    await this.userRepository.save(user);

    return user.toDto();
  }

  async activateUser(userId: Uuid): Promise<UserDto> {
    const userEntity = this.userRepository.createQueryBuilder('user');
    userEntity.where('user.id = :userId', { userId });

    const user = await userEntity.getOne();

    if (!user) {
      throw new UserNotFoundException();
    }

    user.isActive = true;

    await this.userRepository.save(user);

    return user.toDto();
  }

  async deactivateUser(userId: Uuid): Promise<UserDto> {
    const userEntity = this.userRepository.createQueryBuilder('user');
    userEntity.where('user.id = :userId', { userId });

    const user = await userEntity.getOne();

    if (!user) {
      throw new UserNotFoundException();
    }

    user.isActive = false;

    await this.userRepository.save(user);

    return user.toDto();
  }
}
