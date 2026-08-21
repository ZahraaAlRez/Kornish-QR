import ResetPasswordCard from "@/components/admin/ResetPasswordCard";
import Footer from "@/components/Footer";
import { resetPassword, resetPasswordWithToken } from "./actions";

export default function ResetPasswordPage({ searchParams }: { searchParams: { error?: string; token?: string } }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-cream p-6">
      <ResetPasswordCard
        token={searchParams?.token}
        errorCode={searchParams?.error}
        keyAction={resetPassword}
        tokenAction={resetPasswordWithToken}
      />
      <div className="mt-6">
        <Footer variant="light" />
      </div>
    </div>
  );
}
