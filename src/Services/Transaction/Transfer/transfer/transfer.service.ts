/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { TransferDTO } from 'src/Models/DTO/transfer.dto';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { TransactionStatus, TransactionType } from 'src/Models/Interface/transaction.status';

@Injectable()
export class TransferService {

    constructor(@InjectModel() private _knex: Knex){}

    //Method for making tranfers to other users
    async xTransfer(userId, payload: TransferDTO){
        const { amount, senderName, receiverAcctNo } = payload;
                    
        //section for executing the find user account method
                const depositorAcctUpdate = await this.getMyAccountDetails(userId).then(
                    (result) => {
                        if(result) {
                                const {acct_id, account_balance, account_number, } =result;
                                let newUserNewBalance = account_balance;
                                newUserNewBalance -= parseFloat(`${amount}`);
                                if(account_balance < amount) {
                                    throw new HttpException(`You have insufficient balance`, HttpStatus.FORBIDDEN)
                                }
                                else{
                                    //This updates the depositor(Transferrer) account with his/here new balance after the transfer
                                   const updateDepositorAcct =  this._knex.table('account_details')
                                    .update('account_balance', newUserNewBalance)
                                    .where('account_number', account_number).then(
                                        (data)=> {
                                            const updateTransactionDb = this._knex.table('acct_transactions')
                                            .insert({
                                                transaction_type: TransactionType.TRANSFER,
                                                transaction_status: TransactionStatus.SUCCESS,
                                                transaction_date: new Date(),
                                                amount_paid: parseFloat(`${amount}`),
                                                transaction_acct_holder_name: senderName,
                                                acct_id: acct_id
                                            })

                                            if(updateTransactionDb) {
                                                return updateTransactionDb
                                            }else {
                                                throw new HttpException(`Transaction was unsuccessful`, HttpStatus.INTERNAL_SERVER_ERROR)
                                            }
                                        },
                                        (err) => {
                                            throw new HttpException(err.message, err.status)
                                        }
                                    )
                                    if(updateDepositorAcct){
                                        return true
                                    }
                                }
                            }
                        },
                        (err)=> {
                            throw new HttpException(err.message, HttpStatus.NOT_FOUND)
                        });
            //Section for updating the receivers account and updating the transaction table
            if(depositorAcctUpdate){
                return this.getReceiverAcctDetails(receiverAcctNo).then(
                     (res)=> {
                        if(res){
                            const {acct_id, account_balance, account_number, account_name } =res;
                            let amt = account_balance;
                            amt += parseFloat(`${amount}`)
                            const updateAcct = this._knex.table('account_details')
                            .update('account_balance', amt)
                            .where('account_number', receiverAcctNo).then(
                                (response) => {
                                   this._knex.table('acct_transactions')
                                    .insert({
                                        transaction_type: TransactionType.RECEIVED,
                                        transaction_status: TransactionStatus.SUCCESS,
                                        transaction_date: new Date(),
                                        amount_paid: parseFloat(`${amount}`),
                                        transaction_acct_holder_name: senderName,
                                        acct_id: acct_id
                                    }).then()
                                },
                                (err) => {
                                    throw new HttpException(`Transaction failed!`, HttpStatus.INTERNAL_SERVER_ERROR)
                                });
                        return `Congratulation! Transaction was successful.`

                        }
                    },
                    (err) => {
                        throw new HttpException(err.message, err.response)
                    });
            }
    }

    //Method for finding if the account number of the receiver entered, exist.
    async getReceiverAcctDetails(acctNo){
        try{
            const found = await this._knex.table('account_details')
            .select()
            .where('account_number', acctNo)

            if(found.length > 0) {
                return found[0]
            } else {
                throw new HttpException(`No account information found for the provided account number`, HttpStatus.NOT_FOUND)
            }
        } catch(err) {
            throw new HttpException(err.message, err.statusCode);
        }
    }


    //Method for getting the account details of the user that is about making the transfer
    async getMyAccountDetails(userId) {
        try{
            const foundAcct = await this._knex.table('account_details')
            .select()
            .where('user_id', userId)

            if(foundAcct.length > 0) {
                return foundAcct[0]
            } else {
                throw new HttpException(`No account found for this ID ${userId}`, HttpStatus.NOT_FOUND)
            }
        } catch(err) {
            throw new HttpException(err, err.statuscode)
        }
    }
}
