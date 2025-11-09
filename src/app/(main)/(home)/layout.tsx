import Image from "next/image";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Image
                alt="صورة"
                src="/main/home/primary-hero-el-1.png"
                width={131}
                height={454}
                className="absolute hidden xl:block top-0 left-0 z-[1]"
                priority={false}
                style={{ color: "transparent" }}
            />

            <Image
                alt="صورة"
                src="/main/home/primary-hero-el-2.png"
                width={251}
                height={251}
                className="absolute hidden xl:block top-0 right-0 z-10"
                priority={false}
                style={{ color: "transparent" }}
            />
            {children}
        </>
    );
}
