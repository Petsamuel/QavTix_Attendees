import { cn } from "@/lib/utils";

interface ICategoryItemBtn {
    category: Category,
    handleToggle: (v: string) => void;
    isSelected: boolean
}

export default function CategoryItemBtn({ category, handleToggle, isSelected }: ICategoryItemBtn){
    return (
        <button
            key={category.value}
            onClick={() => handleToggle(category.value)}
            className={cn(
                'w-full flex items-center gap-5 text-brand-secondary-9 px-4 py-3 rounded-md text-xs transition-colors',
                isSelected
                    ? 'bg-brand-neutral-3 font-medium'
                    : 'hover:bg-brand-neutral-3'
            )}
        >
            <span className="font-medium">{category.label}</span>
            <span
                className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium min-w-9.5 text-center',
                    isSelected
                        ? 'bg-brand-accent-5 text-white'
                        : 'bg-brand-neutral-3 text-brand-neutral-7'
                )}
            >
                {category.count}
            </span>
        </button>
    )
}