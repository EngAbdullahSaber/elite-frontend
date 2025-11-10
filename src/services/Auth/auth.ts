import { api } from "@/libs/axios";

// TypeScript interfaces
export interface LoginData {
  email: string;
  password: string;
}
export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  userType: string;
  phoneNumber: string;
}
export interface OtpData {
  email: string;
  otp?: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
  email?: string; // Optional, depending on your API requirements
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePhotoUrl?: string;
  userType: string;
  verificationStatus: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  profilePhoto?: File | string;
}

// Authentication endpoints

export async function Register(
  data: RegisterData
): Promise<{ message: string; data?: any }> {
  try {
    const res = await api.post(`/auth/register`, data);
    return res.data;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
}

export async function Login(data: LoginData) {
  try {
    const res = await api.post(`/auth/login`, data);
    return res.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function SendOtp(data: Omit<OtpData, "otp">) {
  try {
    const res = await api.post(`/auth/login/send-otp`, data);
    return res.data;
  } catch (error) {
    console.error("Send OTP error:", error);
    throw error;
  }
}

export async function VerifyOtp(data: OtpData) {
  try {
    const res = await api.post(`/auth/verify-otp`, data);
    return res.data;
  } catch (error) {
    console.error("Verify OTP error:", error);
    throw error;
  }
}

// Logout endpoint
export async function Logout(): Promise<{ message: string }> {
  try {
    const res = await api.post(`/auth/logout`);
    return res.data;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

// Forgot password endpoint
export async function ForgotPassword(
  data: ForgotPasswordData
): Promise<{ message: string }> {
  try {
    const res = await api.post(`/auth/forgot-password`, data);
    return res.data;
  } catch (error) {
    console.error("Forgot password error:", error);
    throw error;
  }
}

// Reset password endpoint
export async function ResetPassword(
  data: ResetPasswordData
): Promise<{ message: string }> {
  try {
    const res = await api.post(`/auth/reset-password`, data);
    return res.data;
  } catch (error) {
    console.error("Reset password error:", error);
    throw error;
  }
}

// Change password endpoint
export async function ChangePassword(data: ChangePasswordData) {
  try {
    const res = await api.post(`/auth/change-password`, data);
    return res.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
}

// Profile endpoints
export async function GetProfile(): Promise<{ data: UserProfile }> {
  try {
    const res = await api.get(`/auth/profile`);
    return res.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
}

export async function UpdateProfile(
  data: UpdateProfileData
): Promise<{ data: UserProfile }> {
  try {
    const res = await api.patch(`/auth/profile`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}

// Upload profile photo
export async function UploadProfilePhoto(
  file: File
): Promise<{ data: { profilePhotoUrl: string } }> {
  try {
    const formData = new FormData();
    formData.append("profilePhoto", file);

    const res = await api.post(`/auth/profile/photo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error uploading profile photo:", error);
    throw error;
  }
}
