import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import Header from "./components/Shared/Header";
import LoginModal from "./components/Shared/LoginModal";
import NavBar from "./components/Shared/NavBar";
import Sidebar from "./components/Admin/Sidebar";
import ChainSidebar from "./components/ChainAdmin/ChainSidebar";
import ServiceForm from "./components/Worker/ServiceForm";
import DebtForm from "./components/Worker/DebtForm";
import TodayRevenue from "./components/Worker/TodayRevenue";
import RevenueView from "./components/Admin/RevenueView";
import PayableBarbers from "./components/Admin/PayableBarbers";
import RunningCostForm from "./components/Admin/RunningCostForm";
import MonthlyExpenseSection from "./components/Admin/MonthlyExpenseSection";
import ServiceSection from "./components/Admin/ServiceSection";
import BarbersListSection from "./components/Admin/BarbersListSection";
import ReceptionistsSection from "./components/Admin/ReceptionistsSection";
import PendingApprovalBanner from "./components/Worker/PendingApprovalBanner";
import AdminSetupPage from "./components/AdminSetup/AdminSetupPage";
import ChainAdminSetupPage from "./components/ChainAdmin/ChainAdminSetupPage";
import ChainOverview from "./components/ChainAdmin/ChainAdminOverview";
import AllShopsRevenue from "./components/ChainAdmin/AllShopsRevenue";
import ChainPayable from "./components/ChainAdmin/ChainPayable";
import ShopsDetailOverview from "./components/ChainAdmin/ShopsDetailOverview";
import BarbersManagement from "./components/ChainAdmin/BarberManagment";
import ReceptionistsManagement from "./components/ChainAdmin/ReceptionistsManagment";
import ChainReports from "./components/ChainAdmin/Reports/ChainReports";
import ShopsProgress from "./components/ChainAdmin/ShopsProgress";
import Settings from "./components/ChainAdmin/Settings";
import RunningCostSection from "./components/ChainAdmin/RunningCostSection";
import ChainMonthlyExpense from "./components/ChainAdmin/ChainMonthlyExpense";
import OverallProfit from "./components/ChainAdmin/OverallProfit";
import ServiceManagement from "./components/ChainAdmin/ServicesManagement";
import BottomNav from "./components/ChainAdmin/BottomNav";
import { exitShopView } from "./api/chainAdmin";
import "./App.css";

const ADMIN_NAV_VIEWS = ["revenue", "payable-barbers", "running-cost"];
const CHAIN_ADMIN_NAV_VIEWS = ["overview", "revenue", "payable", "barbers","shops-progress"];
const DEFAULT_VIEW = { worker: "service", admin: "revenue", chain_admin: "overview" };
const CHAIN_BOTTOM_NAV_VIEWS = ["shops-detail", "reports", "overall-profit", "settings"];

function App() {

 const chainSetupMatch = window.location.pathname.match(/^\/chainadmin-setup\/(.+)$/);
  if (chainSetupMatch) {
    return <ChainAdminSetupPage token={chainSetupMatch[1]} />;
  }

  const setupMatch = window.location.pathname.match(/^\/admin-setup\/(.+)$/);
  if (setupMatch) {
    return <AdminSetupPage token={setupMatch[1]} />;
  }

  const {
    user,
    role,
    isAuthenticated,
    isActiveWorker,
    login,
    logout,
    loginError,
    loggingIn,
    clearLoginError,
  } = useAuth();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState(null);
  
  // ✅ NEW: Track auth loading state
  const [authLoading, setAuthLoading] = useState(true);

  const [viewingAsChainAdmin, setViewingAsChainAdmin] = useState(
    sessionStorage.getItem("chainAdminViewing") === "1"
  );

  const backToOverview = async () => {
    await exitShopView();
    sessionStorage.removeItem("chainAdminViewing");
    window.location.href = "/";
  };

 const [chainShopsForModal, setChainShopsForModal] = useState([]);
  useEffect(() => {
    if (role === "chain_admin") {
      import("./api/chainAdmin").then(({ listMyShops }) =>
        listMyShops().then((data) => setChainShopsForModal(data.shops.map((s) => ({ id: s.id, name: s.name }))))
      );
    }
  }, [role]);

  // ✅ Land on the right default tab as soon as we know the role.
  useEffect(() => {
    if (role && !activeView) {
      setActiveView(DEFAULT_VIEW[role]);
    }
    if (!isAuthenticated) {
      setActiveView(null);
    }
    
    // ✅ Auth check is complete
    setAuthLoading(false);
    
    // ✅ Hide loading screen after auth check
    const hideLoader = () => {
      const loader = document.getElementById('loading-screen');
      if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => {
          loader.classList.add('removed');
        }, 700);
      }
    };
    
    // Small delay to ensure DOM is ready
    setTimeout(hideLoader, 200);
    
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

  // ✅ Show nothing while auth is loading (prevents flash)
  if (authLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f6f1e7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Loading screen is already showing, just keep background matching */}
      </div>
    );
  }

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
            active={
              role === "worker" ||
              ADMIN_NAV_VIEWS.includes(activeView) ||
             CHAIN_ADMIN_NAV_VIEWS.includes(activeView) ||
              CHAIN_BOTTOM_NAV_VIEWS.includes(activeView)
                ? activeView
                : null
            }
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

          {role === "chain_admin" && (
            <ChainSidebar
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              active={activeView}
              onChange={setActiveView}
            />
          )}

          {viewingAsChainAdmin && role === "admin" && (
            <button className="backToOverviewBtn" onClick={backToOverview}>
              ← Back to All Shops Overview
            </button>
          )}

          <main>
           <div style={{ paddingBottom: role === "chain_admin" ? "24px" : 0 }}></div>
            {role === "worker" && (
              <>
                 {!isActiveWorker ? (
                  <PendingApprovalBanner />
                ) : (
                  <>
                    {activeView === "service" && <ServiceForm />}
                    {activeView === "debt" && <DebtForm />}
                    {activeView === "today-revenue" && <TodayRevenue />}
                  </>
                )}
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
                {activeView === "receptionists" && <ReceptionistsSection />}
              </>
            )}

            {role === "chain_admin" && (
              <>
                {activeView === "overview" && <ChainOverview />}
                {activeView === "revenue" && <AllShopsRevenue />}
                {activeView === "payable" && <ChainPayable />}
                {activeView === "shops-detail" && <ShopsDetailOverview />}
                {activeView === "barbers" && <BarbersManagement shops={chainShopsForModal} />}
                {activeView === "receptionists" && <ReceptionistsManagement />}
                {activeView === "reports" && <ChainReports />}
                {activeView === "shops-progress" && <ShopsProgress />}
                {activeView === "settings" && <Settings />}
                {activeView === "running-costs" && <RunningCostSection shops={chainShopsForModal}/>}
                {activeView === "monthly-expense" && <ChainMonthlyExpense shops={chainShopsForModal} />}
                {activeView === "overall-profit" && <OverallProfit />}
                {activeView === "services" && <ServiceManagement shops={chainShopsForModal} />}
              </>
           )}
          <div/>
          </main>
          {role === "chain_admin" && (
           <BottomNav active={activeView} onChange={setActiveView} />
          )}
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