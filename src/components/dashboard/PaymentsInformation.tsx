"use client";

import CardInfo from "@/components/shared/infos/CardInfo";
import { formatSAR } from "@/utils/helpers";
import { FaWallet, FaHourglassHalf, FaMoneyBillWave } from "react-icons/fa";
import DashboardSectionCard from "./DashboardSectionCard";

export default function PaymentsInformation() {
    return (
        <DashboardSectionCard className="mt-4 lg:mt-6" title="المحفظة">
            <div className="grid grid-cols-12 gap-4 lg:gap-6">
                {/* إجمالي الأرباح */}
                <div className="col-span-12 md:col-span-6 xl:col-span-4">
                    <CardInfo
                        icon={
                            <div className="rounded-full bg-primary p-4">
                                <FaWallet className="text-white text-3xl" />
                            </div>
                        }
                        value={formatSAR(530)}
                        label="إجمالي الأرباح"
                        className="!bg-primary-light"
                    />
                </div>

                {/* الرصيد المعلق */}
                <div className="col-span-12 md:col-span-6 xl:col-span-4">
                    <CardInfo
                        icon={
                            <div className="rounded-full bg-secondary-500 p-4">
                                <FaHourglassHalf className="text-white text-3xl" />
                            </div>
                        }
                        value={formatSAR(120)}
                        label="الرصيد المعلق"
                        className="!bg-secondary-300"
                    />
                </div>

                {/* الزوار (مثال إذا أردت بطاقة إضافية بطابع مشابه) */}
                <div className="col-span-12 md:col-span-6 xl:col-span-4">
                    <CardInfo
                        icon={
                            <div className="rounded-full bg-tertiary p-4">
                                <FaMoneyBillWave className="text-white text-3xl" />
                            </div>
                        }
                        value={formatSAR(410)}
                        label="الرصيد المتاح"
                        className="!bg-tertiary-300"
                    />
                </div>


            </div>
        </DashboardSectionCard>
    );
}
