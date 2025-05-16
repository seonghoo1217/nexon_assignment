//prettier-ignore
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Role } from './role.enum';

export interface UserDocument extends User, Document {
  toObject(): Record<string, any>;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: [String],
    enum: Role,
    default: [Role.USER],
    required: true,
  })
  roles: Role[];

  @Prop()
  refreshToken?: string;

  @Prop()
  refreshTokenExpiry?: Date;

  async validatePassword(plain: string): Promise<boolean> {
    return bcrypt.compare(plain, this.password);
  }

  isRefreshTokenValid(token: string): boolean {
    if (!this.refreshToken || !this.refreshTokenExpiry) {
      return false;
    }

    return this.refreshToken === token && this.refreshTokenExpiry > new Date();
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// 비밀번호 해시 메소드를 문서 저장 전 hook으로 자동 실행
UserSchema.pre<UserDocument>('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});
