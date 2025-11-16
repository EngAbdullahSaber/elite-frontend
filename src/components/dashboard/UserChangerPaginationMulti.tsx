"use client";

import { useState, useEffect } from "react";
import InfoCell from "../shared/InfoCell";
import Popup from "../shared/Popup";
import { MdClose } from "react-icons/md";
import UserAssignmentTogglePaginationMultiSelect from "./UserAssignmentTogglePaginationMultiSelect";

type User = {
  id: number;
  name: string;
  email: string;
  image?: string;
};

type Props = {
  appointmentId?: number;
  initialUserIds?: number[];
  users: User[];
  label?: string;
  showSelected?: boolean;
  onChange?: (users: User[]) => void;
  disabled?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
  onSearch?: (search: string) => void;
  maxSelections?: number;
  multiple?: boolean;
};

export default function UserChangerPaginationMulti({
  appointmentId,
  initialUserIds = [],
  users,
  label = "المستخدم",
  showSelected = true,
  onChange,
  disabled = false,
  hasMore = false,
  onLoadMore,
  loadingMore = false,
  onSearch,
  maxSelections,
  multiple = false,
}: Props) {
  const [selectedUsers, setSelectedUsers] = useState<User[]>(() => {
    const initialUsers = users.filter((u) => initialUserIds.includes(u.id));
    return Array.isArray(initialUsers) ? initialUsers : [];
  });

  const [showPopup, setShowPopup] = useState(false);

  const safeSelectedUsers = Array.isArray(selectedUsers) ? selectedUsers : [];

  useEffect(() => {
    const initialUsers = users.filter((u) => initialUserIds.includes(u.id));
    setSelectedUsers(Array.isArray(initialUsers) ? initialUsers : []);
  }, []);

  const handleSelect = (users: User[]) => {
    setSelectedUsers(users);
    setShowPopup(false);
    onChange?.(users);
  };

  const handleRemoveUser = (userId: number) => {
    const updatedUsers = safeSelectedUsers.filter((user) => user.id !== userId);
    setSelectedUsers(updatedUsers);
    onChange?.(updatedUsers);
  };

  const handleClearAll = () => {
    setSelectedUsers([]);
    setShowPopup(false);
    onChange?.([]);
  };

  const handleButtonClick = () => {
    if (disabled) return;
    setShowPopup(true);
  };

  const isMaxSelectionsReached = maxSelections
    ? safeSelectedUsers.length >= maxSelections
    : false;

  return (
    <div className="relative w-full">
      {/* ✅ عرض المستخدمين المحددين أو زر التعيين */}
      {safeSelectedUsers.length === 0 || !showSelected ? (
        <button
          onClick={handleButtonClick}
          type="button"
          disabled={disabled}
          className={`w-full py-3 px-4 border font-semibold rounded-md transition ${
            disabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
        >
          {safeSelectedUsers.length > 0
            ? `اختر ${label} آخر`
            : `تعيين ${label}`}
        </button>
      ) : (
        <div className="border p-3 rounded-md bg-white">
          {/* Header with count and clear button - Only show for multi-select */}
          {multiple && (
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-600">
                {safeSelectedUsers.length} {label} محدد
              </span>
              {!disabled && safeSelectedUsers.length > 0 && (
                <button
                  onClick={handleClearAll}
                  type="button"
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  إزالة الكل
                </button>
              )}
            </div>
          )}

          {/* Selected users list */}
          <div className="space-y-2">
            {safeSelectedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between gap-2 p-2 bg-gray-50 rounded-md"
              >
                <InfoCell
                  image={user.image}
                  subtitle={user.email}
                  title={user.name}
                  href={``}
                  imageRounded="full"
                />
                {!disabled && (
                  <button
                    onClick={() => handleRemoveUser(user.id)}
                    type="button"
                    title="إزالة"
                    className="text-gray-500 hover:text-red-500 p-2 rounded-full"
                  >
                    <MdClose className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Change button */}
          {!disabled && (
            <button
              onClick={handleButtonClick}
              type="button"
              className="mt-3 w-full px-4 py-2 rounded-md bg-[var(--primary)] text-white hover:bg-[var(--primary-600)] text-center"
            >
              {isMaxSelectionsReached
                ? `تم الوصول للحد الأقصى (${maxSelections})`
                : `تغيير ${label}`}
            </button>
          )}
        </div>
      )}

      {/* ✅ نافذة التعيين */}
      <Popup show={showPopup && !disabled} onClose={() => setShowPopup(false)}>
        <UserAssignmentTogglePaginationMultiSelect
          appointmentId={appointmentId}
          users={users}
          selectedUsers={safeSelectedUsers}
          label={label}
          onConfirm={handleSelect}
          onCancel={() => setShowPopup(false)}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
          loadingMore={loadingMore}
          onSearch={onSearch}
          maxSelections={maxSelections}
          multiSelect={multiple}
        />
      </Popup>
    </div>
  );
}
