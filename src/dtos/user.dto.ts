import { AuthProvider, UserRole } from '../prisma/generated';

export interface UserDto {
  id: string;
  email: string;
  passwordHash?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  phoneCountryCode?: string | null;
  dateOfBirth?: Date | null;
  profileImageUrl?: string | null;
  provider?: AuthProvider;
  providerId?: string | null;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string | null;
  role?: UserRole;
  isActive?: boolean;
  createdAt: Date;
  updatedAt?: Date | null;
}

export interface CreateUserDto {
  email: string;
  passwordHash?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  phoneCountryCode?: string;
  dateOfBirth?: Date;
  profileImageUrl?: string;
  provider?: AuthProvider;
  providerId?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}
