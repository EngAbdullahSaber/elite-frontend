import { FaStar } from "react-icons/fa";
import Image from "next/image";
import { PiQuotes } from "react-icons/pi";

type TestimonialProps = {
    stars: number;
    message: string;
    name: string;
    role: string;
    imageUrl: string;
};

export default function TestimonialCard({
    stars,
    message,
    name,
    role,
    imageUrl,
}: TestimonialProps) {
    return (
        <div className="rounded-2xl bg-primary-light text-center">
            <PiQuotes className="text-7xl text-primary rotate-180 mx-auto" />
            <div className="flex justify-center gap-1 mt-2">
                {[...Array(stars)].map((_, i) => (
                    <FaStar key={i} className="text-tertiary" />
                ))}
            </div>
            <p className="text-lg md:text-2xl px-14 mt-5">{message}</p>
            <div className="flex gap-5 justify-center mt-8">
                <div className="w-15 h-15 rounded-full">
                    <Image
                        alt="img"
                        width={60}
                        height={60}
                        className="rounded-full"
                        src={imageUrl}
                    />
                </div>
                <div>
                    <span className="block text-2xl font-medium">{name}</span>
                    <span className="clr-neutral-500 text-start">{role}</span>
                </div>
            </div>
        </div>
    );
}
