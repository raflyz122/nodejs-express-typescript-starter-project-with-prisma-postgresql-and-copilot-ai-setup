import { AuthProvider, UserRole } from "../prisma/generated";

export interface UserFilterParams {
  email?: string;
  phoneNumber?: string;
  role?: UserRole;
  isActive?: boolean;
  provider?: AuthProvider;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  twoFactorEnabled?: boolean;
  firstName?: string;
  lastName?: string;
  search?: string; // Search in firstName, lastName or email
}
