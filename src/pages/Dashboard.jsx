import { useNavigate } from 'react-router-dom';
import SidebarLayout from '../layouts/SidebarLayout';
import { formatCurrency } from '../utils/format';
import StatusBadge from '../components/StatusBadge';

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <SidebarLayout>
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 min-w-0">
          <DashboardCard label="Total Simpanan" value={5000000} src="/assets/icon/icSavingPig.svg" />
          <DashboardCard label="Pinjaman Aktif" value={10000000} src="/assets/icon/icWallet.svg" />
          <DashboardCard label="Tanggal Simpanan" value="15 Nov 2025" src="/assets/icon/icCheckFilled.svg" />
        </div>
        <div className="bg-white rounded-xl shadow min-w-0">
          <div className="px-4 sm:px-6 pt-4 sm:pt-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">Transaksi Terakhir</h2>
          </div>
          <div className="overflow-x-auto px-4 sm:px-6 pb-4 sm:pb-6">
            <table className="w-full text-center table-auto min-w-[640px]">
              <thead>
                <tr>
                  <th className="py-3 px-3 sm:px-4 md:px-6 text-sm font-semibold text-gray-600 align-middle border-b-2 border-gray-300 whitespace-nowrap">No</th>
                  <th className="py-3 px-3 sm:px-4 md:px-6 text-sm font-semibold text-gray-600 align-middle border-b-2 border-gray-300 whitespace-nowrap">Tanggal</th>
                  <th className="py-3 px-3 sm:px-4 md:px-6 text-sm font-semibold text-gray-600 align-middle border-b-2 border-gray-300 whitespace-nowrap">Jenis</th>
                  <th className="py-3 px-3 sm:px-4 md:px-6 text-sm font-semibold text-gray-600 align-middle border-b-2 border-gray-300 whitespace-nowrap">Jumlah</th>
                  <th className="py-3 px-3 sm:px-4 md:px-6 text-sm font-semibold text-gray-600 align-middle border-b-2 border-gray-300 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate('/transactions/A-015')}
                  onKeyDown={(e) => e.key === 'Enter' && navigate('/transactions/A-015')}
                  className="hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                >
                  <td className="py-3 px-3 sm:px-4 md:px-6 text-sm text-gray-700 align-middle border-b border-gray-200 whitespace-nowrap">A-015</td>
                  <td className="py-3 px-3 sm:px-4 md:px-6 text-sm text-gray-700 align-middle border-b border-gray-200 whitespace-nowrap">1 Oktober 2025</td>
                  <td className="py-3 px-3 sm:px-4 md:px-6 text-sm text-gray-700 align-middle border-b border-gray-200 whitespace-nowrap">Simpanan Wajib</td>
                  <td className="py-3 px-3 sm:px-4 md:px-6 text-sm text-gray-700 align-middle border-b border-gray-200 whitespace-nowrap">Rp 400.000</td>
                  <td className="py-3 px-3 sm:px-4 md:px-6 align-middle border-b border-gray-200 whitespace-nowrap"><StatusBadge status="Selesai" /></td>
                </tr>
                <tr
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate('/transactions/A-015')}
                  onKeyDown={(e) => e.key === 'Enter' && navigate('/transactions/A-015')}
                  className="hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                >
                  <td className="py-3 px-3 sm:px-4 md:px-6 text-sm text-gray-700 align-middle border-b border-gray-200 whitespace-nowrap">A-015</td>
                  <td className="py-3 px-3 sm:px-4 md:px-6 text-sm text-gray-700 align-middle border-b border-gray-200 whitespace-nowrap">2 Oktober 2025</td>
                  <td className="py-3 px-3 sm:px-4 md:px-6 text-sm text-gray-700 align-middle border-b border-gray-200 whitespace-nowrap">Bayar Cicilan</td>
                  <td className="py-3 px-3 sm:px-4 md:px-6 text-sm text-gray-700 align-middle border-b border-gray-200 whitespace-nowrap">Rp 400.000</td>
                  <td className="py-3 px-3 sm:px-4 md:px-6 align-middle border-b border-gray-200 whitespace-nowrap"><StatusBadge status="Selesai" /></td>
                </tr>
                <tr
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate('/transactions/A-016')}
                  onKeyDown={(e) => e.key === 'Enter' && navigate('/transactions/A-016')}
                  className="hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                >
                  <td className="py-3 px-3 sm:px-4 md:px-6 text-sm text-gray-700 align-middle border-b border-gray-200 whitespace-nowrap">A-016</td>
                  <td className="py-3 px-3 sm:px-4 md:px-6 text-sm text-gray-700 align-middle border-b border-gray-200 whitespace-nowrap">15 Oktober 2025</td>
                  <td className="py-3 px-3 sm:px-4 md:px-6 text-sm text-gray-700 align-middle border-b border-gray-200 whitespace-nowrap">Simpanan Wajib</td>
                  <td className="py-3 px-3 sm:px-4 md:px-6 text-sm text-gray-700 align-middle border-b border-gray-200 whitespace-nowrap">Rp 500.000</td>
                  <td className="py-3 px-3 sm:px-4 md:px-6 align-middle border-b border-gray-200 whitespace-nowrap"><StatusBadge status="Menunggu" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}

// Card component for dashboard summary
function DashboardCard({ label, value, src }) {
  const isNumber = typeof value === 'number';
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 flex flex-row gap-3 sm:gap-4 items-center shadow hover:shadow-lg transition-shadow duration-200 min-w-0 w-full">
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-brand-teal/10 flex items-center justify-center shrink-0">
        <img src={src} alt="icon" className="w-7 h-7 sm:w-8 sm:h-8" />
      </div>
      <div className="flex flex-col gap-1 sm:gap-2 min-w-0">
        <div className="flex items-center gap-2 text-sm sm:text-base text-gray-500">{label}</div>
        <div className="text-xl sm:text-2xl font-bold text-gray-800 truncate">{isNumber ? formatCurrency(value) : value}</div>
      </div>
    </div>
  );
}
