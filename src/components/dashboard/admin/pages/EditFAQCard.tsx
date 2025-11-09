import { FaEdit, FaTrash } from "react-icons/fa";

type FAQCardProps = {
    question: string;
    answer: string;
    isEdited: boolean;
    onEdit: () => void;
    onRemove: () => void;
};

export default function EditFAQCard({ question, answer, onEdit, onRemove, isEdited }: FAQCardProps) {
    return (
        <div className={`bg-white border rounded-xl p-4 shadow-sm flex flex-col gap-2 relative ${isEdited && "border-primary"}`}>
            <div className="flex justify-between items-start">
                <h4 className="font-semibold text-[var(--dark)]">{question}</h4>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onEdit}
                        className="text-gray-500 hover:text-[var(--primary)]"
                        title="تعديل"
                    >
                        <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={onRemove}
                        className="text-gray-500 hover:text-red-500"
                        title="حذف"
                    >
                        <FaTrash className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <p className="text-sm text-gray-600">{answer}</p>
        </div>
    );
}
