// Update your GeneralInfoCard component to include location
export default function GeneralInfoCard({ request }: { request: any }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات عامة</h3>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            الحالة
          </label>
          <p className="text-gray-900">
            {request.status === "pending"
              ? "قيد المراجعة"
              : request.status === "approved"
              ? "مقبول"
              : request.status === "rejected"
              ? "مرفوض"
              : request.status}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            تاريخ الإنشاء
          </label>
          <p className="text-gray-900">
            {new Date(request.createdAt).toLocaleDateString("ar-SA")}
          </p>
        </div>

        {request.locationData &&
          request.locationData.lat &&
          request.locationData.lng && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                الإحداثيات
              </label>
              <p className="text-gray-900">
                {request.locationData.lat}, {request.locationData.lng}
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
