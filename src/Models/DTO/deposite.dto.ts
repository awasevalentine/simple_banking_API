/* eslint-disable prettier/prettier */

import { ApiProperty } from "@nestjs/swagger";

export class DepositDto {
    @ApiProperty({example: 1647082663035})
    acctNo: number;

    @ApiProperty({example: 'Valentine Bassey'})
    depositorName: string;

    @ApiProperty({example: 1000})
    amount: number;
}