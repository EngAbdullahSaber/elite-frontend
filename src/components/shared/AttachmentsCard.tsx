"use client";

import { FileItem } from "@/utils/upload";
import Card from "./Card";
import FilePreviewItem from "./Forms/FilePreviewItem";

type AttachmentsCardProps = {
  title: string;
  attachments: FileItem[];
  children?: React.ReactNode;
};

export default function AttachmentsCard({
  title,
  attachments,
  children,
}: AttachmentsCardProps) {
  return (
    <Card title={title}>
      {Array.isArray(attachments) && attachments.length > 0 ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
          {attachments.map((file, idx) => (
            <FilePreviewItem
              key={idx}
              file={file}
              idx={idx}
              allowMultiple
              allowPrimary={false}
            />
          ))}
        </div>
      ) : (
        <div className="text-sm text-neutral-500">لا توجد مرفقات.</div>
      )}
      {children}
    </Card>
  );
}
