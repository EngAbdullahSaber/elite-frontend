"use client";

import { useState } from "react";

type Props = {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => Promise<void> | void;
    onCancel?: () => void;
};

export default function ConfirmActionToggle({
    title,
    message,
    confirmLabel = "تأكيد",
    cancelLabel = "إلغاء",
    onConfirm,
    onCancel,
}: Props) {
    const [saving, setSaving] = useState(false);

    async function handleConfirm() {
        setSaving(true);
        try {
            await onConfirm();
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="p-4">
            <div className="rounded-lg bg-white mx-auto">
                <h3 className="text-lg font-bold text-gray-800 text-center mb-3">
                    {title}
                </h3>
                <p className="text-center text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={saving}
                        className="px-4 py-2 rounded-md text-white bg-[var(--primary)] hover:bg-[var(--primary-600)]"
                    >
                        {saving ? "جارٍ التنفيذ..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
