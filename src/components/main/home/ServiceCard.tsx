import Link from "next/link";
import Image from "next/image";

type ServiceCardProps = {
  title: string;
  description: string;
  buttonText: string;
  imageUrl: string;
  link: string;
};

export default function ServiceCard({ title, description, buttonText, imageUrl, link }: ServiceCardProps) {
  return (
    <div className="w-[400px] bg-white p-7 xl:p-8 rounded-2xl flex flex-col items-center text-center group transition-all hover:-translate-y-1 hover:shadow-xl border border-neutral-200">
      <div className="relative w-[260px] h-[260px]">
        <Image alt="service image" fill src={imageUrl} className="object-contain" sizes="260px" />
      </div>
      <h3 className="mt-7 font-extrabold text-2xl text-neutral-900 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="mt-3 px-4 mb-8 text-neutral-600">{description}</p>
      <Link
        href={link}
        className="btn-outline group-hover:bg-tertiary transition-colors group-hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tertiary"
      >
        {buttonText}
      </Link>
    </div>
  );
}
