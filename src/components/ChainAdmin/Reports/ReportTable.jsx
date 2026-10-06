import styles from "./ReportTable.module.css";

const ReportTable = ({ columns, rows }) => (
  <div className={styles.wrapper}>
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key} className={styles.th}>
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className={styles.row}>
            {columns.map((c) => (
              <td key={c.key} className={styles.td}>
                {c.format === "currency"
                  ? `${(row[c.key] ?? 0).toLocaleString()} Birr`
                  : c.format === "count"
                  ? (row[c.key] ?? 0).toLocaleString()
                  : row[c.key] ?? "—"}
              </td>
            ))}
          </tr>
        ))}
        {rows.length === 0 && (
          <tr>
            <td colSpan={columns.length} className={styles.empty}>
              No data for this range.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default ReportTable;