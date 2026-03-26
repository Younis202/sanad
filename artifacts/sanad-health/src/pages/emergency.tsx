import { useState } from "react";
import { Layout } from "@/components/layout";
import { useGetEmergencyData } from "@workspace/api-client-react";
import { Search, AlertTriangle, Droplet, Phone, Pill, Activity, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function Emergency() {
  const [nationalId, setNationalId] = useState("1234567890");
  const [searchQuery, setSearchQuery] = useState("1234567890");
  
  // The hook from generated API client
  const { data, isLoading, isError, isFetching } = useGetEmergencyData(searchQuery, {
    query: {
      enabled: !!searchQuery,
      retry: false
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (nationalId.trim()) {
      setSearchQuery(nationalId.trim());
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-destructive text-destructive-foreground rounded-3xl p-8 shadow-2xl shadow-destructive/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-20 -mt-20"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <ShieldAlertIcon className="w-10 h-10" />
                <h1 className="text-3xl font-display font-bold">واجهة المسعف</h1>
              </div>
              <p className="text-destructive-foreground/80 text-lg">
                الوصول السريع للبيانات الحرجة لإنقاذ الحياة
              </p>
            </div>
            
            <form onSubmit={handleSearch} className="relative w-full md:w-96">
              <input
                type="text"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                placeholder="أدخل رقم الهوية الوطنية..."
                className="w-full pl-12 pr-6 py-4 rounded-xl bg-white text-slate-900 text-lg font-bold shadow-inner focus:outline-none focus:ring-4 focus:ring-white/30 transition-all placeholder:font-normal placeholder:text-slate-400"
                dir="rtl"
              />
              <button 
                type="submit"
                disabled={isFetching}
                className="absolute left-2 top-2 bottom-2 aspect-square bg-destructive text-white rounded-lg flex items-center justify-center hover:bg-destructive/90 transition-colors disabled:opacity-50"
              >
                {isFetching ? <Activity className="w-5 h-5 animate-pulse" /> : <Search className="w-5 h-5" />}
              </button>
            </form>
          </div>
        </div>

        {/* Content Area */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-4">
            <Activity className="w-12 h-12 animate-pulse text-destructive" />
            <p className="font-bold text-lg animate-pulse">جاري جلب السجل الحرج...</p>
          </div>
        )}

        {isError && (
          <div className="bg-red-50 dark:bg-red-950/20 text-destructive p-8 rounded-2xl text-center border border-destructive/20">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-80" />
            <h3 className="text-xl font-bold mb-2">لم يتم العثور على المريض</h3>
            <p className="opacity-80">تأكد من إدخال رقم الهوية بشكل صحيح (جرب 1234567890)</p>
          </div>
        )}

        {data && !isLoading && !isError && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Meta bar */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Clock className="w-4 h-4 text-success" />
                <span className="text-success">تم الاستجابة في &lt; 1 ثانية</span>
              </div>
              <div className="text-sm font-semibold text-muted-foreground">
                المريض: <span className="text-foreground">{data.nameAr}</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              
              {/* Blood Type - Most Prominent */}
              <div className="bg-red-500 text-white rounded-2xl p-6 shadow-xl shadow-red-500/20 flex items-center justify-between col-span-full md:col-span-1">
                <div>
                  <h3 className="text-red-100 font-semibold mb-1">فصيلة الدم</h3>
                  <div className="text-5xl font-display font-black" dir="ltr">{data.bloodType}</div>
                </div>
                <Droplet className="w-16 h-16 opacity-50" />
              </div>

              {/* Allergies */}
              <div className="bg-orange-500 text-white rounded-2xl p-6 shadow-xl shadow-orange-500/20 flex items-start justify-between col-span-full md:col-span-1">
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-6 h-6 text-orange-200" />
                    <h3 className="text-orange-100 font-semibold text-lg">الحساسية المفرطة</h3>
                  </div>
                  {data.allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {data.allergies.map((allergy, i) => (
                        <span key={i} className="bg-white/20 px-4 py-2 rounded-lg font-bold text-lg backdrop-blur-sm">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-orange-200">لا يوجد حساسية مسجلة</span>
                  )}
                </div>
              </div>

              {/* Chronic Conditions */}
              <div className="bg-card border-2 border-warning/50 rounded-2xl p-6 shadow-lg col-span-full md:col-span-1">
                <div className="flex items-center gap-2 mb-4 text-warning">
                  <Activity className="w-6 h-6" />
                  <h3 className="font-bold text-lg">الأمراض المزمنة</h3>
                </div>
                {data.chronicConditions.length > 0 ? (
                  <ul className="space-y-3">
                    {data.chronicConditions.map((cond, i) => (
                      <li key={i} className="flex items-center gap-3 font-semibold text-foreground bg-muted/50 p-3 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-warning"></div>
                        {cond}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-muted-foreground">لا يوجد أمراض مزمنة مسجلة</span>
                )}
              </div>

              {/* Current Medications */}
              <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 shadow-lg col-span-full md:col-span-1">
                <div className="flex items-center gap-2 mb-4 text-primary">
                  <Pill className="w-6 h-6" />
                  <h3 className="font-bold text-lg">الأدوية الحالية</h3>
                </div>
                {data.currentMedications.length > 0 ? (
                  <ul className="space-y-3">
                    {data.currentMedications.map((med, i) => (
                      <li key={i} className="flex items-center gap-3 font-semibold text-foreground bg-primary/5 p-3 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        {med}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-muted-foreground">لا يوجد أدوية حالية</span>
                )}
              </div>

              {/* Emergency Contacts */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl col-span-full">
                <div className="flex items-center gap-2 mb-6 text-slate-300">
                  <Phone className="w-6 h-6" />
                  <h3 className="font-bold text-lg">جهات الاتصال للطوارئ</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {data.emergencyContacts.map((contact, i) => (
                    <a key={i} href={`tel:${contact.phone}`} className="flex items-center justify-between bg-white/10 hover:bg-white/20 p-4 rounded-xl transition-colors group">
                      <div>
                        <div className="font-bold text-lg mb-1">{contact.name}</div>
                        <div className="text-slate-400 text-sm">{contact.relation}</div>
                      </div>
                      <div className="bg-white/10 p-3 rounded-lg group-hover:bg-success group-hover:text-white transition-colors" dir="ltr">
                        {contact.phone}
                      </div>
                    </a>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}

function ShieldAlertIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
