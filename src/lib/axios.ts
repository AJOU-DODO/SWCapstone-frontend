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

api.interceptors.request.use((config) => {
  const token = getCookie('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const accessMaxAge = 60 * 30;
const refreshMaxAge = 60 * 60 * 24 * 7;

// reissue 중복 호출 방지 락
interface ReissueResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

let refreshPromise: Promise<{ data: ReissueResponse }> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getCookie('refreshToken');
      if (!refreshToken) {
        window.location.href = '/admin/login';
        return Promise.reject(error);
      }

      try {
        // 이미 reissue 중이면 같은 Promise 재사용
        if (!refreshPromise) {
          refreshPromise = axios
            .post(`${BASE_URL}/api/v1/auth/reissue`, { refreshToken })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const { data } = await refreshPromise;
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data.data;

        setCookie('accessToken', newAccessToken, accessMaxAge);
        setCookie('refreshToken', newRefreshToken, refreshMaxAge);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch {
        window.location.href = '/admin/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;