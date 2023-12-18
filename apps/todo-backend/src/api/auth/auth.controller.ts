import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './guards/auth.guard';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserEntity } from '#api/users/entities/user.entity';

@Public()
@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AuthResponseDto })
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Post('register')
  @ApiCreatedResponse({ type: AuthResponseDto })
  register(@Body() data: UserEntity) {
    return this.authService.register(data);
  }
}
