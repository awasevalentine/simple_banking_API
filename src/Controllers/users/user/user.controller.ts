/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from 'src/services/users/user/user.service';
import { CreateUserDto } from './../../../Models/DTO/newUser.dto';
import { Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags('User Account Creation')
@Controller('api/user')
export class UserController {

    constructor(private _userService: UserService){}

    @Post('/create_user')
    @ApiOperation({summary: "Account Creation"})
    async createUser(@Body() createUserDto: CreateUserDto, @Res() response:Response){
        return this._userService.create(createUserDto).then(
            (res)=> {
                response.send(res)
            },
            (err)=> {

                if(err.response.code == 'ER_DUP_ENTRY'){
                    response.send('A user with the provided Email already exist')
                }
                else {
                response.send(err)
                }
            }
        )
    }


    // @UseGuards(JwtAuthGuard)
    // @Get('/user/:email')
    // getUserByEmail(@Param('email') email: string, @Res() response: Response ) {
    //     this._userService.getUserByEmail(email).then(
    //         (res)=> {
    //             response.send(res)
    //         }
    //     )
    // }

    // @Get('userAccount/:userId')
    // getUserAccountDetails(@Param('userId') userId: any, @Res() response: Response){
    //     return this._userService.getUserbyAccountNo(userId).then(
    //         (result) => {
    //             response.send(result)
    //         },
    //         (err) => {
    //             response.send(err.message);
    //         }
    //     )
    // }

}
