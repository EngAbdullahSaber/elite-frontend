import { SlArrowRight } from "react-icons/sl";

type ButtonProps = {
    className?: string;
};

export default function SwiperNextButton({ className = "" }: ButtonProps) {
    return (
        <div
            className={`bg-white hover:bg-primary text-primary cursor-pointer z-10 hover:text-white duration-300 rounded-full h-12 w-12 border border-primary flex items-center justify-center ${className}`}
        >
            <SlArrowRight />
        </div>
    );
}
