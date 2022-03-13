/* eslint-disable prettier/prettier */
import { Body, Controller, Param, Post, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/Middlewares/AuthMiddlewares/Gaurds/jwt-auth.guard';
import { WithdrawService } from 'src/Services/Transaction/Withdrawal/withdraw/withdraw.service';


@ApiTags("Withdrawal Section")
@Controller('api/withdraw')
export class WithdrawController {

    constructor(private _withdrawalService: WithdrawService){}

    @UseGuards(JwtAuthGuard)
    @Post('/:userid')
    @ApiOperation({summary: 'use the authenticated user Id returned from the JWT Token to access the account'})
    async makeWithdrawal(@Body() amount: number, 
                        @Res() response: Response, 
                        @Param('userId') userId: number){
            
            return this._withdrawalService.xWithdraw(userId, amount).then(
                (res) => {
                    response.send(res)
                },
                (err)=> {
                    response.send(err)
                }
            )
    }
}
