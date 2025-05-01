import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const config = {
  jwt: {
    secret: process.env.JWT_SECRET || '',
    audience: process.env.JWT_AUDIENCE || '',
    issuer: process.env.JWT_ISSUER || '',
  },
};

export default config;
