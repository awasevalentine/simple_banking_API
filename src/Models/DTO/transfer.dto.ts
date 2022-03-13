/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";

export class TransferDTO {
    @ApiProperty({description: 'The amount you wish to transfer', example: 200.50})
    amount: number;

    @ApiProperty({description: 'Account number of the receiver', example: 1647082663035})
    receiverAcctNo: number;

    @ApiProperty({description: 'You full name as the sender', example: 'Valentine Bassey'})
    senderName: string;

}