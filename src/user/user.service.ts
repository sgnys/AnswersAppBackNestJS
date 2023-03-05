import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UserRegisterReqDto } from './dto/user-register.req.dto';
import { sign, verify } from 'jsonwebtoken';
import { UserAccountActivationRes, RegisterUserResponse } from 'types';
import { REGEX } from '../utils/constants';
import { hashPwd } from '../utils/hash-pwd';
import { sanitizeUser } from '../utils/sanitize-user';
import { MailService } from 'src/mail/mail.service';
import { AnswerTemplateService } from '../answer-template/answer-template.service';

interface JwtRegisterPayload {
  name: string;
  email: string;
  hashedPass: string;
}

@Injectable()
export class UserService {
  constructor(
    private answerTemplateService: AnswerTemplateService,
    private mailService: MailService,
  ) {}
  async register(
    userRegister: UserRegisterReqDto,
  ): Promise<RegisterUserResponse> {
    const { name, email, password, confirm } = userRegister;

    const hashedPass = hashPwd(password);

    const payload: JwtRegisterPayload = {
      name,
      email,
      hashedPass,
    };

    console.log(payload);

    if (
      !REGEX.PASSWORD_RULE.test(password) ||
      !REGEX.PASSWORD_RULE.test(confirm)
    ) {
      throw new BadRequestException(
        'Password and confirm password should have 1 upper case, lower case letter along with a number and special character.',
      );
    }

    if (password !== confirm) {
      throw new BadRequestException(
        'Password and confirm password must be equal',
      );
    }

    const isUserExist = await this.getUserByEmail(email);
    console.log(userRegister);
    console.log(isUserExist);

    if (isUserExist) {
      throw new BadRequestException('This user already exist in database');
    }

    const token = sign({ payload }, process.env.JWT_ACC_ACTIVATE, {
      expiresIn: '20m',
    });
    console.log(token);
    try {
      // throw new Error('Bład wysyłki maila');
      await this.mailService.sendRegisterLink(email, token);
    } catch (err) {
      console.log('Email has not been sent', err);
      throw new BadRequestException('Email has not been sent');
    }

    return {
      status: 201,
      message: 'Email has been sent, kindly activate your account',
    };
  }

  async activateAccount(registerToken): Promise<UserAccountActivationRes> {
    const user = new UserEntity();
    console.log(registerToken);

    if (registerToken) {
      verify(
        registerToken,
        process.env.JWT_ACC_ACTIVATE,
        function (err, decodedToken) {
          if (err) {
            console.log('Error occurred', err);
            throw new BadRequestException('Incorrect or Expired link');
          }
          const { name, email, hashedPass } = decodedToken.payload;
          console.log(name, email, hashedPass);
          user.name = name;
          user.email = email;
          user.password = hashedPass;
        },
      );
    } else {
      throw new BadRequestException('The token has not been sent');
    }

    console.log('User', user);
    const isUserExist = await this.getUserByEmail(user.email);
    console.log('isUserExist', isUserExist);

    if (isUserExist) {
      throw new BadRequestException('This user already exist in database');
    }

    try {
      // throw new Error('cant write user in db');
      await user.save();

      const defaultTemplatesAndAnswers =
        await this.answerTemplateService.createDefaultTemplatesAndAnswersForRegisterUser();

      console.log(defaultTemplatesAndAnswers);

      user.answerTemplates = [
        defaultTemplatesAndAnswers.consultantTemplate,
        defaultTemplatesAndAnswers.customerTemplate,
      ];
      user.answers = [
        defaultTemplatesAndAnswers.consultantAnswer,
        defaultTemplatesAndAnswers.customerAnswer,
      ];

      await user.save();

      console.log(user);
      return sanitizeUser(user);
    } catch (err) {
      console.log('Error in signup while account activation: ', err);
      throw new BadRequestException('Error activating account');
    }
  }

  async forgotPassword(email: string): Promise<RegisterUserResponse> {
    console.log(email);
    const user = await this.getUserByEmail(email);
    console.log(user);
    console.log(user.id);

    if (!user) {
      throw new BadRequestException('User with this email does not exist.');
    }

    const token = sign({ id: user.id }, process.env.RESET_PASSWORD_KEY, {
      expiresIn: '20m',
    });

    console.log(token);

    try {
      // throw new Error('example error');
      await UserEntity.update({ email }, { resetLinkToken: token });
      await this.mailService.sendPasswordResetLink(email, token);
      return {
        status: 200,
        message: 'Email has been sent, kindly follow the instructions',
      };
    } catch (err) {
      console.log('Error while sending email with resetLinkToken', err);
      throw new BadRequestException('Reset password link error');
    }
  }

  async resetPassword(resetPass): Promise<RegisterUserResponse> {
    console.log(resetPass);
    const { resetToken, newPass, confirm } = resetPass;
    let userId = null;

    if (
      !REGEX.PASSWORD_RULE.test(newPass) ||
      !REGEX.PASSWORD_RULE.test(confirm)
    ) {
      throw new BadRequestException(
        'Password and confirm password should have 1 upper case, lower case letter along with a number and special character.',
      );
    }

    if (newPass !== confirm) {
      throw new BadRequestException(
        'password and confirm password must be equal',
      );
    }

    if (resetToken) {
      verify(
        resetToken,
        process.env.RESET_PASSWORD_KEY,
        function (err, decodedToken) {
          if (err) {
            console.log('Error occurred', err);
            throw new BadRequestException('Incorrect or Expired link');
          }
          console.log(decodedToken.id);
          userId = decodedToken.id;
        },
      );
    } else {
      throw new BadRequestException('The token has not been sent');
    }

    const user = await this.getUserById(userId);

    if (!user) {
      throw new BadRequestException('User with this token does not exist');
    }

    user.password = hashPwd(newPass);
    user.resetLinkToken = null;
    await user.save();

    try {
      // throw new Error('example error');
      user.password = hashPwd(newPass);
      await user.save();
      return {
        status: 200,
        message: 'Your password has been changed.',
      };
    } catch (err) {
      console.log('Reset password error', err);
      throw new UnauthorizedException('Reset password error');
    }
  }

  async getUserById(id: string): Promise<UserEntity | undefined> {
    return await UserEntity.findOne({
      where: { id },
    });
  }

  async getUserByEmail(email: string): Promise<UserEntity | undefined> {
    return await UserEntity.findOne({
      where: { email },
    });
  }

  async getUserByCurrentTokenId(
    token: string,
  ): Promise<UserEntity | undefined> {
    return await UserEntity.findOne({
      where: { currentTokenId: token },
    });
  }
}
