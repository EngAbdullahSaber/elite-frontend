"use client";

export const durations = [
  { label: "المدة", value: 0 },
  { label: "30 دقيقة", value: 30 },
  { label: "ساعة واحدة", value: 60 },
  { label: "ساعتان", value: 120 },
  { label: "3 ساعات", value: 180 },
];

type Props = {
  timeValue?: string;
  durationValue?: number;
  onChangeTime: (time?: string) => void;
  onChangeDuration: (duration?: number) => void;
  label?: string;
};

export default function SelectTime({
  timeValue,
  durationValue,
  onChangeTime,
  onChangeDuration,
  label,
}: Props) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor="start-time" className="text-lg font-medium block mb-3">
          {label}
        </label>
      )}
      <div className="flex" dir="ltr">
        {/* Time Input */}
        <input
          type="time"
          id="start-time"
          name="start-time"
          value={timeValue}
          onChange={(e) => onChangeTime(e.target.value)}
          required
          className="w-1/2 rounded-none rounded-e-lg bg-gray-50 border text-gray-900 leading-none px-2"
        />

        {/* Duration Dropdown */}
        <select
          id="duration"
          name="duration"
          value={durationValue}
          onChange={(e) => {
            onChangeDuration(Number(e.target.value));
          }}
          className="w-1/2 border-e-0 shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200"
        >
          {durations.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
