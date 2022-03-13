/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';
import { InjectModel } from 'nest-knexjs';
import { CreateUserDto } from 'src/Models/DTO/newUser.dto';
import { UserDetailsFromDb } from 'src/Models/Interface/userDetails.interface';

@Injectable()
export class UserService {
    constructor(@InjectModel() private readonly knex: Knex) {}

    async create(createUserDto: CreateUserDto) {
      const { email, firstname, middlename, lastname, password } = createUserDto;
      try {
        const users = await this.knex.table('users').insert({
          email,
          firstname,
          middlename,
          lastname,
          password: await bcrypt.hash(password, 10),
          created_date: new Date()
        });
        return this.getCreatedUser(users[0]).then((res: any)=> {
            return res
        })
        return { users };
  
      } catch (err) {
        throw new HttpException(err, HttpStatus.BAD_REQUEST);
      }
    }
  
  
    /** Method for returning details of the newly created user
     * So as to assign an account number to him/her
     */
    async getCreatedUser(userid: number){
        if(!userid){
            throw Error("No User ID provided")
        }
        const foundUser = await this.knex.table('users')
        .select()
        .from('users')
        .where('user_id', userid);
  
        if(!foundUser) {
            throw new HttpException(`No User with ID ${userid} found `, HttpStatus.NOT_FOUND)
        } else {
            return this.xAcountCreation(foundUser);
        }
  
  
    }
  
    /*Method for creating the Account for the newly created user */
    async xAcountCreation(details){
      const { user_id, firstname, middlename, lastname} = details[0];
  
      const accountNumber = Date.now() + Math.ceil(Math.random());
  
  
      const createAccountForUser = await this.knex.table('account_details')
      .insert({
          user_id,
          account_number: accountNumber,
          account_name: firstname + " " + middlename + " " + lastname,
          account_balance: 0.00.toFixed(2),
          created_date: new Date()
      })
  
      //If the account is created, fetch the created account details using the account Id retured and extract the account number from it
      if(createAccountForUser){
         const accountNo =  await this.knex.table("account_details")
          .select('account_number')
          .where('acct_id', createAccountForUser[0]);
  
          return `Your account has been Created Successfully! \n
          Your Account Number is: ${accountNo[0].account_number}
                  `
      } else {
          throw Error("An Error occured, could not create an account for the user.")
      }
    }
  
    
    async getUserByEmail(email: any): Promise<UserDetailsFromDb> {
          const user = await this.knex
          .select()
          .from('users')
          .where('email', email)
          if(!user) {
            throw new HttpException(`${email} not found on the database!`, 404);
          }
          return user[0];
    }
  
    async getUserbyAccountNo(acctNo: number){
        const foundUser = await this.knex.select()
        .from('users')
        .leftJoin('account_details', 'users.user_id', 'account_details.user_id')
        .where('account_details.account_number', acctNo)
  
        if(foundUser){
          return foundUser[0];
        } else{
          throw Error("Could not find any associate account for the provided Account Number")
        }
    }
  
  }
  