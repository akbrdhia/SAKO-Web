export default function StatusBadge({ status }) {
  const map = {
    Selesai: { bg: 'bg-green-100', text: 'text-green-700' },
    Menunggu: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
    Default: { bg: 'bg-gray-100', text: 'text-gray-700' },
  };
  const key = map[status] ? status : 'Default';

  return (
    <span className={`${map[key].bg} ${map[key].text} px-3 py-1 rounded-full text-sm font-semibold`}>{status}</span>
  );
}
