import { login } from "./actions";

export default function AdminLoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-espresso p-6">
      <form action={login} className="w-full max-w-xs rounded-3xl bg-cream p-6 shadow-card">
        <h1 className="mb-1 font-serif text-2xl italic text-espresso">Admin</h1>
        <p className="mb-5 text-sm text-espresso-light">Cardamom Café dashboard</p>

        <label className="block text-sm font-medium text-espresso">
          Password
          <input
            type="password"
            name="password"
            required
            autoFocus
            className="mt-1 w-full rounded-xl border border-gold-light/40 p-2 outline-none focus:border-gold"
          />
        </label>

        {searchParams?.error && (
          <p className="mt-3 text-sm text-red-600">Wrong password. Try again.</p>
        )}

        <button
          type="submit"
          className="mt-5 w-full rounded-full bg-espresso py-3 text-sm font-semibold uppercase tracking-wide text-cream"
        >
          Log in
        </button>
      </form>
    </div>
  );
}
