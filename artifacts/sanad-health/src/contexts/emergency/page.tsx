import { useState, useRef } from "react";
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

  async function handleScan(id?: string) {
    const target = (id ?? localId).trim();
    if (!target) return;
    setScannedId(target);
    reset();
    setLoading(true);
    const t0 = performance.now();
    try {
      const result = await api.emergency.scan(target) as Parameters<typeof setData>[0];
      setResponseTime(Math.round(performance.now() - t0));
      setData(result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  // Auto-fetch on mount if we have an ID
  useState(() => {
    handleScan(scannedId);
  });

  return (
    <div className="flex flex-col min-h-screen">
      {data && (
        <PriorityStrip
          message={`تم تحميل البيانات الحرجة للمريض: ${data.nameAr}`}
          level="critical"
        />
      )}

      {/* Header bar */}
      <div
        className="px-6 py-4 border-b border-neutral-200 bg-white flex items-center justify-between"
        style={{ background: "white" }}
      >
        <div>
          <h1 className="text-xl font-black text-neutral-900 flex items-center gap-2">
            <span>🚑</span> واجهة الإسعاف
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            نظام الوصول السريع للبيانات الحرجة — الوضع الطارئ
          </p>
        </div>
        <span className="badge badge-critical">Emergency Mode</span>
      </div>

      <div className="flex-1 p-6 max-w-3xl mx-auto w-full space-y-6">
        {/* Scan Input */}
        <div
          className="p-5 rounded-2xl space-y-3"
          style={{ background: "var(--color-critical)", color: "white" }}
        >
          <div className="flex items-center gap-2 text-sm font-semibold opacity-90">
            <span>🪪</span> مسح الهوية الوطنية
          </div>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={localId}
              onChange={(e) => setLocalId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
              placeholder="أدخل رقم الهوية الوطنية"
              className="flex-1 px-4 py-3 rounded-xl text-neutral-900 bg-white font-mono text-base outline-none focus:ring-2 focus:ring-white/50"
              dir="ltr"
            />
            <button
              onClick={() => handleScan()}
              disabled={loading}
              className="px-6 py-3 rounded-xl font-bold text-sm transition-all duration-150"
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "2px solid rgba(255,255,255,0.4)",
                color: "white",
              }}
            >
              {loading ? "⏳" : "مسح"}
            </button>
          </div>
          <div className="text-xs opacity-70 flex gap-4">
            <button onClick={() => { setLocalId("1234567890"); handleScan("1234567890"); }} className="underline">
              تجربة: 1234567890
            </button>
          </div>
        </div>

        {/* Results */}
        {loading && <LoadingSpinner label="جاري استرجاع البيانات الحرجة..." />}

        {error && !loading && (
          <div className="sanad-card-critical p-5 rounded-2xl text-center space-y-2">
            <div className="text-3xl">⚠️</div>
            <p className="text-red-700 font-semibold">{error}</p>
            <p className="text-red-500 text-xs">تأكد من رقم الهوية وحاول مجدداً</p>
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
