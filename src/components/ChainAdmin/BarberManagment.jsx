import { useEffect, useState } from "react";
import SuccessToast from "../Shared/SuccessToast";
import { listAllBarbers, updateBarber, deleteBarber,createBarberForShop } from "../../api/chainStaff";
import CreateBarberModal from "./CreateBarberModal";
import { LoadingBanner,SkeletonGrid,SkeletonCard } from "../Shared/SkeletonLine";
import styles from "./StaffManagement.module.css";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const BarbersManagement = ({shops}) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", paymentDay: 0 });
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const load = () => {
    setLoading(true);
    listAllBarbers()
      .then(setGroups)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const startEdit = (barber) => {
    setEditingId(barber._id);
    setForm({ name: barber.name, phone: barber.phone || "", paymentDay: barber.paymentDay });
  };

  const handleUpdate = async (e, id) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateBarber(id, form);
      setEditingId(null);
      load();
      setSuccessMessage("Barber updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async (data) => {
    setCreating(true);
    try {
      await createBarberForShop(data);
      setModalOpen(false);
      load();
      setSuccessMessage("Barber created successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBarber(id);
      load();
      setSuccessMessage("Barber deleted successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

   if (loading && groups.length === 0) {
      return (
        <section className={styles.section}>
          <h2 className={styles.title}>All Barbers</h2>
          <LoadingBanner />
          <SkeletonCard lines={4} />
          <SkeletonCard lines={4} />
        </section>
      );
    }

  return (
    <>
    <section className={styles.section}>
      <h2 className={styles.title}>All Barbers</h2>
      {error && <p className={styles.error}>{error}</p>}

      {groups.map(({ shop, barbers }) => (
        <div key={shop.id} className={styles.shopBlock}>
          <h3 className={styles.shopTitle}>{shop.name}</h3>
          <div className={styles.list}>
            {barbers.map((barber) => (
              <div key={barber._id} className={styles.row}>
                <div className={styles.rowMain}>
                  <span className={styles.name}>{barber.name}</span>
                  <span className={styles.meta}>
                    {barber.phone || "No phone"} · Pays {WEEKDAYS[barber.paymentDay]}
                  </span>
                </div>
                <div className={styles.actions}>
                  <button className={styles.updateBtn} onClick={() => startEdit(barber)}>Update</button>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(barber._id)}>Delete</button>
                </div>

                {editingId === barber._id && (
                  <form className={styles.editForm} onSubmit={(e) => handleUpdate(e, barber._id)}>
                    <input
                      className={styles.input}
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Name"
                      required
                    />
                    <input
                      className={styles.input}
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="Phone number"
                    />
                    <select
                      className={styles.input}
                      value={form.paymentDay}
                      onChange={(e) => setForm((f) => ({ ...f, paymentDay: Number(e.target.value) }))}
                    >
                      {WEEKDAYS.map((day, i) => (
                        <option key={i} value={i}>{day}</option>
                      ))}
                    </select>
                    <div className={styles.editActions}>
                      <button className={styles.updateBtn} type="submit" disabled={saving}>
                        {saving ? "Saving…" : "Update"}
                      </button>
                      <button className={styles.cancelBtn} type="button" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ))}
            {barbers.length === 0 && <p className={styles.hint}>No barbers yet.</p>}
          </div>
        </div>
      ))}
      <button className={styles.fixedCreateBtn} onClick={() => setModalOpen(true)}>
        + Create Barber
      </button>
      {modalOpen && (
        <CreateBarberModal shops={shops} onClose={() => setModalOpen(false)} onSubmit={handleCreate} submitting={creating} />
      )}
    </section>
    {successMessage && <SuccessToast message={successMessage} onDone={() => setSuccessMessage("")} />}
    </>
      
  );
};

export default BarbersManagement;