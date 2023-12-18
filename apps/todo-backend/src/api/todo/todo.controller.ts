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
} from '@nestjs/common';
import {
  PartialTodoEntity,
  PostsWithCount,
  TodoEntity,
} from './entities/todo.entity';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponse } from '#dto/errors-response.dto';
import { Public } from '#api/auth/guards/auth.guard';
import { Own, Roles } from '#guards/roles.guard';
import { UpdateResponseDto } from '#dto/update-response.dto';
import { UserRole } from '#api/users/entities/user.entity';
import { User } from '#decorators/user.decorator';
import { JwtUser } from '#api/auth/auth.service';
import { Obj } from '#types';
import { TodoService } from './todo.service';

@Controller('todo')
@ApiTags('todo')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
export class TodoController {
  constructor(private readonly service: TodoService) {}

  @Post()
  @ApiCreatedResponse({ type: TodoEntity })
  create(@Body() data: TodoEntity, @User() user: JwtUser) {
    return this.service.create(data, user);
  }

  @Get()
  @Public()
  @ApiQuery({ name: 'page', type: 'number', required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: 'number', required: false, example: 50 })
  @ApiOkResponse({ type: PostsWithCount })
  findAll(@Query() queries?: Obj) {
    return this.service.findAll(queries);
  }

  @Get(':id')
  @Public()
  @ApiOkResponse({ type: TodoEntity })
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findById(id);
  }

  /**
   * list a user's data
   */
  @Get('user/:id')
  @Public()
  @ApiOkResponse({ type: TodoEntity })
  @ApiQuery({ name: 'page', type: 'number', required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: 'number', required: false, example: 50 })
  findByUser(@Param('id', ParseUUIDPipe) id: string, @Query() queries?: Obj) {
    return this.service.findByUser(id, queries);
  }

  /**
   * list current user's data
   */
  @Get('me')
  @ApiOkResponse({ type: TodoEntity })
  @ApiQuery({ name: 'page', type: 'number', required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: 'number', required: false, example: 50 })
  findByCurrentUser(@User('sub') userId: string, @Query() queries?: Obj) {
    return this.service.findByUser(userId, queries);
  }

  @Get('hashtag/:hashtag')
  @Public()
  @ApiOkResponse({ type: PostsWithCount })
  @ApiQuery({ name: 'page', type: 'number', required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: 'number', required: false, example: 50 })
  findByLabel(@Param('hashtag') label: string, @Query() queries?: Obj) {
    return this.service.findByLabel(label, queries);
  }

  @Patch(':id')
  @Own('user')
  @ApiCreatedResponse({ type: UpdateResponseDto })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: PartialTodoEntity,
  ) {
    return this.service.updateById(id, data);
  }

  @Delete(':id')
  @Own('user')
  @ApiOkResponse({ type: UpdateResponseDto })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.removeById(id);
  }

  /**
   * delete all
   * allowed for the system admin only
   * @returns
   */
  @Delete()
  @Roles(UserRole.ADMIN)
  @ApiNoContentResponse()
  removeAll() {
    return this.service.removeAll();
  }
}
