'use client';

import { Control, Controller } from 'react-hook-form';
import Card from '@/components/shared/Card';
import { PropertyFormValues } from '../PropertyForm';
import Uploader from '../../../shared/Forms/Uploader';

export default function MediaLocationSection({ control }: { control: Control<PropertyFormValues> }) {

  return (
    <Card title="الصور والفيديو والموقع">
      <div className="grid grid-cols-12 gap-6">
        {/* رفع الصور */}
        <Uploader control={control} name="images" accept="image/*" label='صور العقار' />
        {/* رابط الفيديو */}
        <Controller
          name="video"
          control={control}
          render={({ field }) => (
            <div className="col-span-12">
              <label className="block text-xl font-medium mb-3">رابط الفيديو</label>
              <input
                type="text"
                placeholder="أدخل رابط الفيديو"
                {...field}
                className="w-full border p-2 rounded-md"
              />
            </div>
          )}
        />

        {/* العنوان */}
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <div className="col-span-12">
              <label className="block text-xl font-medium mb-3">العنوان</label>
              <input
                type="text"
                placeholder="أدخل العنوان"
                {...field}
                className="w-full border p-2 rounded-md"
              />
            </div>
          )}
        />

      </div>
    </Card>
  );
}
