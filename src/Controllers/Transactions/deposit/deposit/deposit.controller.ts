/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { DepositDto } from 'src/Models/DTO/deposite.dto';
import { DepositService } from 'src/Services/Transaction/Deposit/deposit/deposit.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/Middlewares/AuthMiddlewares/Gaurds/jwt-auth.guard';

@ApiTags('Deposit Section')
@Controller('api/deposit')
export class DepositController {
    constructor(private _depositService: DepositService){}


    @UseGuards(JwtAuthGuard)
    @Post('/deposit')
    @ApiOperation({summary: 'Credit Your Account'})
    deposit(@Param('userId') userId: any, @Body() depositDto: DepositDto,
             @Res() response: Response){
        return this._depositService.xDeposit(depositDto).then(
            (res)=>{
                response.send(res)
            },
            (err)=> {
                response.send(err)
            }
        )
    }
}
