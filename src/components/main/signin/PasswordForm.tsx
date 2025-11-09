"use client";

import PrimaryButton from "@/components/shared/Button";
import TextInput from "@/components/shared/Forms/TextInput";
import Link from "next/link";

interface PasswordFormProps {
  password: string;
  setPassword: (password: string) => void;
  rememberMe: boolean;
  setRememberMe: (remember: boolean) => void;
  isLoading: boolean;
  onSubmit: () => void;
}

export default function PasswordForm({
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  isLoading,
  onSubmit,
}: PasswordFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <>
      <div className="col-span-12">
        <TextInput
          id="password"
          name="password"
          label="كلمة المرور"
          placeholder="أدخل كلمة المرور"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={true}
        />
      </div>

      <div className="col-span-12 flex justify-between items-center text-sm text-[var(--neutral-600)]">
        <Link
          href="/forgot-password"
          className="text-primary font-semibold underline hover:text-primary-dark transition"
        >
          نسيت كلمة المرور؟
        </Link>
      </div>

      <div className="col-span-12">
        <PrimaryButton
          type="submit"
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full py-3 px-6 rounded-full bg-primary text-white hover:bg-primary/90 font-semibold transition ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
        </PrimaryButton>
      </div>
    </>
  );
}
