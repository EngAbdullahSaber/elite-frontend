import { useFieldArray, Control } from "react-hook-form";
import TextInput from "@/components/shared/Forms/TextInput";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";
import ImageUpload from "@/components/shared/Forms/ImageUpload";
import { AboutContentForm } from "./AboutForm";
import SubTitle from "@/components/shared/SubTitle";
import FallbackImage from "@/components/shared/FallbackImage";

type EditTeamSectionProps = {
    control: Control<AboutContentForm>;
};

export default function EditTeamSection({ control }: EditTeamSectionProps) {
    const { fields, append, remove, update } = useFieldArray({
        control,
        name: "team",
    });

    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [draft, setDraft] = useState({ imageUrl: "", name: "", job: "" });

    const handleSave = () => {
        if (!draft.name || !draft.job) return;
        if (editIndex !== null) {
            update(editIndex, draft);
            setEditIndex(null);
        } else {
            append(draft);
        }
        setDraft({ imageUrl: "", name: "", job: "" });
    };

    function handleOnRemove(index: number) {

        remove(index)
        if (index == editIndex) {

            setEditIndex(null)
            // clear draft
            setDraft({ imageUrl: "", name: "", job: "" })
        }
    }

    return (
        <div className="space-y-4">
            <SubTitle>أضف عضو</SubTitle>
            {/* Draft inputs */}
            <ImageUpload
                imageUrl={draft.imageUrl}
                onChange={(e) => {
                    console.log(e.target.files)
                    if (e.target.files?.[0]) {
                        setDraft({
                            ...draft,
                            imageUrl: URL.createObjectURL(e.target.files[0]),
                        });
                    }
                }}
            />
            <TextInput
                id="team-name"
                name="team-name"
                placeholder="أدخل الاسم"
                label="الاسم"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
            <TextInput
                id="team-job"
                name="team-job"
                label="الوظيفة"
                placeholder="أدخل الوظيفة"
                value={draft.job}
                onChange={(e) => setDraft({ ...draft, job: e.target.value })}
            />
            <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 rounded-md bg-[var(--primary)] text-white"
            >
                {editIndex !== null ? "تحديث العضو" : "إضافة عضو"}
            </button>

            {/* List */}
            <div className="grid gap-3 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4">
                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="border p-4 rounded-md flex flex-col items-center text-center"
                    >
                        <FallbackImage
                            src={field.imageUrl}
                            alt={field.name || "عضو الفريق"}
                            className="w-20 h-20 rounded-full object-cover mb-3"
                            width={80}
                            height={80}
                        />
                        <p className="font-semibold">{field.name || "اسم العضو"}</p>
                        <p className="text-sm text-gray-500 mb-3">{field.job || "المسمى الوظيفي"}</p>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setDraft(field);
                                    setEditIndex(index);
                                }}
                                className="text-gray-500 hover:text-[var(--primary)]"
                                aria-label="تعديل"
                            >
                                <FaEdit />
                            </button>
                            <button
                                type="button"
                                onClick={() => handleOnRemove(index)}
                                className="text-gray-500 hover:text-red-500"
                                aria-label="حذف"
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
