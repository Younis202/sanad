import { Router, Route, Switch } from "wouter";
import Sidebar from "./components/system/Sidebar";
import HomePage from "./contexts/home";
import EmergencyContext from "./contexts/emergency/page";
import ClinicalDashboard from "./contexts/clinical/dashboard";
import CitizenContext from "./contexts/citizen/page";
import NationalDashboard from "./contexts/national/dashboard";

const base = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

export default function App() {
  return (
    <Router base={base}>
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          direction: "rtl",
          background: "var(--surface-base)",
          padding: "16px",
          gap: "16px",
          alignItems: "flex-start",
        }}
      >
        <Sidebar />
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflowX: "hidden",
            minWidth: 0,
            minHeight: "calc(100vh - 32px)",
          }}
        >
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/emergency" component={EmergencyContext} />
            <Route path="/clinical/dashboard" component={ClinicalDashboard} />
            <Route path="/citizen" component={CitizenContext} />
            <Route path="/national/dashboard" component={NationalDashboard} />
            <Route>
              <div className="flex flex-col items-center justify-center h-64 gap-4 text-neutral-400">
                <div className="text-6xl">🔍</div>
                <div className="text-xl font-bold">الصفحة غير موجودة</div>
                <a href="/" className="text-sm underline text-cyan-600">العودة للرئيسية</a>
              </div>
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}
