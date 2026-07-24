import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { listBarbers } from "../api/barbers";
import { listServices, submitServiceLog } from "../api/services";
import styles from "./ServiceForm.module.css";

const ServiceForm = () => {
  const { token } = useAuth();
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [barberId, setBarberId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([listBarbers(token), listServices(token)])
      .then(([barberList, serviceList]) => {
        setBarbers(barberList);
        setServices(serviceList);
      })
      .catch((err) => setStatus({ type: "error", message: err.message }));
  }, [token]);

  // Pre-fill price with the catalog price when a service is chosen.
  const handleServiceChange = (id) => {
    setServiceId(id);
    const svc = services.find((s) => s._id === id);
    if (svc) setPrice(String(svc.price));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });
    try {
      await submitServiceLog(token, {
        barberId,
        serviceId,
        price: Number(price),
      });
      setStatus({ type: "success", message: "Service submitted." });
      setBarberId("");
      setServiceId("");
      setPrice("");
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Service</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Barber
          <select
            className={styles.input}
            value={barberId}
            onChange={(e) => setBarberId(e.target.value)}
            required
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
        </label>

        <label className={styles.label}>
          Service
          <select
            className={styles.input}
            value={serviceId}
            onChange={(e) => handleServiceChange(e.target.value)}
            required
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
        </label>

        <label className={styles.label}>
          Price
          <input
            className={`${styles.input} ${styles.mono}`}
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>

        {status.message && (
          <p className={status.type === "error" ? styles.error : styles.success}>
            {status.message}
          </p>
        )}

        <button className={styles.submitBtn} type="submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit Service"}
        </button>
      </form>
    </section>
  );
};

export default ServiceForm;
