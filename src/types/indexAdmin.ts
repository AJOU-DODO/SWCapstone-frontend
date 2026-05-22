// 공지사항
export interface Notice {
  id: number;
  category: "UPDATE" | "EVENT" | "POLICY";
  categoryDescription: string;
  title: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}