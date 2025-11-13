"use client";
import DataView from "@/components/shared/DateViewTable/DataView";
import { MenuActionItem } from "@/components/shared/Header/MenuActionList";
import {
  agentColumns,
  agentFilters,
  agentSortConfig,
} from "@/constants/dashboard/admin/agent/contants";
import useAgents from "@/hooks/dashboard/admin/agent/useAgents";
import { AgentRow } from "@/types/dashboard/agent";
import {
  FaCheck,
  FaEdit,
  FaPencilAlt,
  FaRegTrashAlt,
  FaUndo,
} from "react-icons/fa";
import AgentStatusToggle from "./AgentStatusToggle";
interface AgentsDataViewDataViewProps {
  onDataUpdate?: (data: any[], filters: Record<string, any>) => void;
}

export default function AgentsDataViewDataView({
  onDataUpdate,
}: AgentsDataViewDataViewProps) {
  const { agents, loading, refetch, totalCount } = useAgents();

  // Create a getRows function that uses the current state
  const getRows = async () => ({
    rows: agents || [],
    loading,
    totalCount: totalCount || agents?.length || 0,
  });
  const handleDataUpdate = (data: any[], filters: Record<string, any>) => {
    if (onDataUpdate) {
      onDataUpdate(data, filters);
    }
  };
  return (
    <DataView<AgentRow>
      columns={agentColumns}
      filters={agentFilters}
      sortConfig={agentSortConfig}
      showSearch
      showSort
      getRows={getRows}
      showActions
      actionsMenuItems={(row, onClose) =>
        getAgentActionsMenu(row, onClose, refetch)
      }
      onDataUpdate={handleDataUpdate}
    />
  );
}

function getAgentActionsMenu(
  row: AgentRow,
  onClose?: () => void,
  refetch?: () => void
): MenuActionItem[] {
  const { status } = row;

  const baseActions: MenuActionItem[] = [
    {
      label: "عرض التفاصيل",
      icon: <FaPencilAlt />,
      link: `/dashboard/admin/agents/${row.id}`,
    },
    {
      label: "تعديل الوسيط",
      icon: <FaEdit />,
      link: `/dashboard/admin/agents/edit/${row.id}`,
    },
  ];

  const statusActions: MenuActionItem[] = [];

  if (status === "pending") {
    statusActions.push(
      {
        label: "قبول الطلب",
        type: "primary",
        icon: <FaCheck />,
        child: (
          <AgentStatusToggle
            agent={row}
            currentStatus="pending"
            nextStatus="active"
            onConfirm={() => {
              onClose?.();
              refetch?.(); // This will trigger a re-render with updated data
            }}
          />
        ),
      },
      {
        label: "رفض الطلب",
        type: "delete",
        icon: <FaRegTrashAlt />,
        child: (
          <AgentStatusToggle
            agent={row}
            currentStatus="pending"
            nextStatus="rejected"
            onConfirm={() => {
              onClose?.();
              refetch?.(); // This will trigger a re-render with updated data
            }}
          />
        ),
      }
    );
  } else if (status === "rejected") {
    statusActions.push(
      {
        label: "إعادة النظر",
        type: "primary",
        icon: <FaCheck />,
        child: (
          <AgentStatusToggle
            agent={row}
            currentStatus="rejected"
            nextStatus="active"
            onConfirm={() => {
              onClose?.();
              refetch?.();
            }}
          />
        ),
      },
      {
        label: "تحويل إلى قيد الانتظار",
        type: "primary",
        icon: <FaUndo />,
        child: (
          <AgentStatusToggle
            agent={row}
            currentStatus="rejected"
            nextStatus="pending"
            onConfirm={() => {
              onClose?.();
              refetch?.();
            }}
          />
        ),
      }
    );
  } else {
    const isSuspended = status === "suspended";
    statusActions.push({
      label: isSuspended ? "تفعيل الحساب" : "تعليق الحساب",
      type: isSuspended ? "primary" : "delete",
      icon: isSuspended ? <FaCheck /> : <FaRegTrashAlt />,
      child: (
        <AgentStatusToggle
          agent={row}
          currentStatus={status}
          nextStatus={isSuspended ? "active" : "suspended"}
          onConfirm={() => {
            onClose?.();
            refetch?.();
          }}
        />
      ),
    });
  }

  return [...baseActions, ...statusActions];
}
