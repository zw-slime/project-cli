export interface Res<T = Record<string, unknown>> {
  errorCode: number; // 业务错误码
  errorInfo: string; // 错误信息
  // errDetail: string[]; // 错误详情
  // errDebugs: string[]; // 错误 debug 信息，一般为服务器内部错误信息，不要展示给用户
  data: T; // 实际的业务数据
}

// 带分页的数据
export interface DWithP<T> {
  pn: number;
  ps: number;
  total: number;
  items: T[];
}

// 业务错误码
export enum ErrCode {
  Success = 1000,

  // token 相关错误码
  TokenEmpty = 2000_0001,
  TokenExpired = 2000_0002,
  TokenInvalid = 2000_0003,
}
