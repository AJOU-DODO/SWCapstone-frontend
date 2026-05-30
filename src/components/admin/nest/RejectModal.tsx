interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

export default function RejectModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  isLoading 
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">

      <div 
      className="fixed inset-0 w-screen h-screen bg-black/40 z-0" 
      onClick={onClose} 
    />
      
      {/* 모달 박스 */}
      <div 
      onClick={(e) => e.stopPropagation()}
      className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-4 border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
        <div>
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{message}</p>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="flex flex-row justify-end gap-2 mt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 cursor-pointer text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-md transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-xs cursor-pointer font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50"
          >
            {isLoading ? "처리 중..." : "확인"}
          </button>
        </div>
      </div>
    </div>
  );
}