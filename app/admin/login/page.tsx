import LoginCard from "@/components/admin/LoginCard";
import Footer from "@/components/Footer";
import { login } from "./actions";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string; reset?: string };
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-cream p-6">
      <LoginCard action={login} hasError={Boolean(searchParams?.error)} justReset={Boolean(searchParams?.reset)} />
      <div className="mt-6">
        <Footer variant="light" />
      </div>
    </div>
  );
}
