import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class CleanUndefinedPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    return value instanceof Object ? this.removeUndefinedValue(value) : value;
  }

  removeUndefinedValue(obj: Record<string, any>): Record<string, any> {
    for (const key of Object.keys(obj)) {
      if (obj[key] instanceof Object) this.removeUndefinedValue(obj[key]);
      if (obj[key] === undefined) delete obj[key];
    }
    return obj;
  }
}
