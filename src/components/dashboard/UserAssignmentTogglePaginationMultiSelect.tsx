"use client";

import { useState, useRef, useCallback } from "react";
import InfoCell from "../shared/InfoCell";
import { FiSearch, FiCheck } from "react-icons/fi";

type User = {
  id: number;
  name: string;
  email: string;
  image?: string;
};

type Props = {
  appointmentId?: number;
  users: User[];
  selectedUsers: User[];
  label?: string;
  onConfirm: (users: User[]) => void;
  onCancel: () => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
  onSearch?: (search: string) => void;
  maxSelections?: number;
  multiSelect?: boolean;
};

export default function UserAssignmentTogglePaginationMultiSelect({
  users,
  selectedUsers = [],
  label = "المستخدم",
  onConfirm,
  onCancel,
  hasMore = false,
  onLoadMore,
  loadingMore = false,
  onSearch,
  maxSelections,
  multiSelect = false,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedUsers, setTempSelectedUsers] =
    useState<User[]>(selectedUsers);
  const listRef = useRef<HTMLDivElement>(null);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      const isNearBottom = scrollHeight - scrollTop <= clientHeight + 50;

      if (isNearBottom && hasMore && onLoadMore && !loadingMore) {
        onLoadMore();
      }
    },
    [hasMore, onLoadMore, loadingMore]
  );

  // Toggle user selection
  const toggleUserSelection = (user: User) => {
    if (multiSelect) {
      const isSelected = tempSelectedUsers.some((u) => u.id === user.id);
      let newSelectedUsers: User[];

      if (isSelected) {
        // Remove user if already selected
        newSelectedUsers = tempSelectedUsers.filter((u) => u.id !== user.id);
      } else {
        // Add user if not selected and within max limit
        if (maxSelections && tempSelectedUsers.length >= maxSelections) {
          return; // Don't exceed max selections
        }
        newSelectedUsers = [...tempSelectedUsers, user];
      }

      setTempSelectedUsers(newSelectedUsers);
    } else {
      // Single select behavior
      setTempSelectedUsers([user]);
    }
  };

  // Select all users
  const handleSelectAll = () => {
    if (!multiSelect) return;

    // If maxSelections is set, only select up to the limit
    if (maxSelections) {
      const availableSlots = maxSelections - tempSelectedUsers.length;
      if (availableSlots <= 0) return;

      const usersToAdd = filteredUsers
        .filter((user) => !tempSelectedUsers.some((u) => u.id === user.id))
        .slice(0, availableSlots);

      setTempSelectedUsers((prev) => [...prev, ...usersToAdd]);
    } else {
      // Select all filtered users
      const allFilteredUserIds = new Set(filteredUsers.map((u) => u.id));
      const currentSelectedIds = new Set(tempSelectedUsers.map((u) => u.id));

      // Combine current selections with all filtered users
      const combinedUsers = [
        ...tempSelectedUsers,
        ...filteredUsers.filter((user) => !currentSelectedIds.has(user.id)),
      ];

      setTempSelectedUsers(combinedUsers);
    }
  };

  // Deselect all users
  const handleDeselectAll = () => {
    if (!multiSelect) return;
    setTempSelectedUsers([]);
  };

  const handleConfirm = () => {
    onConfirm(tempSelectedUsers);
  };

  const isUserSelected = (user: User) => {
    return tempSelectedUsers.some((u) => u.id === user.id);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isMaxSelectionsReached = maxSelections
    ? tempSelectedUsers.length >= maxSelections
    : false;

  // Check if all filtered users are selected
  const areAllFilteredSelected =
    filteredUsers.length > 0 &&
    filteredUsers.every((user) =>
      tempSelectedUsers.some((u) => u.id === user.id)
    );

  // Check if we can select more users
  const canSelectMore =
    !maxSelections || tempSelectedUsers.length < maxSelections;

  return (
    <div className="bg-white rounded-lg w-full mx-auto p-2">
      <h2 className="text-xl font-bold mb-4 text-center">اختر {label}</h2>

      {/* Selection Info */}
      {multiSelect && (
        <div className="mb-3 p-2 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <span className="text-blue-700">
              {tempSelectedUsers.length} {label} محدد
            </span>
            {maxSelections && (
              <span className="text-blue-600">
                {tempSelectedUsers.length}/{maxSelections}
              </span>
            )}
          </div>
          {isMaxSelectionsReached && (
            <p className="text-xs text-red-600 mt-1">
              تم الوصول إلى الحد الأقصى للمختارين
            </p>
          )}
        </div>
      )}

      {/* Select All / Deselect All Buttons */}
      {multiSelect && filteredUsers.length > 0 && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleSelectAll}
            disabled={!canSelectMore || areAllFilteredSelected}
            type="button"
            className="flex-1 py-2 px-3 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {areAllFilteredSelected ? "تم اختيار الكل" : "اختيار الكل"}
          </button>
          <button
            onClick={handleDeselectAll}
            disabled={tempSelectedUsers.length === 0}
            type="button"
            className="flex-1 py-2 px-3 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            إلغاء الكل
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="relative mb-4">
        <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={`ابحث عن ${label}...`}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Users List */}
      <div
        ref={listRef}
        onScroll={handleScroll}
        className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg"
      >
        {filteredUsers.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {loadingMore ? "جاري التحميل..." : `لا يوجد ${label} متاح`}
          </div>
        ) : (
          <>
            {filteredUsers.map((user) => {
              const isSelected = isUserSelected(user);
              const canSelect = !isMaxSelectionsReached || isSelected;

              return (
                <div
                  key={user.id}
                  onClick={() => canSelect && toggleUserSelection(user)}
                  className={`p-3 border-b border-gray-100 cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-primary/10 border-primary/20"
                      : "hover:bg-gray-50"
                  } ${!canSelect ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    {/* Selection Indicator */}
                    {multiSelect && (
                      <div
                        className={`flex-shrink-0 w-5 h-5 border-2 rounded flex items-center justify-center ${
                          isSelected
                            ? "bg-primary border-primary text-white"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && <FiCheck className="w-3 h-3" />}
                      </div>
                    )}

                    {/* User Info */}
                    <div className="flex-1">
                      <InfoCell
                        image={user.image}
                        subtitle={user.email}
                        title={user.name}
                        imageRounded="full"
                      />
                    </div>

                    {/* Single select indicator */}
                    {!multiSelect && isSelected && (
                      <div className="flex-shrink-0 text-primary">
                        <FiCheck className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading More Indicator */}
            {loadingMore && (
              <div className="p-3 text-center text-gray-500">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                  <span>جاري تحميل المزيد...</span>
                </div>
              </div>
            )}

            {/* Load More Trigger */}
            {hasMore && !loadingMore && (
              <div className="p-3 text-center text-gray-500 text-sm">
                استمر في التمرير لتحميل المزيد
              </div>
            )}
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={onCancel}
          type="button"
          className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          إلغاء
        </button>
        <button
          onClick={handleConfirm}
          type="button"
          className="flex-1 py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={tempSelectedUsers.length === 0}
        >
          {multiSelect ? `تأكيد (${tempSelectedUsers.length})` : "تأكيد"}
        </button>
      </div>
    </div>
  );
}
