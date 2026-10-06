import { useEffect, useState } from "react";
import { listPayableBarbersToday, payBarberNow, listPayoutHistory, getPayoutDetail } from "../../api/chainPayout";
import { LoadingBanner,SkeletonGrid } from "../Shared/SkeletonLine";
import PaySuccessModal from "../Admin/PaySuccessModal";
import styles from "./ChainPayable.module.css";

const formatMoney = (n) => (n ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

const TodayPayable = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payingId, setPayingId] = useState(null);
  const [successPayout, setSuccessPayout] = useState(null);

  const load = () => {
    setLoading(true);
    listPayableBarbersToday()
      .then(setGroups)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handlePay = async (barberId) => {
    setPayingId(barberId);
    try {
      const result = await payBarberNow(barberId);
      setSuccessPayout(result);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setPayingId(null);
    }
  };

  if (loading && groups.length === 0) {
    return (
      <div>
        <LoadingBanner text="Loading today's payables…" />
        <SkeletonGrid count={2} lines={4} />
      </div>
    );
  }

  return (
    <div>
      {error && <p className={styles.error}>{error}</p>}
      {loading && groups.length > 0 && <LoadingBanner text="Refreshing…" />}
      {groups.length === 0 && <p className={styles.hint}>No barbers due for payout today.</p>}

      {groups.map(({ shop, payouts }) => (
        <div key={shop.id} className={styles.shopBlock}>
          <h3 className={styles.shopTitle}>{shop.name}</h3>
          <div className={styles.list}>
            {payouts.map(({ barber, totalServicesGross, totalServicesIncome, debtAmount, finalIncome }) => (
              <div key={barber.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.barberName}>{barber.name}</span>
                  <button
                    className={styles.payBtn}
                    onClick={() => handlePay(barber.id)}
                    disabled={payingId === barber.id}
                  >
                    {payingId === barber.id ? "Paying…" : "Pay Now"}
                  </button>
                </div>
                <div className={styles.rows}>
                  <div className={styles.row}><span>Total Services Gross</span><span className="mono-figure">{formatMoney(totalServicesGross)}</span></div>
                  <div className={styles.row}><span>Total Barber Income</span><span className="mono-figure">{formatMoney(totalServicesIncome)}</span></div>
                  {debtAmount > 0 && (
                    <div className={styles.row}><span>Unpaid Debt</span><span className={`mono-figure ${styles.negative}`}>-{formatMoney(debtAmount)}</span></div>
                  )}
                  <div className={`${styles.row} ${styles.finalRow}`}><span>Final Income</span><span className="mono-figure">{formatMoney(finalIncome)}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {successPayout && <PaySuccessModal payout={successPayout} onClose={() => setSuccessPayout(null)} />}
    </div>
  );
};

const PayoutHistory = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openKey, setOpenKey] = useState(null);
  const [detail, setDetail] = useState({});

  useEffect(() => {
    listPayoutHistory()
      .then(setRows)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const toggleDetail = async (row) => {
    const key = `${row.barber.id}|${row.paidAt}`;
    if (openKey === key) {
      setOpenKey(null);
      return;
    }
    setOpenKey(key);
    if (!detail[key]) {
      try {
        const data = await getPayoutDetail(row.barber.id, row.paidAt);
        setDetail((d) => ({ ...d, [key]: data }));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading && rows.length === 0) {
    return (
      <div>
        <LoadingBanner text="Loading payout history…" />
        <SkeletonGrid count={4} lines={3} />
      </div>
    );
  }

  return (
    <div>
      {error && <p className={styles.error}>{error}</p>}
      {rows.length === 0 && <p className={styles.hint}>No payouts yet.</p>}

      <div className={styles.list}>
        {rows.map((row) => {
          const key = `${row.barber.id}|${row.paidAt}`;
          const d = detail[key];
          return (
            <div key={key} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.barberName}>{row.barber.name} — {row.shop.name}</span>
                <span className={styles.paidAt}>{new Date(row.paidAt).toLocaleString()}</span>
              </div>
              <div className={styles.rows}>
                <div className={styles.row}><span>Total Services Gross</span><span className="mono-figure">{formatMoney(row.totalServicesGross)}</span></div>
                <div className={styles.row}><span>Barber Income</span><span className="mono-figure">{formatMoney(row.totalServicesIncome)}</span></div>
                {row.debtAmount > 0 && (
                  <div className={styles.row}><span>Debt</span><span className={`mono-figure ${styles.negative}`}>-{formatMoney(row.debtAmount)}</span></div>
                )}
                <div className={`${styles.row} ${styles.finalRow}`}><span>Final Income</span><span className="mono-figure">{formatMoney(row.finalIncome)}</span></div>
              </div>
              <button className={styles.detailBtn} onClick={() => toggleDetail(row)}>
                {openKey === key ? "Hide" : "Show Detail"}
              </button>
              {openKey === key && d && (
                <div className={styles.detailPanel}>
                  <h4 className={styles.detailHeading}>Services</h4>
                  <ul className={styles.detailList}>
                    {d.services.map((s) => (
                      <li key={s.id} className={styles.detailRow}>
                        <span>{s.serviceName}</span>
                        <span className="mono-figure">{formatMoney(s.price)} Birr (income {formatMoney(s.income)})</span>
                      </li>
                    ))}
                  </ul>
                  {d.debts.length > 0 && (
                    <>
                      <h4 className={styles.detailHeading}>Debt</h4>
                      <ul className={styles.detailList}>
                        {d.debts.map((deb) => (
                          <li key={deb.id} className={styles.detailRow}><span>Debt</span><span className="mono-figure">{formatMoney(deb.amount)} Birr</span></li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ChainPayable = () => {
  const [sub, setSub] = useState("today");

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Payable</h2>
      <div className={styles.subtabs}>
        <button className={`${styles.subtab} ${sub === "today" ? styles.active : ""}`} onClick={() => setSub("today")}>Today Payable Barbers</button>
        <button className={`${styles.subtab} ${sub === "history" ? styles.active : ""}`} onClick={() => setSub("history")}>Payout History</button>
      </div>
      {sub === "today" ? <TodayPayable /> : <PayoutHistory />}
    </section>
  );
};

export default ChainPayable;