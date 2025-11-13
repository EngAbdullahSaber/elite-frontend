"use client";

import { useState, useRef, useCallback } from "react";
import InfoCell from "../shared/InfoCell";
import { FiSearch } from "react-icons/fi";

type User = {
  id: number;
  name: string;
  email: string;
  image?: string;
};

type Props = {
  appointmentId?: number;
  users: User[];
  selectedUser?: User;
  label?: string;
  onConfirm: (user: User) => void;
  onCancel: () => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
  onSearch?: (search: string) => void;
};

export default function UserAssignmentTogglePagination({
  users,
  selectedUser,
  label = "المستخدم",
  onConfirm,
  onCancel,
  hasMore = false,
  onLoadMore,
  loadingMore = false,
  onSearch,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg w-full   mx-auto p-2">
      <h2 className="text-xl font-bold mb-4 text-center">اختر {label}</h2>

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
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => onConfirm(user)}
                className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedUser?.id === user.id ? "bg-primary/10" : ""
                }`}
              >
                <InfoCell
                  image={user.image}
                  subtitle={user.email}
                  title={user.name}
                  imageRounded="full"
                />
              </div>
            ))}

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
          onClick={() => selectedUser && onConfirm(selectedUser)}
          type="button"
          className="flex-1 py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-600 transition"
          disabled={!selectedUser}
        >
          تأكيد
        </button>
      </div>
    </div>
  );
}
