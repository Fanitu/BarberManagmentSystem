import styles from "../Admin/Sidebar.module.css";

const ITEMS = [
  { id: "barbers", label: "Barbers" },
  { id: "receptionists", label: "All Receptionist" },
  {id: "shop-progress", label: "Shops Progress"},
  {id: "running-cost", label: "Running Cost"},
  {id:"monthly-expenses", label: "Monthly Expenses"},
  {id:"overall-profit", label: "Overall Profit"},
  {id:"services", label: "Services"},
  { id: "settings", label: "Settings" },
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
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </div>
  );
};

export default ChainSidebar;