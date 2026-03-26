import type { EmergencyData } from "../../lib/state/emergency.store";

export default function EmergencyCard({
  data,
  responseTimeMs,
}: {
  data: EmergencyData;
  responseTimeMs: number | null;
}) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="sanad-card-critical p-5 rounded-2xl">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-xs text-red-500 font-medium mb-0.5">اسم المريض</div>
            <div className="text-2xl font-black text-red-700">{data.nameAr}</div>
            <div className="text-xs font-mono text-red-400 mt-1">{data.nationalId}</div>
          </div>
          <div className="text-center bg-white rounded-xl px-6 py-3 border-2 border-red-200">
            <div className="text-[10px] text-red-400 font-medium mb-1">فصيلة الدم</div>
            <div
              className="text-5xl font-black leading-none"
              style={{ color: "var(--color-critical)" }}
            >
              {data.bloodType}
            </div>
          </div>
        </div>
        {responseTimeMs !== null && (
          <div className="mt-3 text-xs text-red-400 flex items-center gap-1">
            <span>⚡</span>
            <span>تم الاستجابة في {responseTimeMs} مللي ثانية</span>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Allergies */}
        <div className="sanad-card-warning p-4 rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">⚠️</span>
            <span className="font-bold text-amber-800 text-sm">الحساسية المفرطة</span>
          </div>
          {data.allergies.length ? (
            <div className="flex flex-wrap gap-2">
              {data.allergies.map((a) => (
                <span key={a} className="badge badge-warning">{a}</span>
              ))}
            </div>
          ) : (
            <span className="text-xs text-amber-600">لا يوجد</span>
          )}
        </div>

        {/* Chronic Conditions */}
        <div className="sanad-card-info p-4 rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🩺</span>
            <span className="font-bold text-blue-800 text-sm">الأمراض المزمنة</span>
          </div>
          {data.chronicConditions.length ? (
            <div className="flex flex-wrap gap-2">
              {data.chronicConditions.map((c) => (
                <span key={c} className="badge badge-info">{c}</span>
              ))}
            </div>
          ) : (
            <span className="text-xs text-blue-600">لا يوجد</span>
          )}
        </div>
      </div>

      {/* Medications */}
      {data.currentMedications.length > 0 && (
        <div className="sanad-card p-4 rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💊</span>
            <span className="font-bold text-neutral-800 text-sm">الأدوية الحالية</span>
          </div>
          <div className="space-y-2">
            {data.currentMedications.map((m, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm text-neutral-700 py-1.5 border-b border-neutral-50 last:border-0"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: "var(--sanad-teal)" }}
                />
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Contacts */}
      <div className="sanad-card-success p-4 rounded-2xl">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">📞</span>
          <span className="font-bold text-green-800 text-sm">جهات الطوارئ</span>
        </div>
        <div className="space-y-2">
          {data.emergencyContacts.map((c, i) => (
            <div key={i} className="flex items-center justify-between bg-white rounded-xl px-3 py-2">
              <div>
                <span className="font-semibold text-neutral-800 text-sm">{c.name}</span>
                <span className="text-xs text-neutral-500 mr-2">({c.relation})</span>
              </div>
              <a
                href={`tel:${c.phone}`}
                className="text-sm font-mono font-bold text-green-700 hover:text-green-900"
              >
                {c.phone}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Notes */}
      {data.criticalNotes && (
        <div className="sanad-card-critical p-4 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🚨</span>
            <span className="font-bold text-red-800 text-sm">ملاحظات حرجة</span>
          </div>
          <p className="text-sm text-red-700 font-medium">{data.criticalNotes}</p>
        </div>
      )}
    </div>
  );
}
