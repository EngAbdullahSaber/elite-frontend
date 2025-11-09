"use client";

import { Control, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { deleteItem } from "@/services/faqs/faqs"; // Changed from deleteFAQItem to deleteItem

interface EditFAQSectionProps {
  control: Control<any>;
  name: string;
  groupId?: number;
}

export default function EditFAQSection({
  control,
  name,
  groupId,
}: EditFAQSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const [deletingItems, setDeletingItems] = useState<number[]>([]);

  const handleRemoveItem = async (index: number, itemId?: number) => {
    if (itemId && typeof itemId === "number") {
      try {
        setDeletingItems((prev) => [...prev, itemId]);
        await deleteItem(itemId); // Using deleteItem instead of deleteFAQItem
        remove(index);
        toast.success("تم حذف السؤال بنجاح");
      } catch (error) {
        console.error("Error deleting FAQ item:", error);
        toast.error("فشل في حذف السؤال");
      } finally {
        setDeletingItems((prev) => prev.filter((id) => id !== itemId));
      }
    } else {
      remove(index);
    }
  };

  const handleAddItem = () => {
    append({ question: "", answer: "" });
  };

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div key={field.id} className="border rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold">سؤال {index + 1}</h4>
            <button
              type="button"
              onClick={() => handleRemoveItem(index, (field as any).id)}
              disabled={deletingItems.includes((field as any).id)}
              className="text-red-500 hover:text-red-700 disabled:opacity-50"
            >
              {deletingItems.includes((field as any).id)
                ? "جاري الحذف..."
                : "حذف"}
            </button>
          </div>

          <div className="space-y-3">
            <input
              {...control.register(`${name}.${index}.question`)}
              placeholder="السؤال"
              className="w-full p-2 border rounded"
            />
            <textarea
              {...control.register(`${name}.${index}.answer`)}
              placeholder="الإجابة"
              className="w-full p-2 border rounded h-24"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddItem}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
      >
        + إضافة سؤال جديد
      </button>
    </div>
  );
}
