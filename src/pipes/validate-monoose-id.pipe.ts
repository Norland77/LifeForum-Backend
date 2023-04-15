import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ValidateMongooseIdPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        return (typeof value === 'string' && value.match(/^[0-9a-fA-F]{24}$/))
                ? value
                : null;
    }
}