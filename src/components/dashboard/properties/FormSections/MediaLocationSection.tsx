"use client";

import { Control, Controller } from "react-hook-form";
import Card from "@/components/shared/Card";
import { PropertyFormValues } from "../PropertyForm";
import Uploader from "../../../shared/Forms/Uploader";

export default function MediaLocationSection({
  control,
}: {
  control: Control<PropertyFormValues>;
}) {
  return (
    <Card title="الصور والفيديو والموقع">
      <div className="grid grid-cols-12 gap-6">
        {/* رفع الصور */}
        <Uploader
          control={control}
          name="images"
          accept="image/*"
          label="صور العقار"
        />
      </div>
    </Card>
  );
}
