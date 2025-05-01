import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AnySchema, ValidationError } from 'yup';
import CustomResponse from '../dtos/custom-response';
import PlainDto from '../dtos/plain.dto';

const validateSchema =
  (schema: AnySchema): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        const validationErrors = error.inner && error.inner.length ? error.inner.map((err: any) => err.message) : [error.message];
        const response: CustomResponse<PlainDto> = {
          success: false,
          errors: validationErrors,
        };

        res.status(400).json(response);
        return; // Ensure to return after sending the response
      }

      const response: CustomResponse<PlainDto> = {
        success: false,
        message: 'internal server error occured while validating the schema',
      };
      res.status(500).json(response);
      return; // Ensure to return after sending the response
    }
  };

export default validateSchema;

export const validateSchemaByBody = async (req: Request, schema: AnySchema) => {
  try {
    await schema.validate(req.body, { abortEarly: false }); // Allow multiple errors
    const response: CustomResponse<PlainDto> = {
      success: true,
    };

    return response;
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const validationErrors = error.inner.map((err: any) => err.message);

      const response: CustomResponse<PlainDto> = {
        success: false,
        errors: validationErrors,
      };

      return response;
    }

    const response: CustomResponse<PlainDto> = {
      success: false,
      errors: ['internal server error occured while validating the schema'],
    };

    return response;
  }
};
