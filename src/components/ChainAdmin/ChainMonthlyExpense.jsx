import { useEffect, useState } from "react";
import { listMonthlyExpenses, createMonthlyExpense,updateMonthlyExpense,deleteMonthlyExpense } from "../../api/chainExpenses";
import CreateExpenseModal from "./CreateExpenseModal";
import SuccessToast from "../Shared/SuccessToast";
import { LoadingBanner, SkeletonGrid } from "../Shared/SkeletonLine";
import styles from "./ShopsDetailOverview.module.css";

const formatMoney = (n) => (n ?? 0).toLocaleString();

const ChainMonthlyExpense = ({ shops }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", price: "" });
  const [saving, setSaving] = useState(false);
  const [pending, setPending] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const load = () => {
    setLoading(true);
    listMonthlyExpenses()
      .then((data) => setGroups(data.shops))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (data) => {
    setSubmitting(true);
    try {
      await createMonthlyExpense(data);
      setModalOpen(false);
      load();
      setSuccessMessage("Monthly expense created successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (expense) => {
    setEditingId(expense.id);
    setEditForm({ name: expense.name, price: expense.price });
  };

  const handleUpdate = async (e, id) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateMonthlyExpense(id, { name: editForm.name, price: Number(editForm.price) });
      setEditingId(null);
      load();
      setSuccessMessage("Monthly expense updated successfully");
    } catch (err) {
      setError(err.message);
    } finally {
     setSaving(false);
    }
  };

const handleDelete = async (id) => {
    setPending((p) => ({ ...p, [id]: true }));
    try {
      await deleteMonthlyExpense(id);
      load();
      setSuccessMessage("Monthly expense deleted successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setPending((p) => { const n = { ...p }; delete n[id]; return n; });
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Monthly Expense</h2>
      {error && <p className={styles.error}>{error}</p>}
      {loading && <LoadingBanner text={groups.length === 0 ? "Loading…" : "Refreshing…"} />}

      {loading && groups.length === 0 && <SkeletonGrid count={2} lines={3} />}

      {groups.map((shop) => (
        <div key={shop.shopId} className={styles.chartCard}>
          <h3 className={styles.chartTitle}>{shop.shopName}</h3>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {shop.expenses.map((e) => (
              <li key={e.id} style={{ padding: "6px 0", borderBottom: "1px dashed #ece5d4" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.9rem" }}>
                  <span>{e.name}</span>
                  <span className="mono-figure">{formatMoney(e.price)} Birr</span>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                  <button
                    onClick={() => startEdit(e)}
                    style={{ padding: "4px 10px", background: "#2f5d3a", color: "#fff", border: "none", borderRadius: 6, fontSize: "0.78rem", cursor: "pointer" }}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(e.id)}
                    disabled={!!pending[e.id]}
                   style={{ padding: "4px 10px", background: "#fff", color: "#a33", border: "1px solid #a33", borderRadius: 6, fontSize: "0.78rem", cursor: "pointer" }}
                  >
                    {pending[e.id] ? "Deleting…" : "Delete"}
                  </button>
                </div>

                {editingId === e.id && (
                  <form onSubmit={(ev) => handleUpdate(ev, e.id)} style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                    <input
                      value={editForm.name}
                      onChange={(ev) => setEditForm((f) => ({ ...f, name: ev.target.value }))}
                      placeholder="Name"
                      required
                      style={{ padding: "6px 10px", border: "1px solid #d8cfba", borderRadius: 6 }}
                    />
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(ev) => setEditForm((f) => ({ ...f, price: ev.target.value }))}
                      placeholder="Price"
                      required
                      style={{ padding: "6px 10px", border: "1px solid #d8cfba", borderRadius: 6 }}
                    />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button type="submit" disabled={saving} style={{ flex: 1, padding: 8, background: "#2f5d3a", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
                        {saving ? "Saving…" : "Update"}
                      </button>
                      <button type="button" onClick={() => setEditingId(null)} style={{ flex: 1, padding: 8, background: "#fff", border: "1px solid #d8cfba", borderRadius: 6, cursor: "pointer" }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
             </li>
            ))}
          </ul>
        </div>
      ))}

      {!loading && groups.length === 0 && <p className={styles.hint}>No monthly expenses recorded yet.</p>}

      <button className={styles.fixedCreateBtn} style={{ marginTop: 16 }} onClick={() => setModalOpen(true)}>
        + Create Monthly Expense
      </button>

      {modalOpen && (
        <CreateExpenseModal
          title="Create Monthly Expense"
          shops={shops}
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreate}
          submitting={submitting}
        />
      )}
      {successMessage && <SuccessToast message={successMessage} onDone={() => setSuccessMessage("")} />}
    </section>
  );
};

export default ChainMonthlyExpense;