"use client";

import Card from "@/components/shared/Card";
import TextInput from "@/components/shared/Forms/TextInput";
import { Control, Controller } from "react-hook-form";
import { PropertyFormValues } from "../PropertyForm";

export default function OwnerContactSection({
  control,
}: {
  control: Control<PropertyFormValues>;
}) {
  return (
    <Card title="بيانات المالك">
      <div className="grid grid-cols-12 gap-6">
        {/* اسم المالك */}
        <Controller
          name="ownerName"
          control={control}
          render={({ field }) => (
            <TextInput
              id="ownerName"
              label="اسم المالك"
              placeholder="أدخل اسم المالك"
              {...field}
            />
          )}
        />

        {/* رقم الهاتف */}
        <Controller
          name="ownerPhone"
          control={control}
          render={({ field }) => (
            <TextInput
              id="ownerPhone"
              label="رقم الهاتف"
              type="tel"
              placeholder="أدخل رقم الهاتف"
              className="ltr-data"
              {...field}
            />
          )}
        />
      </div>
    </Card>
  );
}
