type SubTitleProps = {
    children: React.ReactNode;
    className?: string;
};

export default function SubTitle({ children, className = "" }: SubTitleProps) {
    return (
        <h3
            className={`text-lg font-bold text-gray-800 flex items-center gap-2 my-1 ${className}`}
        >
            {children}
        </h3>
    );
}
