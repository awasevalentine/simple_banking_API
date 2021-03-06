/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KnexModule } from 'nest-knexjs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './Middlewares/AuthMiddlewares/Strategies/local-auth.strategy';
import { JwtStrategy } from './Middlewares/AuthMiddlewares/Strategies/jwt-auth.strategy';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { UserService } from './Services/user/user.service';
import { AuthService } from './Services/auth/auth.service';
import { AuthController } from './Controllers/auth/auth.controller';
import { UserController } from './Controllers/user/user.controller';


@Module({
  imports: [
  ConfigModule.forRoot(),
    KnexModule.forRoot({
      config: {
        client: 'mysql',
        connection: {
          host: process.env.MYSQL_HOST,
          port: 3306,
          user: process.env.MYSQL_USER_2,
          password: process.env.MYSQL_PASSWORD_2,
          database: process.env.MYSQL_DB,
          // debug: true,
        },
        },
    }),
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '120m' },
    }),
    TransactionsModule,
  ],
  controllers: [UserController, AuthController],
  providers: [LocalStrategy, JwtStrategy, UserService, AuthService,
  ],
})
export class AppModule {}
