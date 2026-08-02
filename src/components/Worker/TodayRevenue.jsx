import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { listBarbers } from "../../api/barbers";
import {
  listServices,
  listTodayServiceLogs,
  updateServiceLog,
} from "../../api/services";
import { listTodayDebts } from "../../api/debts";
import styles from "./TodayRevenue.module.css";

const formatMoney = (n) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

const TodayRevenue = () => {
  const { token } = useAuth();
  const [logs, setLogs] = useState([]);
  const [debts, setDebts] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [editingLogId, setEditingLogId] = useState(null);
  const [editBarberId, setEditBarberId] = useState("");
  const [editServiceId, setEditServiceId] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editError, setEditError] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const loadTodayData = () => {
    setLoading(true);
    setError("");
    return Promise.all([listTodayServiceLogs(token), listTodayDebts(token)])
      .then(([logData, debtData]) => {
        setLogs(logData);
        setDebts(debtData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTodayData();
    Promise.all([listBarbers(token), listServices(token)])
      .then(([barberList, serviceList]) => {
        setBarbers(barberList);
        setServices(serviceList);
      })
      .catch((err) => setError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const startEdit = (log) => {
    setEditingLogId(log._id);
    setEditBarberId(log.barber?._id || "");
    setEditServiceId(log.service?._id || "");
    setEditPrice(String(log.price));
    setEditError("");
  };

  const cancelEdit = () => {
    setEditingLogId(null);
    setEditError("");
  };

  // Pre-fill price with the catalog price when the service is changed in edit mode.
  const handleEditServiceChange = (id) => {
    setEditServiceId(id);
    const svc = services.find((s) => s._id === id);
    if (svc) setEditPrice(String(svc.price));
  };

  const saveEdit = async (logId) => {
    setSavingEdit(true);
    setEditError("");
    try {
      await updateServiceLog(token, logId, {
        barberId: editBarberId,
        serviceId: editServiceId,
        price: Number(editPrice),
      });
      setEditingLogId(null);
      loadTodayData();
    } catch (err) {
      setEditError(err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  const totalRevenue = logs.reduce((sum, l) => sum + l.price, 0);
  const totalDebt = debts.reduce((sum, d) => sum + d.amount, 0);

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Today's Total Revenue</h2>

      {loading && <p className={styles.hint}>Loading today's entries…</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && (
        <>
          <div className={styles.block}>
            <h3 className={styles.blockTitle}>Services</h3>
            {logs.length === 0 ? (
              <p className={styles.hint}>No services recorded yet today.</p>
            ) : (
              <ul className={styles.list}>
                {logs.map((log) =>
                  editingLogId === log._id ? (
                    <li key={log._id} className={styles.editRow}>
                      <select
                        className={styles.editInput}
                        value={editBarberId}
                        onChange={(e) => setEditBarberId(e.target.value)}
                      >
                        <option value="" disabled>
                          Select a barber
                        </option>
                        {barbers.map((b) => (
                          <option key={b._id} value={b._id}>
                            {b.name}
                          </option>
                        ))}
                      </select>

                      <select
                        className={styles.editInput}
                        value={editServiceId}
                        onChange={(e) => handleEditServiceChange(e.target.value)}
                      >
                        <option value="" disabled>
                          Select a service
                        </option>
                        {services.map((s) => (
                          <option key={s._id} value={s._id}>
                            {s.name}
                          </option>
                        ))}
                      </select>

                      <input
                        className={`${styles.editInput} ${styles.mono}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                      />

                      {editError && <p className={styles.editError}>{editError}</p>}

                      <div className={styles.editActions}>
                        <button
                          className={styles.saveBtn}
                          onClick={() => saveEdit(log._id)}
                          disabled={savingEdit}
                        >
                          {savingEdit ? "Saving…" : "Update"}
                        </button>
                        <button className={styles.cancelBtn} onClick={cancelEdit}>
                          Cancel
                        </button>
                      </div>
                    </li>
                  ) : (
                    <li key={log._id} className={styles.row}>
                      <span>
                        {log.barber?.name} — {log.service?.name}
                      </span>
                      <span className={styles.rowRight}>
                        <span className={`${styles.mono} ${styles.amount}`}>
                          {formatMoney(log.price)}
                        </span>
                        <button
                          className={styles.updateBtn}
                          onClick={() => startEdit(log)}
                        >
                          Update
                        </button>
                      </span>
                    </li>
                  )
                )}
              </ul>
            )}
          </div>

          <div className={styles.block}>
            <h3 className={styles.blockTitle}>Debts</h3>
            {debts.length === 0 ? (
              <p className={styles.hint}>No debts recorded yet today.</p>
            ) : (
              <ul className={styles.list}>
                {debts.map((debt) => (
                  <li key={debt._id} className={styles.row}>
                    <span>{debt.barber?.name}</span>
                    <span className={`${styles.mono} ${styles.amountDebt}`}>
                      {formatMoney(debt.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      <div className={styles.totalBar}>
        <div className={styles.totalItem}>
          <span className={styles.totalLabel}>Today's Revenue</span>
          <span className={`${styles.mono} ${styles.totalValue} ${styles.revenueValue}`}>
            {formatMoney(totalRevenue)}
          </span>
        </div>
        <div className={styles.totalDivider} aria-hidden="true" />
        <div className={styles.totalItem}>
          <span className={styles.totalLabel}>Total Debt</span>
          <span className={`${styles.mono} ${styles.totalValue} ${styles.debtValue}`}>
            {formatMoney(totalDebt)}
          </span>
        </div>
      </div>
    </section>
  );
};

export default TodayRevenue;
