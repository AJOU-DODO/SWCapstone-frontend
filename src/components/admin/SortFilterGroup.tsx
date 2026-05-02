import { Button } from "@/components/ui/button"
import Link from "next/link";

interface Option {
  label: string;
  value: string;
}

interface SortFilterGroupProps {
  options: Option[];
  currentValue: string;
  onChange: (value: string) => void;
}

export default function SortFilterGroup({ options, currentValue, onChange }: SortFilterGroupProps) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <Button
          key={opt.value}
          variant={currentValue === opt.value ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(opt.value)}
        >
          <Link href={`/admin/users?sort=${opt.value}`}>
            {opt.label}
          </Link>
        </Button>
      ))}
    </div>
  );
}