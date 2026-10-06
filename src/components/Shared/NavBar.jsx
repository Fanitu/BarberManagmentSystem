import styles from "./NavBar.module.css";

const WORKER_TABS = [
  { id: "service", label: "Service" },
  { id: "debt", label: "Debt" },
  { id: "today-revenue", label: "Today's Total Revenue" },
];

const ADMIN_TABS = [
  { id: "revenue", label: "Revenue" },
  { id: "payable-barbers", label: "payable-barbers" },
  { id: "running-cost", label: "Running-cost" },
];

const CHAIN_ADMIN_TABS = [
  { id: "overview", label: "All Shops Overview" },
  { id: "revenue", label: "All Shops Revenue" },
  { id: "payable", label: "Payable" },
  { id: "shops-detail", label: "Shops Graphic Overview" },
  { id: "reports", label: "Reports" },
];

const NavBar = ({ role, active, onChange, onMenuClick }) => {
  const tabs = role === "admin" ? ADMIN_TABS: role === "chain_admin" ? CHAIN_ADMIN_TABS : WORKER_TABS;

  return (
    <nav className={styles.nav}>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${active === tab.id ? styles.active : ""}`}
            onClick={() => onChange(tab.id)}
            aria-current={active === tab.id ? "page" : undefined}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {(role === "admin" || role === "chain_admin") && (
        <button className={styles.burger} onClick={onMenuClick} aria-label="Open menu">
          <span />
          <span />
          <span />
        </button>
      )}
    </nav>
  );
};

export default NavBar;
