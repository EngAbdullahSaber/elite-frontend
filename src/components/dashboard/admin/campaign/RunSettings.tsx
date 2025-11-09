'use client';
import Card from '@/components/shared/Card';
import { RadioGroup } from '@/components/shared/Forms/RadioGroup';
import SelectInput from '@/components/shared/Forms/SelectInput';
import SelectSingleDate from '@/components/shared/Forms/SelectSingleDate';
import TimeOnlyInput from '@/components/shared/Forms/TimeOnlyInput';
import { CampaignFormData } from '@/types/campaign';
import { Controller, UseFormSetValue } from 'react-hook-form';
import { DraftCheckbox } from './DraftCheckbox';

interface RunSettingsProps {
    control: any;
    watch: (field: keyof CampaignFormData) => any;
    setValue: UseFormSetValue<CampaignFormData>;
    errors: Partial<Record<keyof CampaignFormData, { message?: string }>>;
}


export default function RunSettings({ control, watch, setValue, errors }: RunSettingsProps) {
    const runType = watch('runType');

    return (
        <Card title="إعدادات التشغيل">
            <div className="space-y-4">
                <DraftCheckbox
                    name="isDraft"
                    checked={watch('isDraft')}
                    onChange={(val) => setValue('isDraft', val)}
                />

                <Controller
                    control={control}
                    name="runType"
                    render={({ field }) => (
                        <RadioGroup
                            {...field}
                            options={[
                                { label: 'تشغيل مرة واحدة', value: 'once' },
                                { label: 'تشغيل متكرر', value: 'recurring' },
                            ]}
                        />
                    )}
                />
                {errors.runType && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.runType.message}</p>
                )}

                {runType === 'once' && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <Controller
                                control={control}
                                name="runOnceDateTime"
                                render={({ field }) => (
                                    <div>
                                        <label className="text-base font-medium block mb-2 text-[var(--dark)]">
                                            تاريخ التشغيل
                                        </label>
                                        <SelectSingleDate
                                            minDate={new Date()}
                                            label="تاريخ التشغيل"
                                            value={field.value ? new Date(field.value) : undefined}
                                            onChange={(date) => field.onChange(date ? date.toISOString() : '')}
                                            className="!w-full"
                                        />
                                    </div>
                                )}
                            />
                            <TimeOnlyInput
                                id="runOnceDateTime"
                                name="runOnceDateTime"
                                label="وقت التشغيل"
                                value={watch('runOnceDateTime')?.split('T')[1]?.substring(0, 5)}
                                onChange={(e) => {
                                    const time = e.target.value;
                                    const currentDate = watch('runOnceDateTime');
                                    if (currentDate && time) {
                                        const date = new Date(currentDate);
                                        const [hours, minutes] = time.split(':');
                                        date.setHours(parseInt(hours), parseInt(minutes));
                                        setValue('runOnceDateTime', date.toISOString());
                                    }
                                }}
                                className="!bg-bg-1 !rounded-full !py-[10px] !px-8"
                            />
                        </div>
                        {errors.runOnceDateTime && (
                            <p className="mt-2 text-sm text-red-600 font-medium">{errors.runOnceDateTime.message}</p>
                        )}
                    </div>
                )}

                {runType === 'recurring' && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-800">تشغيل متكرر</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Controller
                                control={control}
                                name="startDate"
                                render={({ field }) => (
                                    <SelectSingleDate
                                        minDate={new Date()}
                                        label="تاريخ البداية"
                                        value={field.value ? new Date(field.value) : undefined}
                                        onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                                        className="!w-full"
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name="endDate"
                                render={({ field }) => (
                                    <SelectSingleDate
                                        minDate={new Date()}
                                        label="تاريخ النهاية"
                                        value={field.value ? new Date(field.value) : undefined}
                                        onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                                        className="!w-full"
                                    />
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Controller
                                control={control}
                                name="runFrequency"
                                render={({ field }) => (
                                    <SelectInput
                                        label="تكرار التشغيل"
                                        {...field}
                                        options={[
                                            { label: 'يوميًا', value: 'daily' },
                                            { label: 'كل يومين', value: 'every_2_days' },
                                            { label: 'أسبوعيًا', value: 'weekly' },
                                            { label: 'كل أسبوعين', value: 'every_2_weeks' },
                                            { label: 'شهريًا', value: 'monthly' },
                                        ]}

                                        error={errors.runFrequency?.message}
                                    />
                                )}
                            />
                            <div className='col-span-12'>
                                <TimeOnlyInput
                                    id="runTime"
                                    name="runTime"
                                    label="وقت التشغيل"
                                    value={watch('runTime')}
                                    onChange={(e) => setValue('runTime', e.target.value)}
                                    className="!bg-bg-1 !rounded-full !py-[10px] !px-8"
                                />
                            </div>
                        </div>
                        {errors.startDate && (
                            <p className="mt-2 text-sm text-red-600 font-medium">{errors.startDate.message}</p>
                        )}
                    </div>
                )}


            </div>
        </Card>
    );
}
