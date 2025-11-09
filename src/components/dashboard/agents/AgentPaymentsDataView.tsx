'use client'
import DataView from "@/components/shared/DateViewTable/DataView";
import { paymentColumns, paymentFilters, paymentSortConfig, PaymentRow } from "@/constants/dashboard/agent/payments/constants";
import usePayments from "@/hooks/dashboard/agent/payments/usePayments";
import { MenuActionItem } from "@/components/shared/Header/MenuActionList";
import { FaEye } from "react-icons/fa";

export default function AgentPaymentsDataView() {
    const getRows = usePayments();

    const actionsMenu = (row: PaymentRow): MenuActionItem[] => [
        {
            label: 'عرض تفاصيل الموعد',
            icon: <FaEye />,
            link: `/dashboard/agent/appointments/${row.appointmentId}`,
        },
    ];

    return (
        <DataView<PaymentRow>
            columns={paymentColumns}
            filters={paymentFilters}
            sortConfig={paymentSortConfig}
            showSearch={false}
            showSort
            getRows={getRows}
            showActions
            actionsMenuItems={actionsMenu}
        />
    );
}


