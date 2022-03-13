/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { TransactionType, TransactionStatus } from 'src/Models/Interface/transaction.status';

@Injectable()
export class WithdrawService {

    constructor(@InjectModel() private _knex: Knex){}


    async xWithdraw(userId: number, payload){
        const { amount } = payload
        try{
    /**Note that it a real life application, the following sections is suppose to be making call to a paymaent platform API
     * before having to update the transaction record
     */
            await this.checkAccountExist(userId).then(
            (result) =>{
                if(result){
                    const {acct_id, account_balance, account_number, account_name } = result;
                    let newBalance = account_balance;
                    newBalance -= parseFloat(`${amount}`);
                    console.log("This is the result", amount)
                    if(account_balance < amount){
                        throw new HttpException("Unable to perform the operation. You have insufficeient fund", HttpStatus.FORBIDDEN)
                    }else {
                        this._knex.table('account_details')
                        .update('account_balance', newBalance)
                        .where('account_number', account_number).then(
                            (data)=> {
                                this._knex.table('acct_transactions')
                                .insert({
                                    transaction_type: TransactionType.WITHDRAW,
                                    transaction_status: TransactionStatus.SUCCESS,
                                    transaction_date: new Date(),
                                    amount_paid: parseFloat(`${amount}`),
                                    transaction_acct_holder_name: account_name,
                                    acct_id: acct_id
                                })
                            }
                        )}
                }

            },
            (err) =>{
                throw new HttpException(err.message, err.response)
            }
        )} catch(err){
            throw new HttpException(err.message, err.response)
        }

        return `Your withdrawal was successful`
    }

        //Method for getting the account details of the user that is about making the Withdrawal
        async checkAccountExist(userId) {
            try{
                const foundAcct = await this._knex.table('account_details')
                .select()
                .where('user_id', userId)
    
                if(foundAcct.length > 0) {
                    return foundAcct[0]
                } else {
                    throw new HttpException(`No account found for this User with ID ${userId}`, HttpStatus.NOT_FOUND)
                }
            } catch(err) {
                throw new HttpException(err, err.statuscode)
            }
        }
}
