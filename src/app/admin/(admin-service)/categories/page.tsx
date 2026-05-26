"use client";

import SearchBar from '@/components/admin/SearchBar';
import CategoryCard from '@/components/admin/category/CategoryCard';
import SortSection from '@/components/admin/SortSection';
import IncludeDeletedToggle from '@/components/admin/category/IncludeDeletedToggle';
import CreateCategoryModal from '@/components/admin/category/CreateCategoryModal';

import { Category, CategoryOrder } from '@/types/indexAdmin';
import { getCategories, updateCategoryOrder } from '@/lib/adminApi/category';
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// 개별 카드를 Sortable로 감싸는 컴포넌트
function SortableCategoryCard({
  category,
  isDndEnabled,
}: {
  category: Category;
  isDndEnabled: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: category.id,
    disabled: !isDndEnabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    zIndex: isDragging ? 9999 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <CategoryCard category={category} />
    </div>
  );
}

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null); // DragOverlay용

  const [savedCategories, setSavedCategories] = useState<Category[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const searchParams = useSearchParams();
  const sort = searchParams.get('sort') || 'sortOrder,desc';
  const includeDeleted = searchParams.get('includeDeleted') || 'true';

  const [sortBy] = sort.split(',');
  const isDndEnabled = sortBy === 'sortOrder';

  const sortOptions = [
    { label: "기본", value: "sortOrder" },
    { label: "게시글 수", value: "nestCount" },
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories({ includeDeleted, sortBy });
        setCategories(data.data);
        setSavedCategories(data.data);
      } catch (error) {
        console.error('카테고리 목록 로딩 실패:', error);
      }
    };
    fetchCategories();
  }, [searchParams]);

  const handleDragStart = (event: DragStartEvent) => {
    const draggedCategory = categories.find((c) => c.id === event.active.id);
    setActiveCategory(draggedCategory ?? null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCategory(null);

    if (!over || active.id === over.id) return;

    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);

    const newCategories = arrayMove(categories, oldIndex, newIndex);
    setCategories(newCategories);
    setIsDirty(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const body: CategoryOrder[] = categories.map((c, index) => ({
        id: c.id,
        sortOrder: index,
      }));

      await updateCategoryOrder(body);

      setSavedCategories(categories);
      setIsDirty(false);
    } catch (error) {
      console.error("순서 저장 실패:", error);
      setCategories(savedCategories);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setCategories(savedCategories);
    setIsDirty(false);
  };

  return (
    <div className="grid grid-rows-[auto_auto_1fr_auto] p-10 pr-20 gap-8 h-screen overflow-hidden">
      <div className="justify-between items-center">
        <SearchBar placeholder='카테고리 검색' />
      </div>

      <div className='flex flex-row justify-between'>
        <SortSection options={sortOptions} defaultSort='sortOrder' disableToggle={true} />
        <IncludeDeletedToggle />
      </div>

      <div className="h-full overflow-y-auto pr-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={categories.map((c) => c.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max pb-4">
              {categories.map((category) => (
                <SortableCategoryCard
                  key={category.id}
                  category={category}
                  isDndEnabled={isDndEnabled}
                />
              ))}
            </div>
          </SortableContext>

          {/* 드래그 중인 카테고리 카드 */}
          <DragOverlay>
            {activeCategory ? (
              <div
                style={{
                  borderRadius: '8px',
                  cursor: 'grabbing',
                  filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.2))',
                }}
              >
                <CategoryCard category={activeCategory} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <div className="flex justify-end items-center gap-5">
        {isDirty && (
          <>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 text-sm rounded-lg bg-[#2B6340] text-white hover:bg-[#1e462d] transition-colors disabled:opacity-50"
            >
              {isSaving ? '저장 중...' : '순서 저장'}
            </button>
          </>
        )}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center w-10 h-10 bg-[#2B6340] text-white rounded-full text-xl font-bold hover:bg-[#1e462d] transition-colors shadow-md"
        >
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