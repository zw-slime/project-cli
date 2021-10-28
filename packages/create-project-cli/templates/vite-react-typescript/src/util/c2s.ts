import camelcase from 'camelcase';
import decamelize from 'decamelize';

// 驼峰转蛇形
export function c2s(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((o) => c2s(o));
  }
  if (obj === null || typeof obj === 'string' || obj instanceof Date || typeof obj !== 'object') {
    return obj;
  }
  return Object.entries(obj).reduce((o, [k, v]) => ({ ...o, [decamelize(k)]: c2s(v) }), {});
}

// 蛇形转驼峰
export function s2c(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((o) => s2c(o));
  }
  if (obj === null || typeof obj === 'string' || obj instanceof Date || typeof obj !== 'object') {
    return obj;
  }
  return Object.entries(obj).reduce((o, [k, v]) => ({ ...o, [camelcase(k)]: s2c(v) }), {});
}
