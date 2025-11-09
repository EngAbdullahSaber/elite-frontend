import PasswordSection from "@/components/main/customer/user-security/PasswordSection";

export const metadata = {
  title: "الأمان",
  description:
    "قم بإدارة إعدادات الأمان الخاصة بحسابك، بما في ذلك تغيير كلمة المرور، لضمان حماية معلوماتك على منصة مراسل جدة العقاري.",
};

export default function UserSecurityPage() {
  return <PasswordSection />;
}
