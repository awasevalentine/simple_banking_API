/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";


export class CreateUserDto {

  @ApiProperty({example: 'example@gmail.com'})
  email: string;

  @ApiProperty({example: 'Valentine'})
  firstname: string;

  @ApiProperty({example: 'Bassey'})
  middlename: string;

  @ApiProperty({example: 'Egbonyi'})
  lastname: string;

  @ApiProperty({example: '12345678'})
  password: string;
}


export class SignInDto {
  @IsEmail()
  @ApiProperty({example: 'example@gmail.com'})
  readonly email: string;

  @IsString()
  @ApiProperty({example: '123456'})
  readonly password: string;
}
