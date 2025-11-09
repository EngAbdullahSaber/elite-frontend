'use client';

import { FileItem, processFiles } from '@/utils/upload';
import { Control, Controller } from 'react-hook-form';
import { BsCloudArrowUp } from 'react-icons/bs';
import FilePreviewItem from './FilePreviewItem';

type UploaderProps = {
    control: Control<any>;
    name: string; // 👈 field name
    allowMultiple?: boolean;
    allowPrimary?: boolean
    label?: string;
    accept?: string;
    rules?: string[]; // 👈 array of rules to display
    maxSizeMB?: number;
    maxFiles?: number;
};

export default function Uploader({
    control,
    name,
    allowMultiple = true,
    allowPrimary = true,
    label,
    accept = '*/*',
    rules = ['الحد الأقصى لحجم الملف 9MB', 'الحد الأقصى 10 ملفات'],
    maxSizeMB = 9,
    maxFiles = 10,
}: UploaderProps) {

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {
                const currentFiles: FileItem[] = allowMultiple
                    ? (field.value as FileItem[] || [])
                    : field.value
                        ? [field.value as FileItem]
                        : [];

                const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
                    if (!e.target.files) return;

                    const files = Array.from(e.target.files);

                    const updated = processFiles(
                        files,
                        accept,
                        allowMultiple,
                        allowPrimary,
                        field.value || [],
                        maxSizeMB,
                        maxFiles
                    );

                    field.onChange(allowMultiple ? updated : updated[0]);
                };


                const setPrimary = (url: string) => {
                    const updated = (field.value || []).map((f: FileItem) => ({
                        ...f,
                        isPrimary: f.url === url,
                    }));
                    field.onChange(updated);
                };

                const removeFile = (url: string) => {
                    const updated: FileItem[] = (field.value as FileItem[] || []).filter(
                        (f: FileItem) => f.url !== url
                    );

                    if (allowPrimary && !updated.some((f: FileItem) => f.isPrimary) && updated.length > 0) {
                        updated[0].isPrimary = true;
                    }

                    field.onChange(updated);
                };


                return (
                    <div className="col-span-12"
                        onDrop={(e) => {
                            e.preventDefault();
                            const files = Array.from(e.dataTransfer.files);
                            handleFiles({ target: { files } } as any); // 👈 reuse your handleFiles
                        }}
                        onDragOver={(e) => e.preventDefault()}>
                        {/* Label */}
                        {label && <label htmlFor={`${name}-dropzone`} className="text-xl font-medium block mb-3">
                            {label}
                        </label>}

                        {/* Dropzone */}
                        <div className="flex items-center justify-center border-dashed rounded-2xl w-full">
                            <label
                                htmlFor={`${name}-dropzone`}
                                className="flex flex-col items-center justify-center w-full cursor-pointer bg-[var(--bg-2)] rounded-2xl border border-dashed"
                            >
                                <span className="flex flex-col items-center justify-center py-12">
                                    <BsCloudArrowUp size={60} />
                                    <span className="h3 clr-neutral-500 text-center mt-4 mb-3">اسحب وأفلت</span>
                                    <span className="block text-center mb-6 clr-neutral-500">أو</span>
                                    <span className="inline-block py-3 px-6 rounded-full bg-[#354764] text-white mb-10">
                                        اختر ملفات
                                    </span>
                                    <span className="flex items-center justify-center flex-wrap gap-5 text-sm text-gray-500">
                                        {rules.map((rule, i) => (
                                            <span key={i}>{rule}</span>
                                        ))}
                                    </span>
                                </span>
                                <input
                                    id={`${name}-dropzone`}
                                    type="file"
                                    multiple={allowMultiple}
                                    accept={accept}
                                    className="hidden"
                                    onChange={handleFiles}
                                />
                            </label>
                        </div>

                        {currentFiles.length > 0 && (
                            <div className="grid grid-cols-1 xs:!grid-cols-2 md:!grid-cols-3 lg:!grid-cols-4 gap-4 mt-6">
                                {currentFiles.map((file: FileItem | string, idx: number) => (
                                    <FilePreviewItem
                                        key={idx}
                                        file={file}
                                        idx={idx}
                                        allowMultiple={allowMultiple}
                                        allowPrimary={allowPrimary}
                                        setPrimary={setPrimary}
                                        removeFile={removeFile}
                                    />
                                ))}
                            </div>
                        )}

                    </div>
                );
            }}
        />
    );
}
