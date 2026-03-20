import { KeyRound, LogIn, LogOut, RefreshCw, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { Status } from "../backend";
import type { PrayerRequest } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetAllPrayerRequests,
  useInitializeAdmin,
  useIsAdmin,
} from "../hooks/useQueries";

function formatCategory(cat: PrayerRequest["category"]): string {
  return cat.__kind__.charAt(0).toUpperCase() + cat.__kind__.slice(1);
}

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleString();
}

function statusColor(status: Status): string {
  if (status === Status.answered) return "#22c55e";
  if (status === Status.prayedFor) return "var(--gold)";
  return "oklch(var(--muted-foreground))";
}

export default function AdminPage() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: requests, isLoading, refetch } = useGetAllPrayerRequests();
  const initializeAdmin = useInitializeAdmin();
  const [setupToken, setSetupToken] = useState("");

  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
  }, []);

  const handleClaimAdmin = () => {
    if (!setupToken.trim()) return;
    initializeAdmin.mutate(setupToken.trim());
  };

  return (
    <div
      className="dark min-h-screen"
      style={{
        background: "oklch(var(--background))",
        color: "oklch(var(--foreground))",
      }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{
          background: "rgba(10,15,22,0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--glass-border)",
        }}
      >
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6" style={{ color: "var(--gold)" }} />
          <span className="font-bold text-lg">Admin Panel</span>
          <span
            className="text-sm"
            style={{ color: "var(--muted-foreground)" }}
          >
            &middot; Glory of Jesus Assembly
          </span>
        </div>
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <span
                className="text-xs"
                style={{ color: "var(--muted-foreground)" }}
              >
                {identity?.getPrincipal().toString().slice(0, 12)}&hellip;
              </span>
              <button
                type="button"
                onClick={clear}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-80"
                style={{
                  border: "1px solid var(--glass-border)",
                  color: "inherit",
                }}
                data-ocid="admin.button"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={login}
              disabled={loginStatus === "logging-in"}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all hover:shadow-gold"
              style={{
                background:
                  "linear-gradient(135deg, var(--gold-light), var(--gold-dark))",
                color: "#111",
              }}
              data-ocid="admin.primary_button"
            >
              <LogIn className="w-4 h-4" />
              {loginStatus === "logging-in" ? "Connecting…" : "Login"}
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {!isLoggedIn ? (
          <div className="text-center py-24" data-ocid="admin.section">
            <Shield
              className="w-16 h-16 mx-auto mb-4"
              style={{ color: "var(--gold)", opacity: 0.4 }}
            />
            <h2 className="font-serif text-3xl mb-3">Admin Access Required</h2>
            <p className="mb-8" style={{ color: "var(--muted-foreground)" }}>
              Please log in to view prayer requests.
            </p>
            <button
              type="button"
              onClick={login}
              disabled={loginStatus === "logging-in"}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-all hover:shadow-gold"
              style={{
                background:
                  "linear-gradient(135deg, var(--gold-light), var(--gold-dark))",
                color: "#111",
              }}
              data-ocid="admin.primary_button"
            >
              <LogIn className="w-5 h-5" />
              {loginStatus === "logging-in"
                ? "Connecting…"
                : "Login to Continue"}
            </button>
          </div>
        ) : adminLoading ? (
          <div className="text-center py-24" data-ocid="admin.loading_state">
            <div
              className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4"
              style={{ borderColor: "var(--gold)" }}
            />
            <p style={{ color: "var(--muted-foreground)" }}>
              Checking permissions…
            </p>
          </div>
        ) : !isAdmin ? (
          <div
            className="flex flex-col items-center py-16"
            data-ocid="admin.section"
          >
            <div
              className="w-full max-w-md rounded-2xl p-8"
              style={{
                background: "var(--glass)",
                border: "1px solid var(--glass-border)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(212,175,55,0.15)" }}
                >
                  <KeyRound
                    className="w-5 h-5"
                    style={{ color: "var(--gold)" }}
                  />
                </div>
                <h2 className="font-serif text-2xl">Admin Setup</h2>
              </div>

              <p
                className="mb-6 text-sm leading-relaxed"
                style={{ color: "var(--muted-foreground)" }}
              >
                You are logged in but do not have admin access yet. If you are
                the first admin, enter the{" "}
                <strong style={{ color: "oklch(var(--foreground))" }}>
                  Admin Setup Token
                </strong>{" "}
                below to claim access. You can find the token in your{" "}
                <strong style={{ color: "oklch(var(--foreground))" }}>
                  Caffeine project settings
                </strong>
                .
              </p>

              <div className="flex flex-col gap-4">
                <div>
                  <label
                    className="block text-xs font-semibold mb-2 uppercase tracking-widest"
                    style={{ color: "var(--gold)" }}
                    htmlFor="admin-token"
                  >
                    Admin Setup Token
                  </label>
                  <input
                    id="admin-token"
                    type="password"
                    placeholder="Paste your token here…"
                    value={setupToken}
                    onChange={(e) => setSetupToken(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleClaimAdmin()}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid var(--glass-border)",
                      color: "oklch(var(--foreground))",
                    }}
                    data-ocid="admin.input"
                  />
                </div>

                {initializeAdmin.isError && (
                  <div
                    className="px-4 py-3 rounded-xl text-sm"
                    style={{
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      color: "#f87171",
                    }}
                    data-ocid="admin.error_state"
                  >
                    Invalid token. Please check and try again.
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleClaimAdmin}
                  disabled={initializeAdmin.isPending || !setupToken.trim()}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--gold-light), var(--gold-dark))",
                    color: "#111",
                  }}
                  data-ocid="admin.primary_button"
                >
                  {initializeAdmin.isPending ? (
                    <>
                      <div
                        className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                        style={{ borderColor: "#111" }}
                      />
                      Claiming Access…
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      Claim Admin Access
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-serif text-3xl">Prayer Requests</h1>
                <p
                  className="mt-1"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {requests?.length ?? 0} total requests
                </p>
              </div>
              <button
                type="button"
                onClick={() => refetch()}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-80"
                style={{
                  border: "1px solid var(--glass-border)",
                  color: "inherit",
                }}
                data-ocid="admin.button"
              >
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
            </div>

            {isLoading ? (
              <div
                className="text-center py-16"
                data-ocid="admin.loading_state"
              >
                <div
                  className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4"
                  style={{ borderColor: "var(--gold)" }}
                />
                <p style={{ color: "var(--muted-foreground)" }}>
                  Loading requests…
                </p>
              </div>
            ) : !requests || requests.length === 0 ? (
              <div
                className="glass-panel rounded-2xl p-16 text-center"
                data-ocid="admin.empty_state"
              >
                <p className="font-serif text-2xl mb-2">No requests yet</p>
                <p style={{ color: "var(--muted-foreground)" }}>
                  Prayer requests will appear here once submitted.
                </p>
              </div>
            ) : (
              <div
                className="glass-panel rounded-2xl overflow-hidden"
                data-ocid="admin.table"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr
                        style={{
                          borderBottom: "1px solid var(--glass-border)",
                        }}
                      >
                        {[
                          "#",
                          "Name",
                          "Phone",
                          "Category",
                          "Message",
                          "Status",
                          "Submitted",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-5 py-4 text-left font-semibold"
                            style={{ color: "var(--gold)" }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((req, i) => (
                        <tr
                          key={String(req.id)}
                          style={{
                            borderBottom: "1px solid var(--glass-border)",
                          }}
                          className="transition-colors hover:bg-white/5"
                          data-ocid={`admin.row.${i + 1}`}
                        >
                          <td
                            className="px-5 py-4"
                            style={{ color: "var(--muted-foreground)" }}
                          >
                            {i + 1}
                          </td>
                          <td className="px-5 py-4 font-semibold">
                            {req.name}
                          </td>
                          <td
                            className="px-5 py-4"
                            style={{ color: "var(--muted-foreground)" }}
                          >
                            {req.phone ? String(req.phone) : "—"}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className="px-2 py-1 rounded-full text-xs font-semibold"
                              style={{
                                background: "var(--glass)",
                                border: "1px solid var(--glass-border)",
                                color: "var(--gold)",
                              }}
                            >
                              {formatCategory(req.category)}
                            </span>
                          </td>
                          <td
                            className="px-5 py-4"
                            style={{
                              color: "var(--muted-foreground)",
                              maxWidth: "260px",
                            }}
                          >
                            <p className="truncate">{req.message}</p>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className="font-semibold"
                              style={{ color: statusColor(req.status) }}
                            >
                              {req.status}
                            </span>
                          </td>
                          <td
                            className="px-5 py-4"
                            style={{
                              color: "var(--muted-foreground)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formatTimestamp(req.timestamp)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
