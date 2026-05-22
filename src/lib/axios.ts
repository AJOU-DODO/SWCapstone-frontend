import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_IP || 'http://localhost:8080';

const getCookie = (name: string) =>
  document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];

const setCookie = (name: string, value: string, maxAge: number) => {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
};

const api = axios.create({
  baseURL: BASE_URL,
});

// 모든 요청에 accessToken 자동으로 헤더에 추가
api.interceptors.request.use((config) => {
  const token = getCookie('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const accessMaxAge = 60 * 30;
const refreshMaxAge = 60 * 60 * 24 * 7;

// 토큰 만료 시 토큰 갱신 후 재시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getCookie('refreshToken');
      if (!refreshToken) {
        // 리프레시 토큰도 없으면 로그인 페이지로
        window.location.href = '/admin/login';
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${BASE_URL}/api/v1/auth/reissue`, {
          refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data.data;

        setCookie('accessToken', newAccessToken, accessMaxAge);       // 30분
        setCookie('refreshToken', newRefreshToken, refreshMaxAge); // 7일

        // 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch {
        // 갱신 실패 시 로그인 페이지로
        window.location.href = '/admin/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;