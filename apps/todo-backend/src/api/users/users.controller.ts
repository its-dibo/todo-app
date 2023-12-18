import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponse } from '#dto/errors-response.dto';
import { UpdateResponseDto } from '#dto/update-response.dto';
import {
  PartialUserEntity,
  UserEntity,
  UserResponse,
  UserRole,
  UsersWithCount,
} from './entities/user.entity';
import { Own, Roles } from '#guards/roles.guard';
import { User } from '#decorators/user.decorator';
import { Obj } from '#types';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * similar to POST /auth/register, with the following differences
   *   - /auth/register generates an access_token
   *   - this route only for system admins to register other users
   * @param data
   * @returns
   */
  @Post()
  @Roles(UserRole.ADMIN)
  @ApiCreatedResponse({ type: UserEntity })
  create(@Body() data: UserEntity) {
    // todo: use authService.register()
    return this.usersService.create(data);
  }

  /**
   * list all users
   * allowed for admins only
   */
  @Get()
  @Roles(UserRole.ADMIN)
  @ApiQuery({ name: 'page', type: 'number', required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: 'number', required: false, example: 50 })
  @ApiOkResponse({ type: UsersWithCount })
  findAll(@Query() queries?: Obj) {
    return this.usersService.findAll(queries);
  }

  /**
   * get a user by id
   * each user can get his own data by using the endpoint /me
   */
  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOkResponse({ type: UserResponse })
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id);
  }

  /**
   * get the current loggedIn user
   */
  @Get('me')
  @ApiOkResponse({ type: UserResponse })
  me(@User('sub') userId: string) {
    return this.usersService.findById(userId);
  }

  /**
   * search for users by the provided key
   * you can provide a part of the value (as it uses the LIKE statement)
   * allowed for the system admins only
   */
  @Get(':key/:value')
  @Roles(UserRole.ADMIN)
  @ApiParam({ name: 'value', type: 'string' })
  @ApiParam({
    name: 'key',
    type: 'enum',
    enum: Object.getOwnPropertyNames(new UserEntity()).filter(
      (el) => !['password'].includes(el),
    ),
  })
  @ApiQuery({ name: 'page', type: 'number', required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: 'number', required: false, example: 50 })
  @ApiOkResponse({ type: UsersWithCount })
  search(@Param() params: any) {
    return this.usersService.findBy(params.key, params.value, {
      limit: params.limit,
      page: params.page,
    });
  }

  /**
   * update a user
   * the system admin can update any user,
   * any other role can only update his own data, in this case req.param.id is optionsl
   * @param id
   * @param data
   * @returns
   */
  @Patch(':id')
  @Own('id')
  @ApiCreatedResponse({ type: UpdateResponseDto })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: PartialUserEntity,
  ) {
    return this.usersService.updateById(id, data);
  }

  /**
   * update the user's own data
   */
  @Patch()
  @Own('id')
  @ApiCreatedResponse({ type: UpdateResponseDto })
  updateOwnData(@Body() data: PartialUserEntity, @User('sub') userId: string) {
    return this.usersService.updateById(userId, data);
  }

  /**
   * delete a user
   */
  @Delete(':id')
  @Own('id')
  @ApiOkResponse({ type: UpdateResponseDto })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.removeById(id);
  }

  /**
   * delete all users
   * allowed for the system admin only
   * @returns
   */
  @Delete()
  @Roles(UserRole.ADMIN)
  @ApiNoContentResponse()
  removeAll() {
    return this.usersService.removeAll();
  }
}
