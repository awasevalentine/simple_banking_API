/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserDetailsFromDb } from './../../../Models/Interface/userDetails.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET
    });
  }

  async validate(payload: UserDetailsFromDb) {
    return {
      email: payload.email, firstname: payload.firstname, middlename: payload.middlename,
      lastname: payload.lastname,
      date_Created: payload.created_date, userId: payload.user_id
    };
  }
}