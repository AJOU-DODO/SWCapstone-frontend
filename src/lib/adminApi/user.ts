import api from '../axios'; 
import { UserSanctionedPayload, AddWhitelistPayload } from '@/types/indexAdmin';

// 전체 유저 목록 조회
export const getUsers = async (params?: { sort?: string; page: number }) => {
  const { data } = await api.get('/api/v1/admin/users', { params });
  return data;
};

// 유저 제재 처리
export const sanctionUser = async ({ userId, body }: { userId: number; body: UserSanctionedPayload } ) => {
  const { data } = await api.post(`/api/v1/admin/users/${userId}/sanction`, body);
  return data;
};

// 화이트리스트 이메일 목록 조회
export const getWhitelists = async () => {
  const { data } = await api.get('/api/v1/admin/whitelists');
  return data;
};

// 화이트리스트 이메일 추가
export const postWhitelist = async (body: AddWhitelistPayload ) => {
  const { data } = await api.post('/api/v1/admin/whitelists', body);
  return data;
};

// 화이트리스트 삭제
export const deleteWhitelist = async (id: number) => {
  const { data } = await api.delete(`/api/v1/admin/whitelists/${id}`);
  return data;
};