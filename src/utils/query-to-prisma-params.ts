type ValueType = string | number | boolean | null;
export type PrismaFilter = {
  where: Record<string, any>;
  select?: Record<string, any>;
  include?: Record<string, any>;
  take?: number;
  skip?: number;
};
type IncludeType = Record<string, any>;

export class QueriesUtils {
  private stringToObject(key: string, value: ValueType): Record<string, any> {
    const segments = key.split('__');
    if (segments.length === 1) return { [key]: this.castValue(value) };

    value = this.castValue(value);
    return this.buildObject(segments, value);
  }

  private castValue(value: ValueType): ValueType {
    if (typeof value === 'string') {
      if (value === '') return '';
      if (!isNaN(+value)) return Number(value);
      if (value === 'true') return true;
      if (value === 'false') return false;
      if (value === 'null') return null;
    }
    return value;
  }

  private buildObject(
    segments: string[],
    value: ValueType,
  ): Record<string, any> {
    return segments.reduceRight<Record<string, any>>(
      (acc, key) => ({ [key]: acc }),
      value as any,
    );
  }

  private deepMerge(target: IncludeType, source: IncludeType): IncludeType {
    if (!this.isObject(target) || !this.isObject(source)) {
      return source;
    }

    for (const key of Object.keys(source)) {
      if (this.isObject(source[key]) && this.isObject(target[key])) {
        target[key] = this.deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }

    return target;
  }

  private isObject(value: unknown): value is Record<string, any> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  public toPrismaFilterMap(queries: Record<string, any>): PrismaFilter {
    const prismaFilters: PrismaFilter = {
      where: undefined,
      select: undefined,
      include: undefined,
      take: undefined,
      skip: undefined,
    };

    for (const [key, value] of Object.entries(queries)) {
      const castedValue = this.castValue(value);

      switch (key) {
        case 'limit':
          prismaFilters.take = parseInt(String(castedValue)) || undefined;
          break;
        case 'offset':
          prismaFilters.skip = parseInt(String(castedValue)) || undefined;
          break;
        default:
          if (!key.includes('__')) {
            prismaFilters.where[key] = castedValue;
          } else {
            const parsedObject = this.stringToObject(key, castedValue);
            if ('include' in parsedObject) {
              prismaFilters.include = this.deepMerge(
                prismaFilters.include || {},
                parsedObject.include,
              );
            } else if ('select' in parsedObject) {
              prismaFilters.select = this.deepMerge(
                prismaFilters.select || {},
                parsedObject.select,
              );
            } else {
              prismaFilters.where = { ...prismaFilters.where, ...parsedObject };
            }
          }
      }
    }

    (['select', 'include', 'take', 'skip'] as const).forEach((key) => {
      if (
        prismaFilters[key] === undefined ||
        Object.keys(prismaFilters[key] || {}).length === 0
      ) {
        delete prismaFilters[key];
      }
    });

    return prismaFilters;
  }
}
