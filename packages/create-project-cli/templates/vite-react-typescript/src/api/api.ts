import { message } from 'antd';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { auth } from '../service/auth';
import { ErrCode, Res } from '../interface';
import { c2s, s2c } from '../util';

// todo 需要确认下网络相关的非业务错误是否处理了
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    validateStatus: () => true, // 不管返回的 http 状态码是多少，都不抛出错误，在响应拦截器中进行处理
  });

  // 请求拦截器
  instance.interceptors.request.use((config) => {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${auth.getToken()}`,
    };
    // 如果后端接口，接口的 key 使用的是【蛇形】规范的话，就转换一下
    config.data = c2s(config.data);
    config.params = c2s(config.params);
    return config;
  });

  // 响应拦截器
  instance.interceptors.response.use((res: AxiosResponse<Res>) => {
    const data = s2c(res.data);

    // 首先判断接口的返回格式，不符合预定义的业务格式的情况
    // eslint 报错不能直接使用 hasOwnProperty
    if (!Object.prototype.hasOwnProperty.call(data, 'errorCode')) {
      // 返回的数据中不具备 errCode 字段
      let msg = res.statusText;
      if (res.status === 200) {
        // 状态码 200 的时候，格式不对，说明可能后端代码有问题
        msg = '接口返回数据格式有误，请联系管理员';
      }
      message.error(msg);
      // 将错误往外抛，打断正常的代码执行
      throw new Error(msg);
    }

    // 如果是 token 相关的错误，直接清空当前 token，并跳转到登录页面
    if ([ErrCode.TokenEmpty, ErrCode.TokenExpired, ErrCode.TokenInvalid].includes(data.errorCode)) {
      auth.setToken('');
      // todo React Router v6 如何在组件外部进行路由跳转？需要再调研一下
      message.error('登录状态已失效，请重新登录');
      setTimeout(() => {
        auth.logout();
      }, 3000);

      throw new Error('token invalid');
    }

    // 返回的接口数据包含 errCode，符合业务预期
    if (data.errorCode !== ErrCode.Success) {
      // errCode 不为 success 的情况，说明后端返回了一个业务错误
      message.error(data.errorInfo || '未知错误，请联系管理员');
      // 将业务错误往外抛，打断正常代码执行，或者被 try catch 捕获
      throw data;
    }

    // 此时 errCode 为 success，不管状态码或其他数据怎么样，都默认为请求成功
    return { ...res, data };
  });

  return instance;
};

export class Api {
  protected readonly axios = createAxiosInstance();
}
