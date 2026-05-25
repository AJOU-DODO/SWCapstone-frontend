"use client";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm }: DeleteConfirmModalProps) {
  // 안전장치: isOpen이 false면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" // z-index를 60으로 높여 부모 모달(50) 위로 올림
      onClick={onClose} // 배경 클릭 시 닫힘
    >
      <div 
        onClick={(e) => e.stopPropagation()} // 버블링 방지 (부모 모달 영향 X)
        className="bg-white rounded-xl p-6 w-full max-w-xs shadow-xl text-center flex flex-col gap-4"
      >
        <div className="text-red-500 mx-auto bg-red-50 p-3 rounded-full w-fit text-xl">
          ⚠️
        </div>
        
        <div>
          <h4 className="text-base font-bold text-gray-800">정말 삭제하시겠습니까?</h4>
          <p className="text-xs text-gray-500 mt-1">삭제된 화이트리스트는 복구할 수 없습니다.</p>
        </div>
        
        {/* 버튼 영역 */}
        <div className="flex flex-row gap-2 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-sm text-sm font-medium hover:bg-gray-200"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2 bg-red-500 text-white rounded-sm text-sm font-medium hover:bg-red-600 transition-colors"
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
}