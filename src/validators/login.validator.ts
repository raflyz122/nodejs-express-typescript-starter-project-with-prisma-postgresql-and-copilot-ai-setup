import * as Yup from 'yup';
import { LoginModel } from '../models/login.model';

const LoginValidator: Yup.ObjectSchema<LoginModel> = Yup.object().shape({
  email: Yup.string().required('Email is required'),
  password: Yup.string().required('Password is required'),
  rememberMe: Yup.boolean().required('Remember me is required'),
});

export default LoginValidator;
