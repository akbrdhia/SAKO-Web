import SidebarLayout from '../layouts/SidebarLayout';

export default function Dashboard() {
  return (
    <SidebarLayout>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-3 gap-6 mb-8">
        <DashboardCard label="Total Simpanan" value="Rp 5.000.000" src="/assets/icon/icSavingPig.svg" />
        <DashboardCard label="Pinjaman Aktif" value="Rp 10.000.000" src="/assets/icon/icWallet.svg" />
        <DashboardCard label="Tanggal Simpanan" value="15 Nov 2025" src="/assets/icon/icCheckFilled.svg" />
      </div>
      <div className="bg-white rounded-xl p-8 shadow">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Transaksi Terakhir</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-gray-600">No</th>
              <th className="py-2 text-gray-600">Tanggal</th>
              <th className="py-2 text-gray-600">Jenis</th>
              <th className="py-2 text-gray-600">Jumlah</th>
              <th className="py-2 text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 text-gray-700">A-015</td>
              <td className="py-2 text-gray-700">1 Oktober 2025</td>
              <td className="py-2 text-gray-700">Simpanan Wajib</td>
              <td className="py-2 text-gray-700">Rp 400.000</td>
              <td className="py-2 text-green-600 font-semibold">Selesai</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 text-gray-700">A-015</td>
              <td className="py-2 text-gray-700">2 Oktober 2025</td>
              <td className="py-2 text-gray-700">Bayar Cicilan</td>
              <td className="py-2 text-gray-700">Rp 400.000</td>
              <td className="py-2 text-green-600 font-semibold">Selesai</td>
            </tr>
            <tr>
              <td className="py-2 text-gray-700">A-016</td>
              <td className="py-2 text-gray-700">15 Oktober 2025</td>
              <td className="py-2 text-gray-700">Simpanan Wajib</td>
              <td className="py-2 text-gray-700">Rp 500.000</td>
              <td className="py-2 text-yellow-500 font-semibold">Menunggu</td>
            </tr>
          </tbody>
        </table>
      </div>
    </SidebarLayout>
  );
}

// Card component for dashboard summary
function DashboardCard({ label, value, src }) {
  return (
    <div className="bg-white rounded-xl p-6 flex flex-row gap-4 items-center shadow">
      <img src={src} alt="icon" className="w-10 h-10" />
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-gray-500">{label}</div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
      </div>
    </div>
  );
}
