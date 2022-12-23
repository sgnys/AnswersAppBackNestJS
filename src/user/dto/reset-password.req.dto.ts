import { IsNotEmpty, Length } from 'class-validator';

export class ResetPasswordRequestDto {
  @IsNotEmpty()
  resetToken: string;

  @IsNotEmpty()
  @Length(8, 24)
  newPass: string;

  @IsNotEmpty()
  @Length(8, 24)
  confirm: string;
}
