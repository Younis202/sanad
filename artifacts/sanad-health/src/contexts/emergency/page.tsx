import { useEffect, useRef, useState } from "react";
import { useEmergencyStore } from "../../lib/state/emergency.store";
import { api } from "../../lib/api/client";
import PriorityStrip from "../../components/system/PriorityStrip";
import AuditFooter from "../../components/system/AuditFooter";
import EmergencyCard from "../../components/emergency/EmergencyCard";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

export default function EmergencyContext() {
  const {
    scannedId, setScannedId,
    data, setData,
    loading, setLoading,
    error, setError,
    responseTimeMs, setResponseTime,
    reset,
  } = useEmergencyStore();

  const [localId, setLocalId] = useState(scannedId);
  const inputRef = useRef<HTMLInputElement>(null);
  const didInit = useRef(false);

  async function scan(id?: string) {
    const target = (id ?? localId).trim();
    if (!target) return;
    setScannedId(target);
    reset();
    setLoading(true);
    const t0 = performance.now();
    try {
      const result = await api.emergency.scan(target);
      setResponseTime(Math.round(performance.now() - t0));
      setData(result as Parameters<typeof setData>[0]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      scan(scannedId);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {data && (
        <PriorityStrip
          level="critical"
          message={`بيانات حرجة محملة — ${data.nameAr}`}
          detail={`استجابة في ${responseTimeMs ?? "—"} مللي ثانية`}
        />
      )}

      {/* Page Header */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(255,255,255,0.70)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.60)",
        }}
      >
        <div>
          <div className="text-h2" style={{ color: "var(--n-800)", letterSpacing: "-0.5px" }}>
            واجهة الإسعاف
          </div>
          <div className="text-small mt-0.5" style={{ color: "var(--n-400)" }}>
            Emergency Interface · وصول فوري للبيانات الحرجة
          </div>
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 12px",
            borderRadius: "99px",
            background: "rgba(239, 68, 68, 0.10)",
            border: "1px solid rgba(239, 68, 68, 0.22)",
            fontSize: "11px",
            fontWeight: 700,
            color: "var(--critical-600)",
            letterSpacing: "0.5px",
          }}
        >
          <div
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "var(--critical-500)",
              boxShadow: "0 0 6px var(--critical-500)",
              animation: "pulse-soft 1.5s ease-in-out infinite",
            }}
          />
          EMERGENCY MODE
        </span>
      </div>

      <div className="flex-1 p-6 max-w-2xl mx-auto w-full space-y-5">
        {/* Scan Panel */}
        <div
          className="rounded-3xl p-6"
          style={{
            background: "rgba(0, 25, 60, 0.88)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.24)",
          }}
        >
          <div
            className="text-label mb-4"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            مسح الهوية الوطنية · Scan National ID
          </div>
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={localId}
              onChange={(e) => setLocalId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && scan()}
              placeholder="0000000000"
              className="input input-lg flex-1 font-mono"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1.5px solid rgba(255,255,255,0.12)",
                color: "white",
                letterSpacing: "3px",
                fontSize: "22px",
                textAlign: "center",
                borderRadius: "99px",
              }}
              dir="ltr"
              maxLength={10}
            />
            <button
              onClick={() => scan()}
              disabled={loading}
              className="btn btn-danger btn-lg"
              style={{ minWidth: "100px", flexShrink: 0 }}
            >
              {loading ? (
                <div style={{
                  width: "16px", height: "16px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                  animation: "spin 0.7s linear infinite",
                }} />
              ) : "مسح"}
            </button>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <span className="text-caption" style={{ color: "rgba(255,255,255,0.28)" }}>
              بيانات تجريبية:
            </span>
            {["1234567890"].map((id) => (
              <button
                key={id}
                onClick={() => { setLocalId(id); scan(id); }}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                  color: "rgba(0, 51, 255, 0.9)",
                  textDecoration: "underline",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  letterSpacing: "1px",
                }}
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        {loading && <LoadingSpinner label="جاري استرجاع البيانات الحرجة..." />}

        {error && !loading && (
          <div
            className="rounded-3xl p-6 text-center"
            style={{
              background: "rgba(255, 241, 242, 0.85)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(254, 205, 211, 0.8)",
              borderRight: "3px solid var(--critical-500)",
            }}
          >
            <div className="text-h4 mb-1" style={{ color: "var(--critical-700)" }}>
              لم يتم العثور على بيانات
            </div>
            <div className="text-small" style={{ color: "var(--critical-500)" }}>
              {error}
            </div>
            <button
              onClick={() => scan()}
              className="btn btn-danger btn-sm mt-4"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {data && !loading && (
          <EmergencyCard data={data} responseTimeMs={responseTimeMs} />
        )}
      </div>

      <AuditFooter context="Emergency" />
    </div>
  );
}
