import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendEmailDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  to: string | string[];

  @IsString()
  @IsEmail()
  ccAddress?: string | string[];

  @IsString()
  @IsEmail()
  replyTo?: string | string[];

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  text: string;

  @IsString()
  html?: string;
}
