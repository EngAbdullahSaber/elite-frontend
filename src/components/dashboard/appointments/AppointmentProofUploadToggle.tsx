"use client";

import { useState } from "react";
import Uploader from "@/components/shared/Forms/Uploader";
import { Control, useForm } from "react-hook-form";

type Props = {
    appointmentId: number;
    onConfirm: (files: any[]) => void;
    onCancel?: () => void;
};

type FormValues = { proofFiles: any[] };

export default function AppointmentProofUploadToggle({ appointmentId, onConfirm, onCancel }: Props) {
    const { control, handleSubmit } = useForm<FormValues>({ defaultValues: { proofFiles: [] } });
    const [saving, setSaving] = useState(false);

    const submit = handleSubmit(async (values) => {
        setSaving(true);
        try {
            // TODO: call API to upload and persist proofs
            await new Promise((r) => setTimeout(r, 300));
            onConfirm(values.proofFiles || []);
        } finally {
            setSaving(false);
        }
    });

    return (
        <div className="p-2">
            <div className="rounded-lg bg-white mx-auto">
                <h3 className="text-lg font-bold text-gray-800 text-center mb-3">إرفاق مستندات الدفع</h3>
                <div className="w-full xs:w-[300px] md:w-[400px] lg:w-[700px] max-h-[500px] lg:!max-h-[600px]  overflow-y-auto">
                    <Uploader control={control as unknown as Control<any>} name="proofFiles" allowPrimary={false} accept="image/*,application/pdf" maxFiles={6} />
                </div>
                <div className="flex justify-end gap-3 pt-6">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                        إلغاء
                    </button>
                    <button
                        type="button" onClick={submit}
                        disabled={saving}
                        className="px-4 py-2 rounded-md text-white bg-[var(--primary)] hover:bg-[var(--primary-600)]"
                    >
                        {saving ? 'جارٍ الحفظ...' : 'حفظ'}
                    </button>
                </div>
            </div>
        </div>
    );
}


