import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/services/users/user/user.service';
import { UserDetailsFromDb } from 'src/Models/Interface/userDetails.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this._userService.getUserByEmail(email);
    if (!user) {
      return null;
    }
    const valid = bcrypt.compare(password, user.password).then(
      (validUser) => {
        if (validUser) {
          return user;
        } else {
          return null;
        }
      },
      (err) => {
        throw new ErrorEvent(`email and password not correct `);
      },
    );
    return valid;
  }

  async signIn(user: UserDetailsFromDb) {
    const payload = {
      UserId: user.user_id,
      email: user.email,
      firstname: user.firstname,
      middlename: user.middlename,
      lastname: user.lastname,
      date_created: user.created_date,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
