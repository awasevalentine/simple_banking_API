/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { DepositController } from 'src/Controllers/Transactions/deposit/deposit/deposit.controller';
import { TransferController } from 'src/Controllers/Transactions/transfer/transfer.controller';
import { WithdrawController } from 'src/Controllers/Transactions/withdraw/withdraw.controller';
import { DepositService } from 'src/Services/Transaction/Deposit/deposit/deposit.service';
import { TransferService } from 'src/Services/Transaction/Transfer/transfer/transfer.service';
import { WithdrawService } from 'src/Services/Transaction/Withdrawal/withdraw/withdraw.service';
import { UserService } from 'src/services/users/user/user.service';

@Module({
    imports: [],
    controllers: [
        DepositController, 
        TransferController,
        WithdrawController
    ],
    providers: [
        DepositService,
        TransferService,
        WithdrawService,
        UserService,
    ]

})
export class TransactionsModule {}
