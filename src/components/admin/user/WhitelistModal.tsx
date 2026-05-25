"use client";

import { getWhitelists, deleteWhitelist } from '@/lib/adminApi/user';
import { useEffect, useState } from "react";
import { Whitelists } from '@/types/indexAdmin';

import PostWhitelistModal from '@/components/admin/user/PostWhitelistModal';
import DeleteConfirmModal from '@/components/admin/user/DeleteConfirmModal';

interface WhitelistModalProps {
  isOpen: boolean;
  onClose: () => void; // 모달을 닫는 함수 타입
}

export default function WhitelistModal ({ isOpen, onClose }: WhitelistModalProps) {
  const [whitelist, setWhitelist] = useState<Whitelists[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  if (!isOpen) return null;

  useEffect(() => {
    const fetchUsers = async () => {
      try {

        const data = await getWhitelists();
        setWhitelist(data.data);
      } catch (error) {
        console.error('화이트리스트 목록 로딩 실패:', error);
      } 
    };

    fetchUsers();
  }, [refreshTrigger]);

  const handleDelete = async () => {
    if (deleteTargetId === null) return;

    try { 
      await deleteWhitelist(deleteTargetId);
      setDeleteTargetId(null);  
      setRefreshTrigger(prev => !prev);
    } catch (error) {
      console.error("화이트리스트 삭제 실패:", error);
    } 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl p-6 w-[70vw] h-[80vh] shadow-xl transform transition-all flex flex-col gap-4 text-center">
        <h3>관리자 화이트리스트</h3>
        
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0">
          {whitelist.length > 0 && (
            <div className="grid grid-cols-[1fr_3fr_3fr_2fr_1fr] gap-3 px-3 py-1.5 text-xs font-semibold text-gray-500 border-b-2 border-gray-200 bg-gray-50/50">
              <div>번호</div>
              <div>이메일 주소</div>
              <div>비고</div>
              <div className="text-center">등록일</div>
              <div className="text-center">관리</div>
            </div>
          )}
          {whitelist.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-8">등록된 이메일이 없습니다.</p>
          ) : (
            whitelist.map((item) => (
              <div 
                key={item.id}
                className="grid grid-cols-[1fr_3fr_3fr_2fr_1fr] gap-3 bg-gray-50 p-3 rounded-sm border border-gray-100 items-center"
              >
                <span className="text-sm text-gray-700 font-medium">{item.id}</span>
                <span className="text-sm text-gray-700 font-medium">{item.email}</span>
                <span className="text-sm text-gray-700 font-medium">{item.remark}</span>
                <span className='text-sm text-gray-700 font-medium'>{new Date(item.createdAt).toLocaleDateString()}</span>
                
                <button 
                  className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:bg-red-50 px-2 py-1 rounded-sm"
                  onClick={() => setDeleteTargetId(item.id)}
                >
                  삭제
                </button>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end items-center">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center w-10 h-10 bg-[#2B6340] text-white rounded-full text-xl font-bold hover:bg-[#1e462d] transition-colors shadow-md">
            +
          </button>
        </div>
      </div>

      <DeleteConfirmModal 
        isOpen={deleteTargetId !== null} 
        onClose={() => setDeleteTargetId(null)} 
        onConfirm={handleDelete} 
      />

      {isModalOpen && (
        <PostWhitelistModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          setIsUpdated={setRefreshTrigger}
        />
      )}
    </div>
  );
}