import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const formatBirr = (n) => `${n.toLocaleString()} Birr`;

const ReportChart = ({ columns, rows }) => {
  const valueKey = columns.find((c) => c.type === "number")?.key || "revenue";

  return (
    <ResponsiveContainer width="100%" height={360}>
    <BarChart data={rows} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12 }}
          interval={0}
          angle={-35}
          textAnchor="end"
          height={70}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip formatter={(value) => formatBirr(value)} />
        <Bar dataKey={valueKey} fill="#166534" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ReportChart;