import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Role } from '../schemas/role.enum';
import {
  UserNotFoundException,
  UserAlreadyExistsException,
} from '../../../../../common/exceptions/custom.exception';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string): Promise<UserDocument> {
    return await this.userModel
      .findById(id)
      .orFail(() => new UserNotFoundException('회원 정보가 존재하지 않습니다.'))
      .exec();
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async exists(username: string): Promise<boolean> {
    const existingUser = await this.userModel.exists({ username });
    return !!existingUser;
  }

  async create(username: string, password: string, roles: Role[] = [Role.USER]) {
    if (await this.exists(username)) {
      throw new UserAlreadyExistsException(username);
    }
    return this.userModel.create({ username, password, roles });
  }

  async updateRoles(userId: string, roles: Role[]) {
    const user = await this.userModel.findByIdAndUpdate(userId, { roles }, { new: true }).exec();

    if (!user) {
      throw new UserNotFoundException(userId);
    }

    return user;
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
    refreshTokenExpiry: Date | null,
  ): Promise<void> {
    const user = await this.userModel
      .findByIdAndUpdate(userId, { refreshToken, refreshTokenExpiry })
      .exec();

    if (!user) {
      throw new UserNotFoundException(userId);
    }
  }
}
