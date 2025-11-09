"use client";

import PrimaryButton from "@/components/shared/Button";
import OtpInput from "@/components/shared/OtpInput";

interface OtpFormProps {
  otpSent: boolean;
  otpCooldown: boolean;
  otp: string;
  setOtp: (otp: string) => void;
  email: string;
  handleSendOtp: () => void;
  isLoading: boolean;
  onOtpSubmit: () => void;
}

export default function OtpForm({
  otpSent,
  otpCooldown,
  otp,
  setOtp,
  email,
  handleSendOtp,
  isLoading,
  onOtpSubmit,
}: OtpFormProps) {
  const handleResendOtp = () => {
    if (!otpCooldown) {
      handleSendOtp();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOtpSubmit();
  };

  return !otpSent ? (
    <div className="col-span-12">
      <PrimaryButton
        type="submit"
        onClick={handleSendOtp}
        disabled={!email || otpCooldown || isLoading}
        className={`w-full py-3 px-6 rounded-full font-semibold transition ${
          !email || otpCooldown || isLoading
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-primary text-white hover:bg-primary/90"
        }`}
      >
        {isLoading
          ? "جاري الإرسال..."
          : otpCooldown
          ? "انتظر لإعادة الإرسال"
          : "إرسال رمز التحقق"}
      </PrimaryButton>
    </div>
  ) : (
    <>
      <div className="col-span-12">
        <OtpInput value={otp} onChange={setOtp} disabled={isLoading} />
      </div>

      <div className="col-span-12 text-sm text-[var(--neutral-600)] text-center">
        تم إرسال رمز التحقق إلى بريدك الإلكتروني{" "}
        <span className="font-semibold text-primary">{email}</span>.
        <br />
        الرجاء إدخال الرمز للمتابعة.
      </div>

      <div className="col-span-12 flex gap-2">
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={otpCooldown || isLoading}
          className={`flex-1 py-2 px-4 rounded-full font-semibold transition ${
            otpCooldown || isLoading
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gray-100 text-primary hover:bg-gray-200"
          }`}
        >
          {otpCooldown ? "إعادة إرسال (60s)" : "إعادة إرسال"}
        </button>

        <button
          type="submit"
          onClick={handleOtpSubmit}
          disabled={otp.length !== 6 || isLoading}
          className={`flex-1 py-2 px-4 rounded-full font-semibold transition ${
            otp.length !== 6 || isLoading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary/90"
          }`}
        >
          {isLoading ? "جاري التحقق..." : "متابعة"}
        </button>
      </div>
    </>
  );
}
