"use client";

import SearchBar from '@/components/admin/SearchBar';
import CategoryCard from '@/components/admin/category/CategoryCard';
import SortSection from '@/components/admin/SortSection';
import IncludeDeletedToggle from '@/components/admin/category/IncludeDeletedToggle';
import CreateCategoryModal from '@/components/admin/category/CreateCategoryModal';

import { Category } from '@/types/indexAdmin';
import { getCategories } from '@/lib/adminApi/category';
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const searchParams = useSearchParams();
  const sort = searchParams.get('sort') || 'sortOrder,desc';
  const includeDeleted = searchParams.get('includeDeleted') || 'true';

  const [sortBy] = sort.split(',');

  const sortOptions = [
    { label: "기본", value: "sortOrder" },
    { label: "게시글 수", value: "nestCount" },
  ];

  useEffect(() => {
      const fetchUsers = async () => {
        try {
          const data = await getCategories({ includeDeleted:includeDeleted, sortBy: sortBy });
          setCategories(data.data);
        } catch (error) {
          console.error('카테고리 목록 로딩 실패:', error);
        } 
      };
  
      fetchUsers();
    }, [searchParams]);
  

  return (
    <div className="grid grid-rows-[auto_auto_1fr_auto] p-10 pr-20 gap-8 h-screen overflow-hidden">
      <div className="justify-between items-center">
        <SearchBar placeholder='카테고리 검색' /> 
      </div>

      <div className='flex flex-row justify-between'>
        <SortSection options={sortOptions} defaultSort='sortOrder' disableToggle={true}/>
        <IncludeDeletedToggle />
      </div>

      <div className="h-full overflow-y-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
          {categories.map((category) => (
            <CategoryCard 
            key={category.id}
            category={category}/>
          ))}
        </div>
      </div>

      <div className="flex justify-end items-center">
        <button 
        onClick={() => setIsModalOpen(true)}
        className="flex items-center justify-center w-10 h-10 bg-[#2B6340] text-white rounded-full text-xl font-bold hover:bg-[#1e462d] transition-colors shadow-md">
          +
        </button>

        <CreateCategoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      </div>
    </div>
  );
}
