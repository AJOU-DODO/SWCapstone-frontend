//엽서함에서 내 엽서 / 받은 엽서 버튼 컴포넌트

interface PostcardTabProps {
  currentTab: 'mine' | 'sent' | 'received';
  onTabChange: (tab: 'mine'| 'sent' | 'received') => void;
}

export default function PostcardTab({ currentTab, onTabChange }: PostcardTabProps) {
  return (
    <div className="flex w-full border-b">
      <button 
        onClick={() => onTabChange('mine')}
        className={`flex-1 py-3 ${currentTab === 'mine' ? 'border-b-2 border-[#54513E] text-[#54513E] font-bold shadow-sm' : 'text-[#54513E]/50'}`}
      >
        보유 엽서함
      </button>
      <button 
        onClick={() => onTabChange('sent')}
        className={`flex-1 py-3 ${currentTab === 'sent' ? 'border-b-2 border-[#54513E] text-[#54513E] font-bold shadow-sm' : 'text-[#54513E]/50'}`}
      >
        보낸 엽서함
      </button>
      <button 
        onClick={() => onTabChange('received')}
        className={`flex-1 py-3 ${currentTab === 'received' ? 'border-b-2 border-[#54513E] text-[#54513E] font-bold shadow-sm' : 'text-[#54513E]/50'}`}
      >
        받은 엽서함
      </button>
    </div>
  );
}