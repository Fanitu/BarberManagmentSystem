import styles from "../Admin/Sidebar.module.css";

const iconProps = { viewBox: "0 0 24 24", width: "20", height: "20", fill: "none", stroke: "currentColor", strokeWidth: "2" };

const ITEMS = [
  {
    id: "receptionists",
    label: "All Receptionist",
    icon: (
      <svg {...iconProps}>
      <circle cx="12" cy="8" r="4" />
        <path d="M4 20v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "running-costs",
    label: "Running Cost",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "monthly-expense",
    label: "Monthly Expense",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M3 9h18M8 2v4M16 2v4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
   ),
 },
  {
    id: "services",
    label: "Services",
    icon: (
      <svg {...iconProps}>
        <path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 1 5.4-5.4l-2.2 2.2-2-2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const ChainSidebar = ({ open, onClose, active, onChange }) => {
  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <aside className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>Menu</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close menu">×</button>
        </div>
        <nav className={styles.list}>
          {ITEMS.map((item) => (
            <button
              key={item.id}
              className={`${styles.item} ${active === item.id ? styles.active : ""}`}
              onClick={() => { onChange(item.id); onClose(); }}
            >
              <span className={styles.itemIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </div>
  );
};

export default ChainSidebar;