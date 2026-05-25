import api from '../axios';
import { CategoryName, CategoryOrder } from '@/types/indexAdmin';

// 카테고리 전체 목록 조회
export const getCategories = async (params?: { includeDeleted?: boolean; sortBy?: string }) => {
  const { data } = await api.get('/api/v1/admin/categories', { params });
  return data;
};

// 카테고리 생성
export const postCategory = async (body : CategoryName) => {
  const { data } = await api.post(`/api/v1/admin/categories`, body);
  return data;
};

// 카테고리명 수정
export const updateCategory = async (
  id: number,
  body: CategoryName
) => {
  const { data } = await api.patch(`/api/v1/admin/categories/${id}`, body);
  return data;
};

// 카테고리 노출 순서 일괄 변경
export const updateCategoryOrder = async (body: CategoryOrder[]) => {
  const { data } = await api.put(`/api/v1/admin/categories/orders`, body);
  return data;
};

// 카테고리 삭제
export const deleteCategory = async (id: number) => {
  const { data } = await api.delete(`/api/v1/admin/categories/${id}`);
  return data;
};