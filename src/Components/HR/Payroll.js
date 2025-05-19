import React, { useState, useEffect } from "react";
import Payslip from "./Payslip";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import payrollService from '../../services/payrollService';

const Payroll = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPayslip, setShowPayslip] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [calcLoading, setCalcLoading] = useState(false);

  // Fetch payrolls for selected month/year
  const fetchPayrolls = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await payrollService.getPayrolls({ month, year });
      setPayrolls(res.payrolls || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch payrolls');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPayrolls();
    // eslint-disable-next-line
  }, [month, year]);

  // Trigger payroll calculation
  const handleCalculatePayroll = async () => {
    setCalcLoading(true);
    setError(null);
    try {
      await payrollService.calculatePayroll({ month, year });
      await fetchPayrolls();
    } catch (err) {
      setError(err.message || 'Payroll calculation failed');
    }
    setCalcLoading(false);
  };

  // Handle payslip generation and show modal
  const handleShowPayslip = async (payroll) => {
    setLoading(true);
    setError(null);
    try {
      // Generate payslip (creates if not exists)
      await payrollService.generatePayslip(payroll._id);
      setSelectedPayroll(payroll);
      setShowPayslip(true);
    } catch (err) {
      setError(err.message || 'Failed to generate payslip');
    }
    setLoading(false);
  };

  // Filter payrolls by search query (name, email, etc.)
  const filteredPayrolls = payrolls.filter(p => {
    const name = p.user?.name?.toLowerCase() || '';
    const email = p.user?.email?.toLowerCase() || '';
    return name.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase());
  });

  // Theme colors
  const themeColors = {
    gradient: 'linear-gradient(135deg, rgb(44, 62, 80), rgb(52, 152, 219))',
    primary: '#2c3e50',
    secondary: '#3498db',
    light: 'rgba(52, 152, 219, 0.1)',
    border: 'rgba(52, 152, 219, 0.2)',
  };

  return (
    <div className="px-3" style={{ backgroundColor: '#f8f9fa', fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1" style={{ fontSize: '2rem', fontWeight: '600',  }}>Employee Salary</h1>
          <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
            <span style={{ color: themeColors.secondary }}>HR</span> / Employee Salary
          </div>
        </div>
        <div className="d-flex mt-3 mt-md-0">
          <button className="btn me-2 d-flex align-items-center" style={{ backgroundColor: 'white', color: themeColors.primary, border: `1px solid ${themeColors.border}`, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', transition: 'all 0.3s ease' }} onMouseOver={e => e.currentTarget.style.backgroundColor = themeColors.light} onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}>
            <FontAwesomeIcon icon={faFileExport} className="me-2" /> Export
          </button>
          <button className="btn d-flex align-items-center" style={{ background: themeColors.gradient, color: 'white', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'all 0.3s ease' }} onClick={handleCalculatePayroll} disabled={calcLoading}>
            <FontAwesomeIcon icon={faPlus} className="me-2" /> {calcLoading ? 'Calculating...' : 'Calculate Payroll'}
          </button>
        </div>
      </div>

      {/* Month/Year Selection */}
      <div className="mb-3 d-flex flex-wrap align-items-center gap-2">
        <label className="me-2">Month:</label>
        <select value={month} onChange={e => setMonth(Number(e.target.value))} className="form-select form-select-sm" style={{ width: 100 }}>
          {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
        </select>
        <label className="ms-3 me-2">Year:</label>
        <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} className="form-control form-control-sm" style={{ width: 100 }} min={2000} max={2100} />
      </div>

      {/* Error/Loading */}
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div>Loading...</div>}

      {/* Content Card */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden', transition: 'box-shadow 0.3s ease' }}>
        <div className="card-header bg-white d-flex flex-wrap justify-content-between align-items-center py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: themeColors.primary, marginBottom: '0' }}>
              Employee Salary List
              <span className="ms-2 badge" style={{ backgroundColor: themeColors.light, color: themeColors.primary, fontWeight: '500', fontSize: '0.75rem' }}>{month}/{year}</span>
            </h2>
          </div>
        </div>
        <div className="card-body">
          {/* Table Controls */}
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center mb-3 mb-md-0">
              <span style={{ color: '#6c757d', fontSize: '0.9rem' }} className="me-2">Rows Per Page</span>
              <select className="form-select form-select-sm" style={{ width: 'auto', borderColor: themeColors.border, boxShadow: 'none', fontSize: '0.9rem' }} value={rowsPerPage} onChange={e => setRowsPerPage(parseInt(e.target.value))}>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <span className="ms-2" style={{ color: '#6c757d', fontSize: '0.9rem' }}>Entries</span>
            </div>
            <div className="position-relative">
              <input type="text" placeholder="Search..." className="form-control" style={{ paddingLeft: '2.5rem', borderColor: themeColors.border, boxShadow: 'none', fontSize: '0.9rem' }} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }} />
            </div>
          </div>

          {/* Payroll Table */}
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr style={{ backgroundColor: themeColors.light }}>
                  <th>Emp ID</th>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Base Salary</th>
                  <th>Bonus</th>
                  <th>Deductions</th>
                  <th>Net Pay</th>
                  <th>Presents</th>
                  <th>Lates</th>
                  <th>Absents</th>
                  <th>Payslip</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayrolls.slice(0, rowsPerPage).map((p) => (
                  <tr key={p._id}>
                    <td>{p.user?._id?.slice(-4) || '-'}</td>
                    <td>{p.user?.name || '-'}</td>
                    <td>{p.user?.designation || '-'}</td>
                    <td>{p.baseSalary}</td>
                    <td>{p.bonus}</td>
                    <td>{p.deductions}</td>
                    <td>{p.netPay}</td>
                    <td>{p.presents}</td>
                    <td>{p.lates}</td>
                    <td>{p.absents}</td>
                    <td>
                      <button className="btn btn-sm btn-primary" onClick={() => handleShowPayslip(p)}>
                        View Payslip
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredPayrolls.length === 0 && (
                  <tr><td colSpan={11} className="text-center">No payrolls found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payslip Modal */}
      {showPayslip && selectedPayroll && (
        <Payslip payroll={selectedPayroll} onClose={() => setShowPayslip(false)} />
      )}
    </div>
  );
};

export default Payroll;
