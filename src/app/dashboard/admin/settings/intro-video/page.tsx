"use client";

import { useState, useEffect } from "react";
import Card from "@/components/shared/Card";
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import VideoSection from "@/components/shared/VideoSection";
import CenteredContainer from "@/components/shared/CenteredContainer";
import {
  getSiteSettings,
  updateSiteSettings,
} from "@/services/settings/siteSettings";
import toast from "react-hot-toast";

export default function IntroVideoPage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch current site settings
  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const settings = await getSiteSettings();
      setVideoUrl(settings.introVideoUrl || "");
    } catch (err) {
      console.error("Error fetching settings:", err);
      setError(
        err instanceof Error ? err.message : "فشل في تحميل بيانات الفيديو"
      );
      toast.error("فشل في تحميل بيانات الفيديو");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoUrl.trim()) {
      toast.error("يرجى إدخال رابط الفيديو");
      return;
    }

    try {
      setSaving(true);

      // Validate YouTube URL format
      const youtubeRegex =
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
      if (!youtubeRegex.test(videoUrl)) {
        toast.error("يرجى إدخال رابط يوتيوب صحيح");
        return;
      }

      const toastId = toast.loading("جاري حفظ الفيديو...");

      // Update the intro video URL using updateSiteSettings
      await updateSiteSettings({
        introVideoUrl: videoUrl.trim(),
      });

      toast.success("تم حفظ الفيديو بنجاح", { id: toastId });
    } catch (error) {
      console.error("Error saving video:", error);
      toast.error("فشل في حفظ الفيديو. يرجى المحاولة مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      setSaving(true);
      const toastId = toast.loading("جاري إزالة الفيديو...");

      // Remove the intro video by setting it to empty string
      await updateSiteSettings({
        introVideoUrl: "",
      });

      setVideoUrl("");
      toast.success("تم إزالة الفيديو بنجاح", { id: toastId });
    } catch (error) {
      console.error("Error removing video:", error);
      toast.error("فشل في إزالة الفيديو. يرجى المحاولة مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <DashboardHeaderTitle path={["الفيديو التعريفي"]} />
        <CenteredContainer>
          <Card title="">
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">جاري تحميل بيانات الفيديو...</p>
            </div>
          </Card>
        </CenteredContainer>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeaderTitle path={["الفيديو التعريفي"]} />

      <CenteredContainer className="space-y-6">
        <Card title="إضافة رابط الفيديو التعريفي">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
              <button
                onClick={fetchSettings}
                className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
              >
                إعادة المحاولة
              </button>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-4"
          >
            <input
              type="text"
              placeholder="أدخل رابط الفيديو من يوتيوب (مثال: https://youtu.be/v6E-NKtYLRg)"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              disabled={saving}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving || !videoUrl.trim()}
                className="px-6 py-2 rounded-md text-white bg-[var(--primary)] hover:bg-[var(--primary-600)] disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {saving ? "جاري الحفظ..." : "حفظ الفيديو"}
              </button>
              {videoUrl && (
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={saving}
                  className="px-6 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  إزالة الفيديو
                </button>
              )}
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">معلومات مهمة:</h4>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>يجب أن يكون الرابط من موقع يوتيوب</li>
              <li>يمكن استخدام روابط youtube.com أو youtu.be</li>
              <li>سيعرض الفيديو في الأقسام المخصصة بالموقع</li>
              <li>لإزالة الفيديو، اترك الحقل فارغًا أو انقر على زر الإزالة</li>
            </ul>
          </div>
        </Card>

        {/* Video Preview */}
        {videoUrl ? (
          <VideoSection videoUrl={videoUrl} title="معاينة الفيديو التعريفي" />
        ) : (
          <Card title="معاينة الفيديو">
            <div className="text-center py-10 text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-sm">لا يوجد فيديو معروض حالياً</p>
              <p className="text-xs mt-1">
                أضف رابط فيديو من يوتيوب لعرض المعاينة
              </p>
            </div>
          </Card>
        )}

        {/* Current Video Info */}
        {videoUrl && (
          <Card title="معلومات الفيديو الحالي">
            <div className="space-y-3">
              <div>
                <span className="font-medium">رابط الفيديو:</span>
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm block mt-1 break-all"
                >
                  {videoUrl}
                </a>
              </div>
              <div className="text-sm text-gray-600">
                <p>💡 سيتم عرض هذا الفيديو في الأقسام الرئيسية بالموقع</p>
              </div>
            </div>
          </Card>
        )}
      </CenteredContainer>
    </div>
  );
}
