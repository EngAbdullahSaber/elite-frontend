"use client";

import { useState } from "react";
import Card from "@/components/shared/Card";
import TextareaInput from "@/components/shared/Forms/TextareaInput";

export default function AppointmentNotesCard({
  initailNotes,
}: {
  initailNotes: string;
}) {
  const [notes, setNotes] = useState(initailNotes);

  const handleSave = () => {
    // هنا يمكنك إرسال الملاحظات إلى API أو تنفيذ منطق الحفظ
  };

  return (
    <Card
      className="flex-1 w-full max-h-[500px] flex flex-col space-y-2"
      title="الملاحظات"
    >
      {/* منطقة النص */}
      <div className="flex-1">
        <TextareaInput
          name="appointmentNotes"
          id="appointmentNotes"
          placeholder="أدخل ملاحظات حول الموعد..."
          className="text-area h-full"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* زر الحفظ في الأسفل */}
      <div className="pt-2">
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-md text-white bg-[var(--primary)] hover:bg-[var(--primary-600)] w-full"
        >
          {initailNotes ? "تغيير الملاحظات" : "اضف ملاحظاتك"}
        </button>
      </div>
    </Card>
  );
}
