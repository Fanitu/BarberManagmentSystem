import styles from "./Sidebar.module.css";


const iconProps = { viewBox: "0 0 24 24", width: "20", height: "20", fill: "none", stroke: "currentColor", strokeWidth: "2" };

const ITEMS = [
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
  { id: "service", label: "Service" },
  { id: "barbers-list", label: "Barbers List" },
  { id: "receptionists", label: "Receptionists" },
];

const Sidebar = ({ open, onClose, active, onChange }) => {
  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <aside className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>Menu</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close menu">
            ×
          </button>
        </div>

        <nav className={styles.list}>
          {ITEMS.map((item) => (
            <button
              key={item.id}
              className={`${styles.item} ${active === item.id ? styles.active : ""}`}
              onClick={() => {
                onChange(item.id);
                onClose();
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
