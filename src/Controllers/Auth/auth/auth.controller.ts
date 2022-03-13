/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/Middlewares/AuthMiddlewares/Gaurds/local-auth.guard';
import { SignInDto } from 'src/Models/DTO/newUser.dto';
import { AuthService } from 'src/services/auth/auth/auth.service';

@ApiTags("User Authentication")
@Controller('api/auth')
export class AuthController {

    constructor(private _authService: AuthService){}


    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiOperation({summary: 'User login and authentication'})
    async signIn(@Req() req, @Body() payload: SignInDto ) {
      return this._authService.signIn(req.user);
    }
}
