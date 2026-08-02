import styles from "./PaySuccessModal.module.css";

const formatMoney = (n) => (n ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

const PaySuccessModal = ({ payout, onClose }) => {
  const { barber, totalServicesGross, totalServicesIncome, debtAmount, finalIncome } = payout;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pay-success-title"
      >
        <div className={styles.stamp}>Paid</div>

        <h2 id="pay-success-title" className={styles.title}>
          {barber.name} Paid Successfully
        </h2>

        <div className={styles.rows}>
          <div className={styles.row}>
            <span>Total Service</span>
            <span className="mono-figure">{formatMoney(totalServicesGross)} Birr</span>
          </div>
          <div className={styles.row}>
            <span>Total Barbers Money</span>
            <span className="mono-figure">{formatMoney(totalServicesIncome)} Birr</span>
          </div>
          <div className={styles.row}>
            <span>Debt</span>
            <span className={`mono-figure ${styles.negative}`}>
              {formatMoney(debtAmount)} Birr
            </span>
          </div>
          <div className={`${styles.row} ${styles.finalRow}`}>
            <span>Today's Total Payment</span>
            <span className="mono-figure">{formatMoney(finalIncome)} Birr</span>
          </div>
        </div>

        <button className={styles.closeBtn} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default PaySuccessModal;
