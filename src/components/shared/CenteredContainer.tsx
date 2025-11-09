type ContainerProps = {
    children: React.ReactNode;
    className?: string;
};

export default function CenteredContainer({ children, className = '' }: ContainerProps) {
    return (
        <div className={`container w-full xl:w-[83.33%] 2xl:w-[66.66%] p-3 ${className}`}>
            {children}
        </div>
    );
}
