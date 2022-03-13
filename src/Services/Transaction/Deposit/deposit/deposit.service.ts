/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { DepositDto } from 'src/Models/DTO/deposite.dto';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { TransactionStatus } from 'src/Models/Interface/transaction.status';
import { UserService } from 'src/Services/user/user.service';

@Injectable()
export class DepositService {

constructor(private _userService: UserService,
            @InjectModel() private _knex: Knex
    ){}

/* In a real world app, this service will be calling the payment platform api
and if the transaction is successful, it will then store it on the DB
*/

//Method for making deposit into the account
    async xDeposit(payload: DepositDto){
        try{
        const {depositorName, acctNo, amount }  = payload
         await this._knex.table('account_details')
        .select() 
        .where('account_number', acctNo).then(
            ( result) => {
                if(result){
                    let newBalance = result[0].account_balance;
                    const foundAcctNo = result[0].account_number;
                    const acct_id = result[0].acct_id;
                    newBalance += parseFloat(`${amount}`)
                    parseFloat(newBalance).toFixed(3)
                    return this._knex.table('account_details')
                    .update('account_balance', newBalance)
                    .where('account_number', foundAcctNo)
                    .then(
                        (res) =>{
                            if(res){
                                //Section updates the transaction model of the DB
                                return this._knex.table('acct_transactions')
                                .insert({
                                    transaction_date: new Date(),
                                    transaction_status: TransactionStatus.SUCCESS,
                                    transaction_acct_holder_name: depositorName,
                                    transaction_type: 'Deposit',
                                    acct_id: acct_id,
                                    amount_paid: parseFloat(`${amount}`)
                                })
                            } else {
                                throw new HttpException("Unable to perform transaction", HttpStatus.INTERNAL_SERVER_ERROR)
                            }
                        }
                    )
                }
            },
            (err) => {
                throw new HttpException(err.message, err.response)
            }
        )
        return "Your deposit was successful"
        } catch(err) {
            throw new HttpException(err.message, err)
        }
    }
}
