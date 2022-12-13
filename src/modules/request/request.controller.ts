import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { RequestStatus, RoleType } from '../../constants';
import { Auth, AuthUser, UUIDParam } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { CreateRequestDto } from './dtos/create-request.dto';
import { ReassignRequestDto } from './dtos/reassign-request.dto';
import { RequestDto } from './dtos/request.dto';
import { RequestService } from './request.service';

@Controller('request')
@ApiTags('request')
export class RequestController {
  constructor(
    private requestService: RequestService,
    private userService: UserService,
  ) {}

  @Post()
  @Auth([RoleType.MANAGER, RoleType.EMPLOYEE, RoleType.ACCOUNTANT])
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: CreateRequestDto })
  async createRequest(
    @Body() request: CreateRequestDto,
    @AuthUser() user: UserEntity,
  ) {
    const requestEntity = await this.requestService.createRequest(
      user,
      request,
    );

    return requestEntity.toDto();
  }

  @Get('unassigned')
  @Auth([RoleType.ACCOUNTANT])
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ type: RequestDto, isArray: true })
  async getUnassignedRequests() {
    return this.requestService.getUnassignedRequests();
  }

  @Get('status/:status')
  @Auth([RoleType.ACCOUNTANT])
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'status', enum: RequestStatus })
  @ApiOkResponse({ type: RequestDto })
  async getRequestsByStatus(
    @Param('status') status: RequestStatus,
    @AuthUser() user: UserEntity,
  ) {
    return this.requestService.getRequestByStatus(user, status);
  }

  @Put('status/:id/:status')
  @Auth([RoleType.ACCOUNTANT])
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'status', enum: RequestStatus })
  @ApiOkResponse({ type: RequestDto })
  async updateRequestStatus(
    @UUIDParam('id') id: Uuid,
    @Param('status') status: RequestStatus,
    @AuthUser() user: UserEntity,
  ) {
    return this.requestService.updateRequestStatus(user, id, status);
  }

  @Put('/reassign/:id')
  @Auth([RoleType.ACCOUNTANT])
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ type: RequestDto })
  async reassignRequest(
    @UUIDParam('id') id: Uuid,
    @Body() accountant: ReassignRequestDto,
    @AuthUser() user: UserEntity,
  ) {
    const assigningAccountant = await this.userService.getUser(
      accountant.accountant_id,
    );

    return this.requestService.reassignRequest(user, assigningAccountant, id);
  }
}
