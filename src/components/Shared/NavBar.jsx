import styles from "./NavBar.module.css";

const WORKER_TABS = [
  { id: "service", label: "Service" },
  { id: "debt", label: "Debt" },
  { id: "today-revenue", label: "Today's Total Revenue" },
];

const ADMIN_TABS = [
  { id: "revenue", label: "Revenue" },
  { id: "payable-barbers", label: "ዝኽፈል ባርበር" },
  { id: "running-cost", label: "Running-cost" },
];

const NavBar = ({ role, active, onChange, onMenuClick }) => {
  const tabs = role === "admin" ? ADMIN_TABS : WORKER_TABS;

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

      {role === "admin" && (
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
