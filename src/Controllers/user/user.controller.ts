/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateUserDto } from 'src/Models/DTO/newUser.dto';
import { UserService } from 'src/Services/user/user.service';


@ApiTags('User Account Creation')
@Controller('api/user')
export class UserController {

    constructor(private _userService: UserService){}

@Get('')
getme(@Res() response: Response){
    return response.send("Welcome")
}

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
    @Get('/user/:email')
    getUserByEmail(@Param('email') email: string, @Res() response: Response ) {
        this._userService.getUserByEmail(email).then(
            (res)=> {
                response.send(res)
            }
        )
    }

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
