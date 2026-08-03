import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import Header from "./components/Shared/Header";
import LoginModal from "./components/Shared/LoginModal";
import NavBar from "./components/Shared/NavBar";
import Sidebar from "./components/Admin/Sidebar";
import ServiceForm from "./components/Worker/ServiceForm";
import DebtForm from "./components/Worker/DebtForm";
import TodayRevenue from "./components/Worker/TodayRevenue";
import RevenueView from "./components/Admin/RevenueView";
import PayableBarbers from "./components/Admin/PayableBarbers";
import RunningCostForm from "./components/Admin/RunningCostForm";
import MonthlyExpenseSection from "./components/Admin/MonthlyExpenseSection";
import ServiceSection from "./components/Admin/ServiceSection";
import BarbersListSection from "./components/Admin/BarbersListSection";
import "./App.css";

const ADMIN_NAV_VIEWS = ["revenue", "payable-barbers", "running-cost"];
const DEFAULT_VIEW = { worker: "service", admin: "revenue" };

function App() {
  const {
    user,
    role,
    isAuthenticated,
    login,
    logout,
    loginError,
    loggingIn,
    clearLoginError,
  } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState(null);

  // Land on the right default tab as soon as we know the role.
  useEffect(() => {
    if (role && !activeView) {
      setActiveView(DEFAULT_VIEW[role]);
    }
    if (!isAuthenticated) {
      setActiveView(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, isAuthenticated]);

  const handleLoginSubmit = async (credentials) => {
    const data = await login(credentials);
    if (data) {
      setActiveView(DEFAULT_VIEW[data.user.role]);
      setModalOpen(false);
    }
  };


  const closeModal = () => {
    setModalOpen(false);
    clearLoginError();
  };

  return (
    <div className="app">
      <Header
        user={user}
        role={role}
        onLoginClick={() => setModalOpen(true)}
        onLogout={logout}
      />

      {isAuthenticated && activeView ? (
        <>
          <NavBar
            role={role}
            active={role === "worker" || ADMIN_NAV_VIEWS.includes(activeView) ? activeView : null}
            onChange={setActiveView}
            onMenuClick={() => setSidebarOpen(true)}
          />

          {role === "admin" && (
            <Sidebar
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              active={activeView}
              onChange={setActiveView}
            />
          )}

          <main>
            {role === "worker" && (
              <>
                {activeView === "service" && <ServiceForm />}
                {activeView === "debt" && <DebtForm />}
                {activeView === "today-revenue" && <TodayRevenue />}
              </>
            )}

            {role === "admin" && (
              <>
                {activeView === "revenue" && <RevenueView />}
                {activeView === "payable-barbers" && <PayableBarbers />}
                {activeView === "running-cost" && <RunningCostForm />}
                {activeView === "monthly-expense" && <MonthlyExpenseSection />}
                {activeView === "service" && <ServiceSection />}
                {activeView === "barbers-list" && <BarbersListSection />}
              </>
            )}
          </main>
        </>
      ) : (
        <main className="empty-state">
          <p>Log in with your name, password, and shop's barber code to get started.</p>
          <button className="loginBtn" onClick={() => setModalOpen(true)}>
            Log in
          </button>
        </main>
      )}

      {modalOpen && (
        <LoginModal
          onClose={closeModal}
          onSubmit={handleLoginSubmit}
          error={loginError}
          loading={loggingIn}
        />
      )}
    </div>
  );
}

export default App;
