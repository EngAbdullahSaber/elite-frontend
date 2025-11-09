'use client'
import Link from 'next/link';
import Tooltip from './Tooltip';
import { formatCellContent } from '@/utils/helpers';
import FallbackImage from './FallbackImage';

type Props = {
    href?: string;
    image?: string;
    defaultImage?: string;
    className?: string;
    title?: string;
    subtitle?: string;
    imageRounded?: 'full' | 'lg';
    subtitleClass?: string;
};

export default function InfoCell({
    href,
    image,
    defaultImage = "/users/default-user.png",
    className = '',
    title = '',
    subtitle,
    imageRounded = 'full',
    subtitleClass = '',
}: Props) {


    const imageClass = `w-10 h-10 object-cover ${imageRounded === 'full' ? 'rounded-full' : 'rounded-lg'}`;
    const containerClass = `flex items-center gap-3 ${className}`;
    const fullSubtitleClass = `text-right text-xs px-2 py-0.5 rounded-full w-fit ${subtitleClass}`;


    // Apply formatter
    const titleContent = formatCellContent(title, 20);
    const subtitleContent = formatCellContent(subtitle, 20);

    const content = (
        <div className='flex flex-row gap-2 min-w-[200px]'>

            <FallbackImage src={image?.trim()} defaultImage={defaultImage} alt={title} width={40} height={40} className={imageClass} />
            <div className="flex flex-col ">
                {title && (
                    titleContent.tooltip ? (
                        <Tooltip text={titleContent.tooltip}>
                            <span className="font-medium text-right">{titleContent.display}</span>
                        </Tooltip>
                    ) : (
                        <span className="font-medium text-right">{titleContent.display}</span>
                    )
                )}
                {subtitle && (
                    subtitleContent.tooltip ? (
                        <Tooltip text={subtitleContent.tooltip}>
                            <span className={fullSubtitleClass}>{subtitleContent.display}</span>
                        </Tooltip>
                    ) : (
                        <span className={fullSubtitleClass}>{subtitleContent.display}</span>
                    )
                )}
            </div>
        </div>
    );

    return href ? (
        <Link href={href} className={containerClass}>
            {content}
        </Link>
    ) : (
        <div className={containerClass}>
            {content}
        </div>
    );
}
