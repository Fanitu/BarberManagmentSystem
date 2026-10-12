import { useEffect, useState } from "react";
import { listWorkers, activateWorker, deactivateWorker, deleteWorker } from "../../api/workers";
import { LoadingBanner,SkeletonGrid } from "../Shared/SkeletonLine";
import styles from "./ReceptionistsSection.module.css";

const ReceptionistsSection = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    listWorkers()
      .then(setWorkers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleActivate = async (id) => {
    try {
      await activateWorker(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await deactivateWorker(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteWorker(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <>
        <LoadingBanner/>
        <SkeletonGrid/>
        </>;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Receptionist</h2>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.list}>
        {workers.map((worker) => (
          <div key={worker._id} className={styles.row}>
            <div className={styles.rowMain}>
              <span className={styles.name}>{worker.name}</span>
              <span className={`${styles.statusBadge} ${worker.isActive ? styles.active : styles.pending}`}>
                {worker.isActive ? "Active" : "Pending Approval"}
              </span>
            </div>
            <div className={styles.actions}>
              {worker.isActive ? (
                <button className={styles.updateBtn} onClick={() => handleDeactivate(worker._id)}>
                  Deactivate
                </button>
              ) : (
                <button className={styles.updateBtn} onClick={() => handleActivate(worker._id)}>
                  Activate
                </button>
              )}
              <button className={styles.deleteBtn} onClick={() => handleDelete(worker._id)}>Delete</button>
            </div>
          </div>
        ))}
        {workers.length === 0 && <p className={styles.hint}>No receptionists yet.</p>}
      </div>
    </section>
  );
};

export default ReceptionistsSection;