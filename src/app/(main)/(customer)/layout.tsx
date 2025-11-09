
import CustomerSidebar from "@/components/main/customer/CustomerSidebar";



export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <>
            <div className="container py-[30px] lg:py-[60px]  relative z-[1] px-3">
                <div className="grid grid-cols-12 gap-4 lg:gap-6">
                    <div className="col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-3">
                        <CustomerSidebar />
                    </div>
                    <div className="col-span-12 md:col-span-7 lg:col-span-8 xl:col-span-9">
                        <main className="flex-1 ">{children}</main>
                    </div>

                </div>
            </div>
        </>
    );
}