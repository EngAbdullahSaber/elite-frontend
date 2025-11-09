import { Control, useFieldArray, useWatch } from "react-hook-form";
import TextInput from "@/components/shared/Forms/TextInput";
import { useState } from "react";
import SubTitle from "@/components/shared/SubTitle";
import { FaEdit, FaTrash } from "react-icons/fa";

type EditPolicyItemsSectionProps = {
    control: Control<any>;
    name: string; // field array path, e.g. "privacyGroups.0.policies.0.items"
};

export default function EditPolicyItemsSection({ control, name }: EditPolicyItemsSectionProps) {
    const { fields, append, remove, update } = useFieldArray({ control: control as Control<any>, name: name as any });
    const watchedItems = (useWatch({ control, name }) as string[]) ?? [];
    const [draft, setDraft] = useState<string>("");
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const saveItem = () => {
        const value = draft.trim();
        if (!value) return;
        if (editIndex !== null) {
            update(editIndex, value as any);
            setEditIndex(null);
        } else {
            append(value as any);
        }
        setDraft("");
    };

    return (
        <div className="space-y-3">
            <SubTitle>عناصر السياسة</SubTitle>
            <div className="flex gap-3 items-end">
                <div className="flex-1">
                    <TextInput id="policy-item" name="policy-item" label="نص العنصر" placeholder="أدخل النص" value={draft} onChange={(e) => setDraft(e.target.value)} />
                </div>
                <button type="button" onClick={saveItem} className="mb-2 px-4 py-2 rounded-md bg-[var(--primary)] text-white hover:bg-[var(--primary-600)] min-w-[140px]">
                    {editIndex !== null ? "تحديث العنصر" : "إضافة العنصر"}
                </button>
            </div>

            <div className="space-y-2">
                {fields.map((f, idx) => {
                    const text = watchedItems[idx] ?? "";
                    return (
                        <div key={f.id} className="flex items-center justify-between rounded-md border p-3">
                            <p className="text-sm text-neutral-700 flex-1 pe-4 break-words">{text}</p>
                            <div className="flex gap-2">
                                <button type="button" className="text-gray-500 hover:text-[var(--primary)]" onClick={() => { setDraft(text); setEditIndex(idx); }}><FaEdit className="w-4 h-4" /></button>
                                <button type="button" className="text-gray-500 hover:text-red-500" onClick={() => remove(idx)}><FaTrash className="w-4 h-4" /></button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}


