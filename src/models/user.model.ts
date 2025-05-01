export interface CreateUserModel {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  phoneCountryCode?: string;
}
