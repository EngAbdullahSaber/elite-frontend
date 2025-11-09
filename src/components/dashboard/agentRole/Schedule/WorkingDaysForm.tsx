"use client";

import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEndTimeAfterStart } from "@/utils/date";
import TimeOnlyInput from "@/components/shared/Forms/TimeOnlyInput";
import PrimaryButton from "@/components/shared/Button";
import SoftActionButton from "@/components/shared/SoftActionButton";


type DayKey = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

const arabicDayLabels: Record<DayKey, string> = {
    sun: "الأحد",
    mon: "الإثنين",
    tue: "الثلاثاء",
    wed: "الأربعاء",
    thu: "الخميس",
    fri: "الجمعة",
    sat: "السبت",
};

// Zod schema
const schema = z
    .object({
        workingDays: z.record(z.string(), z.boolean()),
        startTime: z.string().nonempty("الوقت الابتدائي مطلوب"),
        endTime: z.string().nonempty("وقت الانتهاء مطلوب"),
    })
    .refine(
        (data) => Object.values(data.workingDays).some(Boolean),
        { path: ["workingDays"], message: "يجب اختيار يوم عمل واحد على الأقل" }
    )
    .refine(
        (data) => isEndTimeAfterStart(data.startTime, data.endTime),
        { path: ["endTime"], message: "يجب أن يكون وقت الانتهاء بعد وقت البدء" }
    );

type FormValues = z.infer<typeof schema>;

export default function WorkingDaysForm() {
    const [saving, setSaving] = useState(false);
    const [savedAt, setSavedAt] = useState<number | null>(null);

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            workingDays: {
                sun: true,
                mon: true,
                tue: true,
                wed: true,
                thu: true,
                fri: true,
                sat: true,
            },
            startTime: "08:00",
            endTime: "16:00",
        },
    });

    const workingDays = watch("workingDays");

    const allSelected = useMemo(
        () => Object.values(workingDays).every(Boolean),
        [workingDays.sun, workingDays.mon, workingDays.tue, workingDays.wed, workingDays.thu, workingDays.fri, workingDays.sat]
    );

    function toggleAllDays(selectAll: boolean) {
        (Object.keys(workingDays) as DayKey[]).forEach((day) =>
            setValue(`workingDays.${day}`, selectAll)
        );
    }

    async function onSubmit(data: FormValues) {
        try {
            setSaving(true);
            await new Promise((resolve) => setTimeout(resolve, 600));
            setSavedAt(Date.now());
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Days Section */}
            <section className="p-3 md:py-6 lg:py-8 md:px-8 lg:px-10 border rounded-2xl bg-white relative z-[1]">
                <div className="space-y-6">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <h3 className="text-lg md:text-xl font-semibold text-[var(--dark)]">
                            تحديد أيام العمل
                        </h3>
                        <button
                            type="button"
                            onClick={() => toggleAllDays(!allSelected)}
                            className="px-3 py-2 rounded-lg text-sm font-medium border hover:bg-[var(--bg-1)]"
                        >
                            {allSelected ? "إلغاء تحديد الكل" : "تحديد كل الأيام"}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {(Object.keys(arabicDayLabels) as DayKey[]).map((day) => (
                            <Controller
                                key={day}
                                name={`workingDays.${day}`}
                                control={control}
                                render={({ field }) => (
                                    <label
                                        className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer select-none ${field.value
                                            ? "bg-[var(--bg-1)] border-[var(--primary-200)]"
                                            : "bg-white"
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            className="accent-[var(--primary)] w-4 h-4"
                                            checked={field.value}
                                            onChange={(e) => field.onChange(e.target.checked)}
                                        />
                                        <span className="text-sm md:text-base">
                                            {arabicDayLabels[day]}
                                        </span>
                                    </label>
                                )}
                            />
                        ))}
                    </div>
                    {errors.workingDays && (
                        <p className="text-red-500 text-sm"> {String(errors.workingDays.message)}</p>
                    )}
                </div>
            </section>

            {/* Time Section */}
            <section className="p-3 md:py-6 lg:py-8 md:px-8 lg:px-10 border rounded-2xl bg-white relative z-[1]">
                <div className="space-y-5">
                    <h3 className="text-lg md:text-xl font-semibold text-[var(--dark)]">
                        ساعات العمل
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" dir="ltr">
                        <Controller
                            name="startTime"
                            control={control}
                            render={({ field }) => (
                                <TimeOnlyInput
                                    id="start-time"
                                    label="وقت البدء"
                                    error={errors.startTime?.message}
                                    {...field}
                                />
                            )}
                        />

                        <Controller
                            name="endTime"
                            control={control}
                            render={({ field }) => (
                                <TimeOnlyInput
                                    id="end-time"
                                    label="وقت الانتهاء"
                                    error={errors.endTime?.message}
                                    {...field}
                                />
                            )}
                        />
                    </div>


                    <div className="col-span-12 flex items-center gap-6 flex-wrap mt-4">
                        <PrimaryButton type="submit">
                            {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
                        </PrimaryButton>
                        <SoftActionButton onClick={() => { }}>إلغاء</SoftActionButton>
                    </div>

                </div>
            </section>
        </form>
    );
}
