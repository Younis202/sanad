import { useState } from "react";
import { Layout } from "@/components/layout";
import { useGetPhysicianDashboard, useCheckDrugInteraction } from "@workspace/api-client-react";
import { Search, User, AlertTriangle, Syringe, FileText, Activity, TestTube, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function Physician() {
  const [nationalId, setNationalId] = useState("1234567890");
  const [searchQuery, setSearchQuery] = useState("1234567890");
  const [newDrug, setNewDrug] = useState("");
  
  const { data, isLoading, isError } = useGetPhysicianDashboard(searchQuery, {
    query: { enabled: !!searchQuery, retry: false }
  });

  const checkDrugMutation = useCheckDrugInteraction();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (nationalId.trim()) setSearchQuery(nationalId.trim());
  };

  const handleCheckDrug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDrug.trim() || !data) return;
    
    checkDrugMutation.mutate({
      data: {
        newDrug: newDrug,
        existingDrugs: data.patient.currentMedications.map(m => m.name)
      }
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        
        {/* Search Header */}
        <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row gap-6 justify-between items-center bg-gradient-to-r from-primary/5 to-transparent">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-3">
              <StethoscopeIcon className="w-8 h-8 text-primary" />
              لوحة الطبيب
            </h1>
            <p className="text-muted-foreground mt-1">الرؤية الشاملة للملف الطبي الموحد</p>
          </div>
          
          <form onSubmit={handleSearch} className="relative w-full md:w-[400px]">
            <input
              type="text"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              placeholder="بحث برقم الهوية..."
              className="w-full ps-12 pe-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all font-semibold"
            />
            <Search className="absolute right-4 top-3.5 w-5 h-5 text-muted-foreground" />
            <button type="submit" className="hidden" />
          </form>
        </div>

        {isLoading && (
          <div className="h-64 flex items-center justify-center">
            <Activity className="w-10 h-10 text-primary animate-pulse" />
          </div>
        )}

        {isError && (
          <div className="bg-destructive/10 text-destructive p-6 rounded-xl flex items-center gap-4">
            <AlertTriangle className="w-8 h-8" />
            <div>
              <h3 className="font-bold text-lg">خطأ في جلب البيانات</h3>
              <p>تأكد من رقم الهوية (جرب 1234567890)</p>
            </div>
          </div>
        )}

        {data && !isLoading && !isError && (
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Right Column: Patient Profile & Summary */}
            <div className="lg:col-span-1 space-y-6">
              {/* Patient Card */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{data.patient.nameAr}</h2>
                    <p className="text-muted-foreground text-sm" dir="ltr">{data.patient.nationalId}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-muted p-3 rounded-xl">
                    <div className="text-xs text-muted-foreground mb-1">فصيلة الدم</div>
                    <div className="font-bold text-destructive" dir="ltr">{data.patient.bloodType}</div>
                  </div>
                  <div className="bg-muted p-3 rounded-xl">
                    <div className="text-xs text-muted-foreground mb-1">الجنس</div>
                    <div className="font-bold">{data.patient.gender}</div>
                  </div>
                  <div className="bg-muted p-3 rounded-xl">
                    <div className="text-xs text-muted-foreground mb-1">تاريخ الميلاد</div>
                    <div className="font-bold">{data.patient.dateOfBirth}</div>
                  </div>
                  <div className="bg-muted p-3 rounded-xl">
                    <div className="text-xs text-muted-foreground mb-1">مؤشر الخطر</div>
                    <div className="font-bold text-warning">{data.summary.riskScore}</div>
                  </div>
                </div>

                <div className="space-y-4 border-t border-border pt-4">
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-warning" /> الحساسية
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {data.patient.allergies.map((a, i) => (
                        <span key={i} className="bg-warning/10 text-warning-foreground px-2 py-1 rounded text-sm font-semibold border border-warning/20">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary" /> الأمراض المزمنة
                    </h4>
                    <ul className="space-y-1">
                      {data.patient.chronicConditions.map((c, i) => (
                        <li key={i} className="text-sm font-semibold before:content-['•'] before:ml-2 before:text-primary">{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-900">
                  <div className="text-blue-600 dark:text-blue-400 text-3xl font-bold mb-1">{data.summary.totalVisits}</div>
                  <div className="text-sm text-blue-800 dark:text-blue-300 font-medium">زيارات طبية</div>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900">
                  <div className="text-emerald-600 dark:text-emerald-400 text-3xl font-bold mb-1">{data.summary.hospitalsVisited}</div>
                  <div className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">منشآت مختلفة</div>
                </div>
              </div>
            </div>

            {/* Left Column: Timeline & Interactions */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Interaction Alerts from existing data */}
              {data.drugInteractionAlerts.length > 0 && (
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-destructive/10 border border-destructive rounded-2xl p-6">
                  <h3 className="text-destructive font-bold text-lg mb-4 flex items-center gap-2">
                    <ShieldAlertIcon className="w-6 h-6" />
                    تحذير تعارض دوائي حالي!
                  </h3>
                  <div className="space-y-3">
                    {data.drugInteractionAlerts.map((alert, i) => (
                      <div key={i} className="bg-white dark:bg-black/50 p-4 rounded-xl border-l-4 border-destructive shadow-sm">
                        <div className="font-bold flex items-center gap-2 mb-1">
                          <span dir="ltr">{alert.drug1}</span> <span className="text-muted-foreground text-sm">مع</span> <span dir="ltr">{alert.drug2}</span>
                        </div>
                        <p className="text-sm text-destructive-foreground">{alert.messageAr}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Drug Interaction Checker */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Syringe className="w-5 h-5 text-primary" />
                  كاشف التعارض الدوائي (وصف دواء جديد)
                </h3>
                <form onSubmit={handleCheckDrug} className="flex gap-4 mb-6">
                  <input
                    type="text"
                    value={newDrug}
                    onChange={(e) => setNewDrug(e.target.value)}
                    placeholder="اسم الدواء (مثل: Aspirin)"
                    className="flex-1 px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20"
                    dir="ltr"
                  />
                  <button 
                    type="submit"
                    disabled={checkDrugMutation.isPending || !newDrug}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {checkDrugMutation.isPending ? "جاري الفحص..." : "فحص التعارض"}
                  </button>
                </form>

                <AnimatePresence>
                  {checkDrugMutation.data && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className={`p-4 rounded-xl border ${checkDrugMutation.data.hasInteraction ? 'bg-destructive/10 border-destructive text-destructive-foreground' : 'bg-success/10 border-success text-success-foreground'}`}>
                        <div className="flex items-center gap-3 font-bold mb-2">
                          {checkDrugMutation.data.hasInteraction ? <AlertTriangle className="w-5 h-5 text-destructive" /> : <CheckCircle className="w-5 h-5 text-success" />}
                          {checkDrugMutation.data.hasInteraction ? "تحذير: يوجد تعارض دوائي!" : "آمن: لا يوجد تعارض دوائي مسجل"}
                        </div>
                        {checkDrugMutation.data.alerts.map((a, i) => (
                          <div key={i} className="text-sm mt-2 font-medium bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                            {a.messageAr}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Medical History Timeline */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  السجل الطبي الموحد
                </h3>
                
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                  {data.patient.medicalRecords.map((record, i) => (
                    <div key={record.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border bg-background shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-primary">{record.hospitalAr}</span>
                          <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded">
                            {format(new Date(record.date), 'yyyy/MM/dd')}
                          </span>
                        </div>
                        <h4 className="font-bold mb-1">{record.diagnosisAr}</h4>
                        <div className="text-sm text-muted-foreground mb-2">الطبيب: {record.doctorName} - {record.specialtyAr}</div>
                        <p className="text-sm bg-muted/50 p-2 rounded-lg leading-relaxed">{record.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

function StethoscopeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>
  );
}
