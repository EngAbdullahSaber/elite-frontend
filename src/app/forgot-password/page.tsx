import Link from "next/link";
import ForgotPasswordForm from "@/components/main/forgotPassword/forgotPassword";
import LogoLink from "@/components/shared/LogoLink";

export const metadata = {
  title: "استعادة كلمة المرور",
  description:
    "أدخل بريدك الإلكتروني لاستعادة كلمة المرور والوصول إلى حسابك على منصة مراسل جدة العقاري بسهولة وأمان.",
};

export default function ForgotPasswordPage() {
  return (
    <section className="py-20 bg-[var(--bg-1)] mt-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-[800px] bg-white p-8 custom-shadow rounded-2xl">
            <LogoLink />
            <h3 className="text-3xl font-bold mb-4 text-[var(--primary-dark)] text-center">
              تغيير كلمة المرور
            </h3>

            <ForgotPasswordForm />

            <Link
              href="/sign-in"
              className="mt-4 inline-block text-[var(--primary)] font-semibold underline hover:text-[var(--primary-dark)] transition"
            >
              العودة إلى صفحة تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
