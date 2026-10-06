import { useEffect, useState } from "react";
import { listMyShops, createShop, enterShopView } from "../../api/chainAdmin";
import { formatMoney } from "../Admin/RevenueView";
import SuccessToast from "../Shared/SuccessToast";
import { LoadingBanner,SkeletonGrid } from "../Shared/SkeletonLine";
import styles from "./ChainOvervie.module.css";

const ChainOverview = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const load = () => {
    setLoading(true);
    listMyShops()
      .then((data) => setShops(data.shops))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createShop({ name, ownerName, ownerPhone });
      setName(""); setOwnerName(""); setOwnerPhone("");
      setModalOpen(false);
      load();
      setSuccessMessage("You created a new shop successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const openShop = async (shopId) => {
    try {
      await enterShopView(shopId);
      sessionStorage.setItem("chainAdminViewing", "1");
      window.location.href = "/";
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>All Shops Overview</h2>
      {error && <p className={styles.error}>{error}</p>}
      {loading && <LoadingBanner text="Loading shops…" />}

      <div className={styles.grid}>
        {loading && shops.length === 0 && <SkeletonGrid count={3} />}
        {shops.map((shop) => (
          <div key={shop.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.shopName}>{shop.name}</span>
              <span className={`${styles.trend} ${shop.trend === "up" ? styles.up : styles.down}`}>
                {shop.trend === "up" ? "▲" : "▼"} {Math.abs(shop.changePercent)}%
              </span>
            </div>
            <div className={styles.row}>
              <span>Today's Revenue</span>
              <span className="mono-figure">{formatMoney(shop.todayRevenue)} Birr</span>
            </div>
            <div className={styles.row}>
              <span>Best Barber</span>
              <span>{shop.bestBarber ? `${shop.bestBarber.name} (${formatMoney(shop.bestBarber.revenue)} Birr)` : "—"}</span>
            </div>
            <button className={styles.detailBtn} onClick={() => openShop(shop.id)}>
              Detail Overview
            </button>
          </div>
        ))}
        {shops.length === 0 && <p className={styles.hint}>No shops yet.</p>}
      </div>

      <button className={styles.fixedCreateBtn} onClick={() => setModalOpen(true)}>
        + Create Shop
      </button>

      {modalOpen && (
        <div className={styles.backdrop} onClick={() => setModalOpen(false)}>
          <form className={styles.modal} onClick={(e) => e.stopPropagation()} onSubmit={handleCreate}>
            <h3>New Shop</h3>
            <input className={styles.input} placeholder="Shop Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input className={styles.input} placeholder="Owner Name" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
            <input className={styles.input} placeholder="Owner Phone" value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} />
            <button className={styles.detailBtn} type="submit" disabled={submitting}>
              {submitting ? "Creating…" : "Create Shop"}
            </button>
          </form>
        </div>
      )}
      {successMessage && <SuccessToast message={successMessage} onDone={() => setSuccessMessage("")} />}
    </section>
  );
};

export default ChainOverview;