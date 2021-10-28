import { parse } from 'querystring';
import jwtDecode from 'jwt-decode';

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export interface JWTDecoded {
  verified: boolean; // 是否通过验证
  raw: null | string; // 原始 Token
  data: null | {
    username: string;
    iss: string; // 签发人
    aud: string; // 签发客户
    iat: Date; // 签发时间
    nbf: Date; // 生效时间
    exp: Date; // 过期时间
  };
}

interface JWTPayload {
  username: string;
  iss: string; // 签发人
  aud: string; // 签发客户
  iat: number; // 签发时间
  nbf: number; // 生效时间
  exp: number; // 过期时间
}

function getTokenFromUrl(): string {
  const { token } = getPageQuery();
  if (typeof token === 'string' && token.trim()) {
    // 如果 url 中存在 token 参数，且值不为空
    return token.trim();
  }
  return '';
}

class Auth {
  private readonly key = 'token';

  jwtTokenVerify(t?: string): JWTDecoded {
    const jwt = t ? t : this.getToken();

    const ret: JWTDecoded = {
      verified: false,
      raw: null,
      data: null,
    };
    if (!(jwt && jwt !== '')) {
      return ret;
    }
    ret.raw = jwt;
    let decoded = null;
    try {
      decoded = jwtDecode(jwt) as JWTPayload;
    } catch (e) {
      return ret;
    }

    if (!decoded) {
      return ret;
    }
    if (
      !(decoded.iss && decoded.aud && decoded.username && decoded.iat && decoded.nbf && decoded.exp)
    ) {
      return ret;
    }
    if (
      decoded.iat.toString(10).length < 10 &&
      decoded.nbf.toString(10).length < 10 &&
      decoded.exp.toString(10).length < 10
    ) {
      return ret;
    }
    ret.data = {
      ...decoded,
      iat: new Date(decoded.iat * 1000),
      nbf: new Date(decoded.nbf * 1000),
      exp: new Date(decoded.exp * 1000),
    };

    if (decoded.iss !== 'auth') {
      return ret;
    }
    // if (decoded.aud !== this.url.split('/', 3)[2]) {
    //   return ret;
    // }
    if (decoded.username === '') {
      return ret;
    }

    const ct = Math.round(Date.now() / 1000);

    if (decoded.iat > ct) {
      return ret;
    }
    if (decoded.nbf > ct) {
      return ret;
    }
    if (decoded.exp < ct) {
      return ret;
    }

    ret.verified = true;
    return ret;
  }

  getUserName(): string {
    const decoded = this.jwtTokenVerify();
    return decoded?.data?.username || '';
  }

  logout() {
    localStorage.removeItem(this.key);
  }

  getToken(): string {
    // 如果前端也判断下过期时间，做 refresh 操作的话， 可以写在这里
    const str = localStorage.getItem(this.key);
    if (str) {
      try {
        return atob(str);
      } catch (e) {
        this.setToken('');
        this.logout();
        return '';
      }
    }
    // 缓存中没有，看看 url 中有没有
    const token = getTokenFromUrl();

    if (token) {
      this.setToken(token);
      // 去除 url 中的 token 参数，然后刷新
      return token;
    }
    // 缓存中也没有，url 中也没有，跳转登录页面
    this.logout();
    return '';
  }

  setToken(token: string) {
    // 对 token 进行 base64 编码，然后存入 LocalStorage
    localStorage.setItem(this.key, btoa(token));
  }
}

export const auth = new Auth();
