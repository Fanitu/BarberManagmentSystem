import styles from "./Sidebar.module.css";

const ITEMS = [
  { id: "monthly-expense", label: "Monthly expense" },
  { id: "service", label: "Service" },
  { id: "barbers-list", label: "Barbers List" },
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
