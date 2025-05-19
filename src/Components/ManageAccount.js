import React, { useState } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaUniversity,
  FaUmbrellaBeach,
  FaDownload,
} from "react-icons/fa";

const ManageAccount = () => {
  const account = {
    totalCredit: 75000,
    totalDebit: 40000,
    bankName: "HDFC Bank",
    accountNumber: "XXXX-XXXX-1234",
    totalLeave: 10,
  };

  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");

  const transactions = [
    { id: 1, type: "credit", amount: 5000, date: "2025-04-10" },
    { id: 2, type: "debit", amount: 2000, date: "2025-04-11" },
    { id: 3, type: "credit", amount: 1500, date: "2025-04-12" },
    { id: 4, type: "debit", amount: 1000, date: "2025-04-13" },
  ];

  const filteredTransactions = transactions.filter((txn) => {
    const txnDate = new Date(txn.date);
    const monthMatch = filterMonth ? txnDate.getMonth() + 1 === parseInt(filterMonth) : true;
    const yearMatch = filterYear ? txnDate.getFullYear() === parseInt(filterYear) : true;
    return monthMatch && yearMatch;
  });

  const handleDownload = () => {
    // Placeholder: implement PDF/Excel download logic here
    alert("Download initiated for account statement");
  };

  return (
    <div>
      {/* <div className="manage-header">
        <h2 className="manage-title">Manage Account</h2>
        <div className="filters-download">
          <select onChange={(e) => setFilterMonth(e.target.value)} defaultValue="">
            <option value="">Month</option>
            <option value="1">Jan</option>
            <option value="2">Feb</option>
            <option value="3">Mar</option>
            <option value="4">Apr</option>
            <option value="5">May</option>
            <option value="6">Jun</option>
            <option value="7">Jul</option>
            <option value="8">Aug</option>
            <option value="9">Sep</option>
            <option value="10">Oct</option>
            <option value="11">Nov</option>
            <option value="12">Dec</option>
          </select>

          <select onChange={(e) => setFilterYear(e.target.value)} defaultValue="">
            <option value="">Year</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>

          <button className="download-btn" onClick={handleDownload}>
            <FaDownload /> Download Statement
          </button>
        </div>
      </div>

      <div className="card-grid">
        <div className="account-card credit">
          <FaArrowDown className="card-icon" />
          <h4>Total Credit</h4>
          <p>₹ {account.totalCredit.toLocaleString()}</p>
        </div>

        <div className="account-card debit">
          <FaArrowUp className="card-icon" />
          <h4>Total Debit</h4>
          <p>₹ {account.totalDebit.toLocaleString()}</p>
        </div>

        <div className="account-card bank">
          <FaUniversity className="card-icon" />
          <h4>My Account</h4>
          <p><strong>Bank:</strong> {account.bankName}</p>
          <p><strong>Acc No:</strong> {account.accountNumber}</p>
        </div>

        <div className="account-card leave">
          <FaUmbrellaBeach className="card-icon" />
          <h4>Total Leave</h4>
          <p>{account.totalLeave} Days</p>
        </div>
      </div> */}

      {/* <div className="transaction-history">
        <h3>Transaction History</h3>
        <div className="transaction-list">
          {filteredTransactions.map((txn) => (
            <div key={txn.id} className={`transaction-item ${txn.type}`}>
              <span className="txn-icon">
                {txn.type === "credit" ? <FaArrowDown color="green" /> : <FaArrowUp color="red" />}
              </span>
              <span className="txn-amount">₹ {txn.amount.toLocaleString()}</span>
              <span className="txn-date">{txn.date}</span>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default ManageAccount;
