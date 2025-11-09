export default function SidebarSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="mb-8">
            <span className="block text-gray-400 text-xs mb-4">{title}</span>
            <ul className="flex flex-col gap-3">{children}</ul>
        </div>
    );
}
