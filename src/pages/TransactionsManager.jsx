import Header from '../components/Header';
import TransactionTable from '../components/TransactionTable';

export default function TransactionsManager() {
  return (
    <>
      <Header title="Manajemen Transaksi & Keuangan" />
      <div className="page-body">
        <TransactionTable 
          title="Riwayat Transaksi Keuangan"
          subtitle="Pantau alur transaksi masuk, gateway pembayaran, status pelunasan, serta rincian faktur secara real-time."
          showStats={true}
          showFilters={true}
          allowSelection={true}
          allowNewTransaction={true}
        />
      </div>
    </>
  );
}
