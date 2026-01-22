import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class FileUploadInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error.message === 'Only image files are allowed!') {
          throw new BadRequestException(
            'Only image files (JPEG, JPG, PNG, GIF) are allowed',
          );
        }
        if (error.message === 'File too large') {
          throw new BadRequestException('File size exceeds 5MB limit');
        }
        throw error;
      }),
    );
  }
}
