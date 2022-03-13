/* eslint-disable prettier/prettier */
import { Body, Controller, Param, Post, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TransferService } from 'src/Services/Transaction/Transfer/transfer/transfer.service';
import { TransferDTO } from 'src/Models/DTO/transfer.dto';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/Middlewares/AuthMiddlewares/Gaurds/jwt-auth.guard';


@ApiTags("Transfer Section")
@Controller('api/transfer')
export class TransferController {

    constructor(private _transferService: TransferService){}

    @UseGuards(JwtAuthGuard)
    @Post('/:userid')
    @ApiOperation({summary: 'Transfering money from your account to another account'})
    makeTransfer(@Body() transferDto: TransferDTO, 
            @Param('userid') userid: number, @Res() response: Response){
            return this._transferService.xTransfer(userid, transferDto).then(
                (res)=> {
                    return response.send(res)
                },
                (err)=> {
                    return response.send(err)
                }
            )
    }
}
