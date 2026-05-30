interface Props {
    agency: any;
}

export default function AgencyFund({ agency }: Props) {
    const fundTransactions = [
        { id: 1, date: '2024-01-15', type: 'Credit', description: 'Commission Received', amount: '+$5,000', balance: '$25,000' },
        { id: 2, date: '2024-01-14', type: 'Debit', description: 'Booking Payment', amount: '-$2,500', balance: '$20,000' },
        { id: 3, date: '2024-01-13', type: 'Credit', description: 'Deposit', amount: '+$10,000', balance: '$22,500' },
        { id: 4, date: '2024-01-12', type: 'Debit', description: 'Service Fee', amount: '-$500', balance: '$12,500' },
    ];

    return (
        <div className="row g-4 px-4">
            <div className="col-lg-12">
                <h5 className="mb-3">Fund Management</h5>

                {/* Fund Summary */}
                <div className="row mb-3">
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <label className="form-label text-muted small">Total Balance</label>
                                <h4 className="mb-0 text-success">$25,000.00</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <label className="form-label text-muted small">Total Credit</label>
                                <h4 className="mb-0 text-primary">$15,000.00</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <label className="form-label text-muted small">Total Debit</label>
                                <h4 className="mb-0 text-danger">$3,000.00</h4>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="card">
                    <div className="card-header border-0">
                        <h6 className="card-title mb-0">Transaction History</h6>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>Description</th>
                                        <th>Amount</th>
                                        <th>Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fundTransactions.map((transaction) => (
                                        <tr key={transaction.id}>
                                            <td>{transaction.date}</td>
                                            <td>
                                                <span className={`badge badge-sm ${transaction.type === 'Credit' ? 'badge-success' : 'badge-danger'}`}>
                                                    {transaction.type}
                                                </span>
                                            </td>
                                            <td>{transaction.description}</td>
                                            <td className={`fw-semibold ${transaction.type === 'Credit' ? 'text-success' : 'text-danger'}`}>
                                                {transaction.amount}
                                            </td>
                                            <td className="fw-semibold">{transaction.balance}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
