interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
  color: "blue" | "green" | "yellow" | "red";
}

const colorConfig = {
  blue: "bg-blue-50 text-blue-700",
  green: "bg-green-50 text-green-700",
  yellow: "bg-yellow-50 text-yellow-700",
  red: "bg-red-50 text-red-700",
};

export default function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className="card p-6">
      <div
        className={`w-12 h-12 rounded-lg ${colorConfig[color]} flex items-center justify-center text-xl mb-4`}
      >
        {icon}
      </div>
      <p className="text-neutral-600 text-sm font-medium">{label}</p>
      <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
    </div>
  );
}
