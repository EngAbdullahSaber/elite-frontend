export function NumberInput({
    label,
    value,
    onChange,
    placeholder,
}: {
    label: string;
    value: number;
    onChange: (val: number) => void;
    placeholder?: string;
}) {
    return (
        <div className="mt-6">
            <p className="mb-2 text-xl font-medium">{label}</p>
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                placeholder={placeholder}
                className="w-full border p-2 focus:outline-none rounded-md text-base"
            />
        </div>
    );
}
