'use client';

import { Controller, useForm } from 'react-hook-form';
import Card from '@/components/shared/Card';
import SelectInput from '@/components/shared/Forms/SelectInput';
import Uploader from '@/components/shared/Forms/Uploader';
import PrimaryButton from '@/components/shared/Button';
import SoftActionButton from '@/components/shared/SoftActionButton';
import { mockedUnSavedCities } from '@/constants/dashboard/admin/city/contants';
import FavoritePropertiesChooser from '@/components/dashboard/Property Filter/FavoritePropertiesChooser';
import { properties } from '@/constants/projects';
import { FileItem } from '@/utils/upload';

type BecomeAgentFormValues = {
    cityId: string;
    identity_proof: FileItem[];
    license_document: FileItem[];
    favorite_properties: number[]
};

export default function BecomeAgentForm() {
    const { handleSubmit, setValue, watch, control } = useForm<BecomeAgentFormValues>({
        defaultValues: {
            cityId: "",
            identity_proof: [],
            license_document: [],
            favorite_properties: [],
        },
    });

    const cityId = watch("cityId");
    const idProof = watch("identity_proof");
    const license = watch("license_document");

    const onSubmit = (data: BecomeAgentFormValues) => {
        if (!data.cityId) {
            alert("الرجاء اختيار المدينة");
            return;
        }
        if (!data.identity_proof?.length) {
            alert("الرجاء رفع وثيقة الهوية");
            return;
        }
        if (!data.license_document?.length) {
            alert("الرجاء رفع الرخصة");
            return;
        }

        console.log("Submitting Become Agent request", data);
        alert("تم إرسال الطلب بنجاح");
    };

    const cityOptions = [
        { label: "اختر المدينة", value: "" },
        ...mockedUnSavedCities?.map((c) => ({ label: c.name, value: String(c.id) })),
    ];

    // Assume you load these from user session/profile
    const userData = {
        fullName: "أحمد محمد",
        email: "ahmed@example.com",
        phone: "0551234567",
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card title="طلب الانضمام كوسيط">
                <div className="grid grid-cols-12 gap-4">
                    {/* الاسم الكامل */}
                    <div className="col-span-12 md:col-span-6">
                        <label className="text-xl font-medium block mb-3">الاسم الكامل</label>
                        <input
                            className="w-full border rounded-full bg-[var(--bg-2)] px-4 py-3 focus:outline-none"
                            value={userData.fullName}
                            disabled
                            readOnly
                        />
                    </div>

                    {/* البريد الإلكتروني */}
                    <div className="col-span-12 md:col-span-6">
                        <label className="text-xl font-medium block mb-3">البريد الإلكتروني</label>
                        <input
                            type="email"
                            className="w-full border rounded-full bg-[var(--bg-2)] px-4 py-3 focus:outline-none"
                            value={userData.email}
                            disabled
                            readOnly
                        />
                    </div>

                    {/* رقم الجوال */}
                    <div className="col-span-12 md:col-span-6">
                        <label className="text-xl font-medium block mb-3">رقم الجوال</label>
                        <input
                            className="w-full border rounded-full bg-[var(--bg-2)] px-4 py-3 focus:outline-none ltr-data"
                            value={userData.phone}
                            disabled
                            readOnly
                        />
                    </div>

                    {/* المدينة */}
                    <SelectInput
                        label="المدينة"
                        name="cityId"
                        options={cityOptions}
                        value={cityId}
                        onChange={(val) => setValue("cityId", val)}
                        className="col-span-12 md:col-span-6"
                    />
                </div>
            </Card>

            <Card title="وثائق التحقق">
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12">
                        <Uploader
                            control={control}
                            name="identity_proof"
                            maxFiles={2}
                            allowPrimary={false}
                            accept="image/*,application/pdf"
                            label="إثبات الهوية"
                            rules={[
                                "الحد الأقصى لحجم الملف 5MB",
                                "الحد الأقصى 2 ملفات",
                                "يجب أن يكون الملف صورة أو PDF",
                            ]}
                        />
                    </div>

                    <div className="col-span-12">
                        <Uploader
                            control={control}
                            name="license_document"
                            maxFiles={2}
                            allowPrimary={false}
                            accept="image/*,application/pdf"
                            label="الرخصة"
                            rules={[
                                "الحد الأقصى لحجم الملف 5MB",
                                "الحد الأقصى 2 ملفات",
                                "يجب أن يكون الملف صورة أو PDF",
                            ]}
                        />
                    </div>
                </div>
            </Card>

            <Card title="العقارات المفضلة">
                <Controller
                    name="favorite_properties"
                    control={control}
                    rules={{ validate: (val) => val.length > 0 || "الرجاء اختيار عقار واحد على الأقل" }}
                    render={({ field, fieldState }) => (
                        <>
                            <FavoritePropertiesChooser
                                properties={properties}
                                label="عقار"
                                max={5}
                                onChange={(newList) => field.onChange(newList)}
                            />
                            {fieldState.error && (
                                <p className="text-red-500 text-sm mt-2">{fieldState.error.message}</p>
                            )}
                        </>
                    )}
                />
            </Card>



            <div className='space-x-4 flex items-center justify-start'>
                <PrimaryButton type="submit">إرسال الطلب</PrimaryButton>
                <SoftActionButton type="button" onClick={() => { }}>إلغاء</SoftActionButton>
            </div>
        </form>
    )
}