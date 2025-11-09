'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="py-[30px] lg:py-[60px] bg-bg-2 h-screen">
            <div className="container mx-auto">
                <div className="flex justify-center">
                    <div className="col-span-10 lg:col-span-6">
                        <div className="text-center pb-10">
                            <Image
                                width={856}
                                height={558}
                                alt="image"
                                className="mx-auto w-full"

                                src="/error-img.png"
                            />
                            <h2 className="mt-10 mb-5 text-3xl font-bold">عذرًا! الصفحة غير موجودة</h2>
                            <p className="mb-8 text-gray-600">
                                نأسف، الصفحة التي تبحث عنها غير موجودة. قد تكون قد أُزيلت أو تم تغيير عنوانها أو أنها غير متوفرة مؤقتًا.
                            </p>

                            <div className="flex justify-center gap-4 flex-wrap">
                                <Link href="/" className="btn-primary font-semibold">
                                    العودة إلى الصفحة الرئيسية
                                </Link>
                                <button
                                    onClick={() => router.back()}
                                    className="btn-secondary font-semibold"
                                >
                                    العودة للخلف
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
