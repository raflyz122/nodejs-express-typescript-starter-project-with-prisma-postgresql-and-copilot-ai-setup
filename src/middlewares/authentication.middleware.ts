import { Request, Response, NextFunction } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';
import config from '../config';
import PlainDto from '../dtos/plain.dto';
import CustomResponse from '../dtos/custom-response';

// The CustomRequest interface enables us to provide JWTs to our controllers.
export interface CustomRequest extends Request {
  token: JwtPayload;
}

export const authentication = (req: Request, res: Response, next: NextFunction) => {
  // Get the JWT from the request header.
  const token = <string>req.headers['authorization'];
  let jwtPayload;

  // Validate the token and retrieve its data.
  try {
    // Verify the payload fields.
    jwtPayload = <any>verify(token?.split(' ')[1], config.jwt.secret!, {
      complete: true,
      audience: config.jwt.audience,
      issuer: config.jwt.issuer,
      algorithms: ['HS256'],
      clockTolerance: 0,
      ignoreExpiration: false,
      ignoreNotBefore: false,
    });
    // Add the payload to the request so controllers may access it.

    (req as CustomRequest).token = jwtPayload;

    if (!req.body) req.body = {};
    req.body.jwtToken = token?.split(' ')[1];
    req.body.currentUserId = jwtPayload.payload.id;
    req.body.currentUserName = jwtPayload.payload.email;
    req.body.currentUserRole = jwtPayload.payload.role;
  } catch (error) {
    const response: CustomResponse<PlainDto> = {
      success: false,
      message: 'Missing or invalid token',
    };
    res.status(401).json(response);
    return;
  }

  next();
};

export default authentication;
