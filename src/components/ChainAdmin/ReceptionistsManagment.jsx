import { useEffect, useState } from "react";
import SuccessToast from "../Shared/SuccessToast";
import { listAllWorkers,activateWorker, deactivateWorker, deleteWorker } from "../../api/chainStaff";
import { LoadingBanner,SkeletonGrid,SkeletonCard } from "../Shared/SkeletonLine";
import styles from "./StaffManagement.module.css";

const ReceptionistsManagement = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pending,setPending ] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const load = () => {
    setLoading(true);
    listAllWorkers()
      .then(setGroups)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleActivate = async (id) => {
    setPending((p)=> ({ ...p, [id]: "activate" }));
    try {
      await activateWorker(id);
      load();
      setSuccessMessage("Receptionist activated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setPending((p)=> { const n = { ...p};delete n[id];return n; });
    }
  };

  const handleDeactivate = async (id) => {
    setPending((p)=> ({ ...p, [id]: "deactivate" }));
    try {
      await deactivateWorker(id);
      load();
      setSuccessMessage("Receptionist deactivated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setPending((p)=> { const n = { ...p};delete n[id];return n; });
    }
  };

  const handleDelete = async (id) => {
    setPending((p)=> ({ ...p, [id]: "delete" }));
    try {
      await deleteWorker(id);
      load();
      setSuccessMessage("Receptionist deleted successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setPending((p)=> { const n = { ...p};delete n[id];return n; });
    }
  };

  if (loading && groups.length === 0) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>All Receptionists</h2>
        <LoadingBanner />
        <SkeletonCard lines={4} />
        <SkeletonCard lines={4} />
      </section>
    );
  }

  return (
  <>
    <section className={styles.section}>
      <h2 className={styles.title}>All Receptionists</h2>
      {error && <p className={styles.error}>{error}</p>}

      {groups.map(({ shop, workers }) => (
        <div key={shop.id} className={styles.shopBlock}>
          <h3 className={styles.shopTitle}>{shop.name}</h3>
          <div className={styles.list}>
            {workers.map((worker) => (
              <div key={worker._id} className={styles.row}>
                <div className={styles.rowMain}>
                  <span className={styles.name}>{worker.name}</span>
                  <span className={`${styles.statusBadge} ${worker.isActive ? styles.active : styles.inactive}`}>
                    {worker.isActive ? "Active" : "Pending Approval"}
                  </span>
                </div>
                <div className={styles.actions}>
                  {worker.isActive ? (
                    <button
                      className={styles.updateBtn}
                      onClick={() => handleDeactivate(worker._id)}
                      disabled={!!pending[worker._id]}
                    >
                      {pending[worker._id] === "deactivate" ? "Deactivating…" : "Deactivate"}
                    </button>
                  ):(
                    <button
                      className={styles.updateBtn}
                      onClick={() => handleActivate(worker._id)}
                      disabled={!!pending[worker._id]}
                    >
                      {pending[worker._id] === "activate" ? "Activating…" : "Activate"}
                    </button>
                  )}
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(worker._id)}
                    disabled={!!pending[worker._id]}
                  >
                    {pending[worker._id] === "delete" ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
            {workers.length === 0 && <p className={styles.hint}>No receptionists yet.</p>}
          </div>
        </div>
      ))}
    </section>
    {successMessage && <SuccessToast message={successMessage} onDone={() => setSuccessMessage("")} />}
    </>
  );
};

export default ReceptionistsManagement;