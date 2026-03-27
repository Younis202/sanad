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
          background: "var(--card-bg)",
          borderBottom: "1px solid var(--n-150)",
        }}
      >
        <div>
          <div className="text-h2" style={{ color: "var(--n-900)" }}>
            واجهة الإسعاف
          </div>
          <div className="text-small mt-0.5" style={{ color: "var(--n-400)" }}>
            Emergency Interface · وصول فوري للبيانات الحرجة
          </div>
        </div>
        <span className="badge badge-critical">
          <div
            className="rounded-full"
            style={{ width: "5px", height: "5px", background: "var(--critical-500)", animation: "pulse-slow 1.5s ease-in-out infinite" }}
          />
          EMERGENCY MODE
        </span>
      </div>

      <div className="flex-1 p-6 max-w-2xl mx-auto w-full space-y-5">
        {/* Scan Panel */}
        <div
          className="rounded-xl p-5"
          style={{
            background: "var(--n-900)",
            border: "1px solid var(--n-800)",
          }}
        >
          <div
            className="text-label mb-3"
            style={{ color: "var(--n-500)" }}
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
                background: "var(--n-800)",
                border: "1px solid var(--n-700)",
                color: "white",
                letterSpacing: "2px",
                fontSize: "20px",
                textAlign: "center",
              }}
              dir="ltr"
              maxLength={10}
            />
            <button
              onClick={() => scan()}
              disabled={loading}
              className="btn btn-danger btn-lg"
              style={{ minWidth: "100px" }}
            >
              {loading ? (
                <div style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
              ) : "مسح"}
            </button>
          </div>

          <div className="flex items-center gap-4 mt-3">
            <span className="text-caption" style={{ color: "var(--n-500)" }}>
              بيانات تجريبية:
            </span>
            {["1234567890"].map((id) => (
              <button
                key={id}
                onClick={() => { setLocalId(id); scan(id); }}
                className="font-mono text-caption underline-offset-2"
                style={{ color: "var(--brand-400)", textDecoration: "underline" }}
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        {loading && <LoadingSpinner label="جاري استرجاع البيانات الحرجة..." />}

        {error && !loading && (
          <div className="card-critical rounded-xl p-5 text-center">
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

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <AuditFooter context="Emergency" />
    </div>
  );
}
