/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KnexModule } from 'nest-knexjs';
import { UserService } from './services/users/user/user.service';
import { AuthService } from './services/auth/auth/auth.service';
import { UserController } from './controllers/users/user/user.controller';
import { AuthController } from './controllers/auth/auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './Middlewares/AuthMiddlewares/Strategies/local-auth.strategy';
import { JwtStrategy } from './Middlewares/AuthMiddlewares/Strategies/jwt-auth.strategy';
import { TransactionsModule } from './modules/transactions/transactions.module';


@Module({
  imports: [
  ConfigModule.forRoot(),
    KnexModule.forRoot({
      config: {
        client: 'mysql',
        connection: {
          host: '127.0.0.1',
          port: 3306,
          user: process.env.MYSQL_USER,
          password: process.env.MYSQL_PASSWORD,
          database: 'lendqr',
          debug: true,
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
  providers: [LocalStrategy, JwtStrategy, UserService, AuthService],
})
export class AppModule {}
