import { agentStatusClassMap } from "@/constants/dashboard/admin/agent/contants";
import { AgentRow, AgentStatus, agentStatusMap } from "@/types/dashboard/agent";
import { useState } from "react";

type Props = {
    agent: AgentRow;
    currentStatus: AgentStatus;
    nextStatus: AgentStatus;
    onConfirm?: () => void;
    onCancel?: () => void;
};

export default function AgentStatusToggle({
    agent,
    currentStatus,
    nextStatus,
    onConfirm,
    onCancel,
}: Props) {
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        setLoading(true);
        try {
            await fetch(`/api/agents/${agent.id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: nextStatus }),
            });

            if (onConfirm) onConfirm();
        } catch (error) {
            console.error('Failed to update agent status:', error);
        } finally {
            setLoading(false);
        }
    };

    const title = `تغيير حالة الوسيط`;
    const message = `هل أنت متأكد أنك تريد تغيير حالة "${agent.name}" (رقم ${agent.id}) من "${agentStatusMap[currentStatus]}" إلى "${agentStatusMap[nextStatus]}"؟`;

    return (
        <div className="rounded-lg bg-white max-w-md mx-auto">
            <h3 className="text-lg font-bold text-gray-800 text-center">{title}</h3>
            <p className="text-sm text-gray-600 text-center">{message}</p>

            <div className="flex justify-end gap-3 pt-4">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                    إلغاء
                </button>
                <button
                    onClick={handleToggle}
                    disabled={loading}
                    className={`px-4 py-2 rounded-md text-white ${agentStatusClassMap[nextStatus]}`}
                >
                    {loading
                        ? 'جارٍ التنفيذ...'
                        : `تأكيد التغيير إلى ${agentStatusMap[nextStatus]}`}
                </button>
            </div>
        </div>
    );
}
