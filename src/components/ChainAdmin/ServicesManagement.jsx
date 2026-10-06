import { useEffect, useState } from "react";
import SuccessToast from "../Shared/SuccessToast";
import { listAllServices, createShopService, updateShopService, deleteShopService } from "../../api/chainService";
import CreateServiceModal from "./CreateServiceModal";
import { LoadingBanner, SkeletonCard } from "../Shared/SkeletonLine";
import styles from "./ServicesManagement.module.css";

const formatMoney = (n) => (n ?? 0).toLocaleString();

const ServicesManagement = ({ shops }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", shopPercent: "" });
  const [saving, setSaving] = useState(false);
  const [pending, setPending] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const load = () => {
    setLoading(true);
    listAllServices()
      .then(setGroups)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const startEdit = (service) => {
    setEditingId(service._id);
    setForm({ name: service.name, price: service.price, shopPercent: service.shopPercent });
  };

  const handleUpdate = async (e, id) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateShopService(id, {
        name: form.name,
        price: Number(form.price),
        shopPercent: Number(form.shopPercent),
      });
      setEditingId(null);
      load();
      setSuccessMessage("Service updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setPending((p) => ({ ...p, [id]: true }));
    try {
      await deleteShopService(id);
      load();
      setSuccessMessage("Service deleted successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setPending((p) => { const n = { ...p }; delete n[id]; return n; });
    }
  };

  const handleCreate = async (data) => {
    setCreating(true);
    try {
      await createShopService(data);
      setModalOpen(false);
      load();
      setSuccessMessage("Service created successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading && groups.length === 0) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>Services</h2>
        <LoadingBanner />
        <SkeletonCard lines={4} />
        <SkeletonCard lines={4} />
      </section>
    );
  }

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <h2 className={styles.title}>Services</h2>
        {error && <p className={styles.error}>{error}</p>}
        {loading && groups.length > 0 && <LoadingBanner text="Refreshing…" />}

        {groups.map(({ shop, services }) => (
          <div key={shop.id} className={styles.shopBlock}>
            <h3 className={styles.shopTitle}>{shop.name}</h3>
            <div className={styles.list}>
              {services.map((service) => (
                <div key={service._id} className={styles.row}>
                  <div className={styles.rowMain}>
                    <span className={styles.name}>{service.name}</span>
                    <span className={styles.meta}>
                      {formatMoney(service.price)} Birr · Shop keeps {service.shopPercent}%
                    </span>
                  </div>
                  <div className={styles.actions}>
                    <button className={styles.updateBtn} onClick={() => startEdit(service)}>Update</button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(service._id)}
                      disabled={!!pending[service._id]}
                    >
                      {pending[service._id] ? "Deleting…" : "Delete"}
                    </button>
                  </div>

                  {editingId === service._id && (
                    <form className={styles.editForm} onSubmit={(e) => handleUpdate(e, service._id)}>
                      <input
                        className={styles.input}
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Service name"
                        required
                      />
                      <input
                        className={styles.input}
                        type="number"
                        value={form.price}
                        onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                        placeholder="Price"
                        required
                      />
                      <input
                        className={styles.input}
                        type="number"
                        value={form.shopPercent}
                        onChange={(e) => setForm((f) => ({ ...f, shopPercent: e.target.value }))}
                        placeholder="Shop Percent"
                        required
                      />
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
              {services.length === 0 && <p className={styles.hint}>No services yet.</p>}
            </div>
          </div>
        ))}
        {!loading && groups.length === 0 && <p className={styles.hint}>No shops yet.</p>}
      </section>

      <button className={styles.fixedCreateBtn} onClick={() => setModalOpen(true)}>
        + Create Service
      </button>

      {modalOpen && (
        <CreateServiceModal
          shops={shops}
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreate}
          submitting={creating}
        />
      )}
      {successMessage && <SuccessToast message={successMessage} onDone={() => setSuccessMessage("")} />}
    </div>
  );
};

export default ServicesManagement;