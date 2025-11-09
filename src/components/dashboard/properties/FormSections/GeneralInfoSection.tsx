'use client';

import { Control, Controller } from 'react-hook-form';
import { PropertyFormValues } from '../PropertyForm';
import Card from '@/components/shared/Card';
import TextInput from '@/components/shared/Forms/TextInput';
import SelectDropdown from '@/components/shared/Forms/SelectDropdown';
import { accessTypeLabels, propertyTypeLabels } from '@/types/property';
import TextareaInput from '@/components/shared/Forms/TextareaInput';
import PriceInput from '@/components/shared/Forms/PriceInput';

export default function GeneralInfoSection({ control }: { control: Control<PropertyFormValues> }) {
    return (
        <Card title="المعلومات العامة">
            <div className="grid grid-cols-12 gap-6">
                {/* العنوان */}
                <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                        <TextInput
                            id="title"
                            label="اسم العقار"
                            placeholder="اكتب اسم العقار"
                            {...field}
                        />
                    )}
                />

                {/* نوع العقار */}
                <Controller
                    name="propertyType"
                    control={control}
                    render={({ field }) => (
                        <div className='col-span-12'>
                            <label htmlFor='propertyType' className="text-xl font-medium block mb-3">
                                نوع العقار
                            </label>
                            <SelectDropdown
                                value={field.value}
                                onChange={field.onChange}
                                options={Object.entries(propertyTypeLabels).map(([value, label]) => ({
                                    value,
                                    label,
                                }))}
                            />
                        </div>
                    )}
                />

                {/* نوع الوصول */}
                <Controller
                    name="accessType"
                    control={control}
                    defaultValue="mediated" // القيمة الافتراضية
                    render={({ field }) => (
                        <div className="col-span-12">
                            <label htmlFor="accessType" className="text-xl font-medium block mb-3">
                                نوع الوصول
                            </label>
                            <SelectDropdown
                                value={field.value}
                                onChange={field.onChange}
                                options={Object.entries(accessTypeLabels).map(([value, label]) => ({
                                    value,
                                    label,
                                }))}
                            />
                        </div>
                    )}
                />

                <PriceInput<PropertyFormValues> control={control} name="price" />
                {/* عدد الغرف */}
                <Controller
                    name="rooms"
                    control={control}
                    render={({ field }) => (
                        <TextInput

                            id="rooms"
                            label="عدد الغرف"
                            type="number"
                            placeholder="أدخل عدد الغرف"
                            {...field}
                        />
                    )}
                />

                {/* عدد الحمامات */}
                <Controller
                    name="bathrooms"
                    control={control}
                    render={({ field }) => (
                        <TextInput

                            id="bathrooms"
                            label="عدد الحمامات"
                            type="number"
                            placeholder="أدخل عدد الحمامات"
                            {...field}
                        />
                    )}
                />

                {/* المساحة بالمتر المربع */}
                <Controller
                    name="area"
                    control={control}
                    render={({ field }) => (
                        <TextInput

                            id="area"
                            label="المساحة (م²)"
                            type="number"
                            placeholder="أدخل المساحة بالمتر المربع"
                            {...field}
                        />
                    )}
                />

                {/* الوصف */}
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <TextareaInput
                            id="description"
                            label="الوصف"
                            placeholder="اكتب وصف العقار..."
                            {...field}
                        />
                    )}
                />
            </div>
        </Card>
    );
}