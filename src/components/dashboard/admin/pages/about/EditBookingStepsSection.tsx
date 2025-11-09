import { useFieldArray, Control } from "react-hook-form";
import TextInput from "@/components/shared/Forms/TextInput";
import TextareaInput from "@/components/shared/Forms/TextareaInput";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";
import { AboutContentForm } from "./AboutForm";

type EditBookingStepsProps = {
    control: Control<AboutContentForm>;
};

export default function EditBookingStepsSection({ control }: EditBookingStepsProps) {
    const { fields, append, remove, update } = useFieldArray({
        control,
        name: "bookingSteps",
    });

    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [draft, setDraft] = useState({ title: "", description: "" });

    const handleSave = () => {
        if (!draft.title || !draft.description) return;
        if (editIndex !== null) {
            update(editIndex, draft);
            setEditIndex(null);
        } else {
            append(draft);
        }
        setDraft({ title: "", description: "" });
    };

    return (
        <div className="space-y-4">
            <TextInput
                id="booking-dynamic-step-title"
                name="step-title"
                label="عنوان الخطوة"
                placeholder="أدخل عنوان الخطوة"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
            <TextareaInput
                id="booking-dynamic-step-description"
                name="step-desc"
                label="وصف الخطوة"
                placeholder="أدخل وصف الخطوة"
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
            <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 rounded-md bg-[var(--primary)] text-white"
            >
                {editIndex !== null ? "تحديث الخطوة" : "إضافة خطوة"}
            </button>

            <div className="space-y-3">
                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="border p-3 rounded-md flex justify-between items-start"
                    >
                        <div>
                            <p className="font-semibold">{field.title}</p>
                            <p className="text-sm text-gray-600">{field.description}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setDraft(field);
                                    setEditIndex(index);
                                }}
                                className="text-gray-500 hover:text-[var(--primary)]"
                            >
                                <FaEdit />
                            </button>
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-gray-500 hover:text-red-500"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
