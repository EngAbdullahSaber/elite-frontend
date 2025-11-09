import { Control, Controller } from "react-hook-form";
import Card from "@/components/shared/Card";
import TextInput from "@/components/shared/Forms/TextInput";
import SelectDropdown from "@/components/shared/Forms/SelectDropdown";
import { PropertyRequestFormValues } from "./PropertyRequestForm";

export default function RequesterInfoSection({
  control,
}: {
  control: Control<PropertyRequestFormValues>;
}) {
  return (
    <Card title="معلومات مقدم الطلب">
      <div className="grid grid-cols-12 gap-6">
        {/* الاسم */}
        <Controller
          name="requesterName"
          control={control}
          render={({ field }) => (
            <TextInput
              id="requesterName"
              label="اسم مقدم الطلب"
              placeholder="اكتب اسمك"
              {...field}
            />
          )}
        />

        {/* نوع العلاقة */}
        <Controller
          name="relationshipType"
          control={control}
          render={({ field }) => (
            <div className="col-span-12">
              <label className="text-xl font-medium block mb-3">
                نوع العلاقة
              </label>
              <SelectDropdown
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "owner", label: "مالك" },
                  { value: "authorized_representative", label: "ممثل مفوض" },
                ]}
              />
            </div>
          )}
        />
      </div>
    </Card>
  );
}
