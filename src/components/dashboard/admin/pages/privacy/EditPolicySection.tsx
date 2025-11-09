import { Control, Controller, useFieldArray } from "react-hook-form";
import Card from "@/components/shared/Card";
import TextInput from "@/components/shared/Forms/TextInput";
import EditPolicyItemsSection from "./EditPolicyItemsSection";

type EditPolicySectionProps = {
    control: Control<any>;
    name: string; // e.g. "privacyGroups.0.policies"
};

export default function EditPolicySection({ control, name }: EditPolicySectionProps) {
    const { fields, append, remove } = useFieldArray({ control: control as Control<any>, name: name as any });

    return (
        <div className="space-y-4">
            {fields.map((f, idx) => (
                <Card key={(f as any).id ?? idx} title={`سياسة #${idx + 1}`} collapsible>
                    <Controller
                        control={control}
                        name={`${name}.${idx}.title` as any}
                        render={({ field }) => (
                            <TextInput id={`policy-title-${idx}`} label="العنوان" placeholder="عنوان السياسة" {...field} />
                        )}
                    />

                    <EditPolicyItemsSection control={control} name={`${name}.${idx}.items`} />

                    <div className="mt-3">
                        <button type="button" className="text-red-600 hover:underline" onClick={() => remove(idx)}>حذف هذه السياسة</button>
                    </div>
                </Card>
            ))}

            <button type="button" className="px-4 py-2 rounded-md bg-[var(--primary)] text-white" onClick={() => append({ title: "سياسة جديدة", items: [] } as any)}>
                إضافة سياسة جديدة
            </button>
        </div>
    );
}


