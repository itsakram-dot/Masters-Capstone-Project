import React, { useEffect, useState } from 'react';

export default function TransactionMonitoring() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processStatuses, setProcessStatuses] = useState({});
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error('Error fetching users:', err));
  }, []);

  const handleViewTransactions = async () => {
    if (!selectedUserId) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/transactions/user/${selectedUserId}`);
      const data = await res.json();
      const suspicious = filterSuspiciousTransactions(data);
      setTransactions(suspicious);
      setShowTransactions(true);

      const initialStatuses = {};
      suspicious.forEach(tx => {
        initialStatuses[tx.transaction_id] = 'Pending';
      });
      setProcessStatuses(initialStatuses);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
    setLoading(false);
  };

  const filterSuspiciousTransactions = (data) => {
    const dateCount = {};
    const keywords = ['Politics Funds', 'NGO'];

    data.forEach((tx) => {
      const dateOnly = tx.transaction_date.split('T')[0];
      dateCount[dateOnly] = (dateCount[dateOnly] || 0) + 1;
    });

    return data
      .map((tx) => {
        const dateOnly = tx.transaction_date.split('T')[0];
        const isHighAmount = parseFloat(tx.transaction_amount) > 200;
        const isFrequent = dateCount[dateOnly] > 3;
        const hasKeyword = keywords.some((kw) =>
          tx.transaction_description?.toLowerCase().includes(kw.toLowerCase())
        );

        const suspicionScore = [isHighAmount, isFrequent, hasKeyword].filter(Boolean).length;

        let suspicionLevel = '';
        if (suspicionScore === 3) suspicionLevel = 'Most Likely';
        else if (suspicionScore === 2) suspicionLevel = 'More Likely';
        else if (suspicionScore === 1) suspicionLevel = 'Likely';

        return suspicionScore > 0
          ? { ...tx, suspicion_level: suspicionLevel }
          : null;
      })
      .filter(Boolean);
  };

  const handleProcessStatusChange = (transactionId, newStatus) => {
    setProcessStatuses(prev => ({
      ...prev,
      [transactionId]: newStatus
    }));

    // Save to backend if marked as Completed
    if (newStatus === 'Completed') {
      const completedTx = transactions.find(tx => tx.transaction_id === transactionId);

      fetch('http://localhost:3000/completed-transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completedTx)
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to save completed transaction');
          console.log('Completed transaction saved to backend.');
        })
        .catch(err => console.error('Error saving completed transaction:', err));
    }
  };

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const getBadgeStyle = (level) => {
    switch (level) {
      case 'Most Likely':
        return 'bg-red-500 text-white';
      case 'More Likely':
        return 'bg-yellow-500 text-white';
      case 'Likely':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const activeTransactions = transactions.filter(
    (tx) => processStatuses[tx.transaction_id] !== 'Completed'
  );

  const completedTransactions = transactions.filter(
    (tx) => processStatuses[tx.transaction_id] === 'Completed'
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Transaction Monitoring</h2>

      <div className="flex gap-4 mb-6">
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="w-3/4 px-3 py-2 border rounded"
        >
          <option value="">Select Account</option>
          {users.map((user) => (
            <option key={user.user_id} value={user.user_id}>
              {user.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleViewTransactions}
          disabled={!selectedUserId}
          className={`w-1/4 px-4 py-2 rounded transition ${
            selectedUserId ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-400 text-white cursor-not-allowed'
          }`}
        >
          View Transactions
        </button>
      </div>

      {loading && (
        <p className="text-center text-blue-500 mb-4 animate-pulse">
          Loading transactions...
        </p>
      )}

      {showTransactions && (
        <div className="overflow-x-auto mt-6">
          <h3 className="text-2xl font-semibold mb-4 text-red-600">Suspicious Transactions</h3>

          <table className="w-full table-auto border border-gray-300 mb-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Transaction ID</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Suspicion Level</th>
                <th className="px-4 py-2 border">Process Status</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {activeTransactions.map((tx) => (
                <tr key={tx.transaction_id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border text-center">{tx.transaction_id}</td>
                  <td className="px-4 py-2 border text-center">${tx.transaction_amount}</td>
                  <td className="px-4 py-2 border text-center">{tx.transaction_date.split('T')[0]}</td>
                  <td className="px-4 py-2 border text-center">{tx.transaction_status}</td>
                  <td className="px-4 py-2 border text-center truncate max-w-xs">{tx.transaction_description}</td>
                  <td className="px-4 py-2 border text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeStyle(tx.suspicion_level)}`}>
                      {tx.suspicion_level}
                    </span>
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <select
                      value={processStatuses[tx.transaction_id] || 'Pending'}
                      onChange={(e) => handleProcessStatusChange(tx.transaction_id, e.target.value)}
                      className="px-2 py-1 border rounded"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => handleViewDetails(tx)}
                      className="bg-blue-500 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setSelectedTransaction(null)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Transaction Details</h3>
            <p><strong>ID:</strong> {selectedTransaction.transaction_id}</p>
            <p><strong>Amount:</strong> ${selectedTransaction.transaction_amount}</p>
            <p><strong>Date:</strong> {selectedTransaction.transaction_date.split('T')[0]}</p>
            <p><strong>Status:</strong> {selectedTransaction.transaction_status}</p>
            <p><strong>Description:</strong> {selectedTransaction.transaction_description}</p>
            <p><strong>Suspicion Level:</strong> {selectedTransaction.suspicion_level}</p>
            <p><strong>Process Status:</strong> {processStatuses[selectedTransaction.transaction_id]}</p>
            <button
              onClick={() => setSelectedTransaction(null)}
              className="mt-6 bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
