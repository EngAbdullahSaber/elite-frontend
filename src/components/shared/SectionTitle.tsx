import { BsArrowRight } from "react-icons/bs";

type SectionTitleProps = {
  title: string;
  bgColor?: string;
  arrowTitle: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
};
export default function SectionTitle({
  arrowTitle,
  title,
  description,
  bgColor = "var(--primary-light)",
  className,
  children,
}: SectionTitleProps) {
  return (
    <div
      className={`max-w-[570px] mx-auto flex flex-col items-center text-center ${className}`}
    >
      <div
        className="p-1 rounded-full flex items-center"
        style={{ backgroundColor: bgColor }}
      >
        <div className="p-2 md:p-3 rounded-full bg-primary text-white">
          <BsArrowRight />
        </div>
        <span className="text-lg  max-w-[600px] sm:text-lg lg:text-xl font-medium sm:font-semibold px-4 sm:px-3 md:px-4">
          {arrowTitle}
        </span>
      </div>
      {title && <h2 className="h2 mt-5 font-semibold">{title}</h2>}
      {description && (
        <p className="text-neutral-600 pt-5 pb-8 lg:pb-14 ">{description}</p>
      )}
      {children}
    </div>
  );
}
