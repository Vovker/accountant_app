import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import { RoleType } from '../../constants';
import type { RequestStatus } from '../../constants/request-status';
import { AccountantNotFoundException } from '../../exceptions/accountant-not-found.exception';
import { UserEntity } from '../user/user.entity';
import { CreateRequestDto } from './dtos/create-request.dto';
import type { RequestDto } from './dtos/request.dto';
import { RequestEntity } from './request.entity';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(RequestEntity)
    private requestRepository: Repository<RequestEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  @Transactional()
  async createRequest(
    user_id: UserEntity,
    request: CreateRequestDto,
  ): Promise<RequestEntity> {
    const requestEntity = this.requestRepository.create();
    requestEntity.title = request.title;
    requestEntity.subject = request.subject;
    requestEntity.requester_id = user_id;

    if (request.accountant_id) {
      const queryBuilder = this.userRepository.createQueryBuilder('user');
      queryBuilder.where('user.id = :userId', {
        userId: request.accountant_id,
      });
      const accountant = await queryBuilder.getOne();

      if (!accountant || accountant.role !== RoleType.ACCOUNTANT) {
        throw new AccountantNotFoundException('Accountant not found');
      }

      requestEntity.accountant_id = accountant;
    }

    await this.requestRepository.save(requestEntity);

    return requestEntity;
  }

  async getUnassignedRequests(): Promise<RequestEntity[]> {
    const queryBuilder = this.requestRepository.createQueryBuilder('request');
    queryBuilder.where('request.accountant_id IS NULL');
    queryBuilder.innerJoinAndSelect('request.requester_id', 'requester');
    queryBuilder.select([
      'request.id',
      'request.title',
      'request.subject',
      'requester.id',
      'requester.firstName',
      'requester.lastName',
      'requester.email',
    ]);

    return queryBuilder.getMany();
  }

  async getRequestByStatus(
    accountant_id: UserEntity,
    status: string,
  ): Promise<RequestEntity[]> {
    const queryBuilder = this.requestRepository.createQueryBuilder('request');
    queryBuilder.where('request.accountant_id = :accountantId', {
      accountantId: accountant_id.id,
    });
    queryBuilder.andWhere('request.status = :status', { status });
    queryBuilder.innerJoinAndSelect('request.requester_id', 'requester');
    queryBuilder.select([
      'request.id',
      'request.title',
      'request.subject',
      'requester.id',
      'requester.firstName',
      'requester.lastName',
      'requester.email',
    ]);

    return queryBuilder.getMany();
  }

  async updateRequestStatus(
    accountant_id: UserEntity,
    request_id: Uuid,
    status: RequestStatus,
  ): Promise<RequestDto> {
    const requestEntity = this.requestRepository.createQueryBuilder('request');
    requestEntity.where('request.id = :requestId', { requestId: request_id });
    requestEntity.leftJoinAndSelect('request.accountant_id', 'accountant');
    const request = await requestEntity.getOne();

    if (!request) {
      throw new HttpException('Request not found', HttpStatus.NOT_FOUND);
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (request.accountant_id === null) {
      request.accountant_id = accountant_id;
    } else if (request.accountant_id.id !== accountant_id.id) {
      throw new HttpException(
        'You are not allowed to update this request',
        HttpStatus.UNAUTHORIZED,
      );
    }

    request.status = status;
    await this.requestRepository.save(request);

    return request.toDto();
  }
}
