type Props = {
    errors: Record<string, any>;
    fieldName: string;

};

export default function FieldErrorMessage({ errors, fieldName }: Props) {
    const error = errors?.[fieldName];

    if (!error) return null;

    return (
        <p className="text-red-500 text-sm mt-2">
            {error.message}
        </p>
    );
}
