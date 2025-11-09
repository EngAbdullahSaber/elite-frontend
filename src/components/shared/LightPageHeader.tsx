

interface LightPageHeaderProps {
    text: string;
    className?: string;
}

const LightPageHeader: React.FC<LightPageHeaderProps> = ({ text, className = '' }) => {
    return <h2 className={'h2 mt-4 mb-10 ' + className}>{text}</h2>;
};

export default LightPageHeader;
