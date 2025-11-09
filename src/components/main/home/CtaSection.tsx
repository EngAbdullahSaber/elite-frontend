import Link from "next/link";
import Image from "next/image";
import { BsArrowLeft } from "react-icons/bs";

export default function CtaSection() {
  return (
    <section className="bg-secondary-light/60 px-3 xl:px-0 ">
      <div className="container">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 lg:col-span-1 py-[60px] lg:py-[120px] flex items-center">
            <div>
              <h2 className="h2 mb-4 leading-tight">ابدأ بإدراج أو شراء عقار معنا</h2>
              <p className="mb-8 text-neutral-700">تحدث إلى خبرائنا أو تصفّح المزيد من العقارات.</p>
              <div className="max-w-max">
                <Link className="btn-tertiary hover:brightness-95" href="/projects">
                  تصفح المشاريع <BsArrowLeft className="text-xl inline-block ml-2" />
                </Link>
              </div>
            </div>
          </div>

          <div className="col-span-2 lg:col-span-1 flex justify-end">
            <div className="relative w-full max-w-[560px] aspect-[570/460]">
              <Image
                alt=""
                fill
                className="object-contain"
                src="/main/home/cta-bg-2.png"
                sizes="(max-width: 1024px) 100vw, 560px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
