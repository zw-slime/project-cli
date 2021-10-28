import { createQueryHook } from './helper';
import { authApi } from '../api/auth';

export const useLogin = createQueryHook('login', authApi.login, {
  staleTime: 0,
  cacheTime: 0,
});
