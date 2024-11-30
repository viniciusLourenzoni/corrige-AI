import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateUserDto } from './account.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async registerUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    return await this.accountService.createUser(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async loginUser(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<any> {
    return await this.accountService.loginUser(email, password);
  }

  @Get('current')
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(): Promise<any> {
    return await this.accountService.getCurrentUser();
  }

  @Post('resend-confirmation')
  @HttpCode(HttpStatus.OK)
  async resendConfirmation(@Body('email') email: string): Promise<any> {
    return await this.accountService.resendConfirmation(email);
  }
}
