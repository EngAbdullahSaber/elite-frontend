import StatCard from "@/components/shared/charts/StatChart";


export interface AgentAppointmentStatusData {
    confirmed: number;
    inProgress: number;
    completed: number;
    cancelled: number;
}

interface Props {
    data: AgentAppointmentStatusData;
}

export default function AgentAppointmentStatusCards({ data }: Props) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
                displayValue={data.confirmed.toString()}
                label="تم التأكيد"
                ringColorClass="border-green-500"
            />
            <StatCard
                displayValue={data.inProgress.toString()}
                label="قيد التنفيذ"
                ringColorClass="border-blue-500"
            />
            <StatCard
                displayValue={data.completed.toString()}
                label="مكتملة"
                ringColorClass="border-purple-500"
            />
            <StatCard
                displayValue={data.cancelled.toString()}
                label="ملغاة"
                ringColorClass="border-red-500"
            />
        </div>
    );
}
