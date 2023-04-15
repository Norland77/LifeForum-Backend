import { DynamicModule } from '@nestjs/common';
import { sync as requireGlobSync } from 'require-glob';
import { isObject } from '@nestjs/common/utils/shared.utils';

export class AppImportsLoader {
  static load(pattern: string | string[]): DynamicModule[] {
    const result = requireGlobSync(pattern);
    return result && isObject(result)
      ? Object.values(result)
          .map((item) => item.default)
          .reduce((modules, item) => modules.concat(Array.isArray(item) ? item : [item]), [])
      : [];
  }
}