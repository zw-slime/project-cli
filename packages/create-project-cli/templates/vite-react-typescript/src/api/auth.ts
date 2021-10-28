import { Res } from '../interface';
import { Api } from './api';
import { AxiosResponse } from 'axios';

class AuthApi extends Api {
  login = (data: { phone: string; password: string }) => {
    return this.axios.post<
      { phone: string; password: string },
      AxiosResponse<
        Res<{
          token: string;
        }>
      >
    >('/api/auth/v1/login', data);
  };
}

export const authApi = new AuthApi();
