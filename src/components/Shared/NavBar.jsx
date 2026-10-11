import styles from "./NavBar.module.css";

const iconProps = { viewBox: "0 0 24 24", width: "20", height: "20", fill: "none", stroke: "currentColor", strokeWidth: "2" };


const WORKER_TABS = [{
    id: "service",
    label: "Service",
    icon: (
      <svg {...iconProps}>
        <path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 1 5.4-5.4l-2.2 2.2-2-2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "debt",
    label: "Debt",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="M9 10h6M9 14h4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "today-revenue",
    label: "Today",
    icon: (
      <svg {...iconProps}>
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const ADMIN_TABS = [
  {
    id: "revenue",
    label: "Revenue",
    icon: (
      <svg {...iconProps}>
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "payable-barbers",
    label: "Payable",
    icon: (
      <svg {...iconProps}>
        <rect x="2" y="6" width="20" height="13" rx="2" />
        <path d="M2 10h20M7 15h3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "running-cost",
    label: "Running Cost",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];


const CHAIN_ADMIN_TABS = [
 {
    id: "overview",
    label: "Overview",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
 {
    id: "revenue",
    label: "Revenue",
    icon: (
      <svg {...iconProps}>
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "payable",
    label: "Payable",
    icon: (
      <svg {...iconProps}>
        <rect x="2" y="6" width="20" height="13" rx="2" />
        <path d="M2 10h20M7 15h3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "barbers",
    label: "Barbers",
    icon: (
      <svg {...iconProps}>
        <circle cx="9" cy="7" r="3" />
        <path d="M3 21v-2a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 3.5a3 3 0 0 1 0 7" strokeLinecap="round" />
       <path d="M19.5 21v-2a4.5 4.5 0 0 0-3-4.24" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "shops-progress",
    label: "Progress",
    icon: (
      <svg {...iconProps}>
        <path d="M4 19V11M10 19V5M16 19v-7M4 19h16" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
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
           {tab.icon ? (
              <>
                <span className={styles.iconWrap}>{tab.icon}</span>
                <span className={styles.tabLabel}>{tab.label}</span>
              </>
            ) : (
              tab.label
            )}
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
