import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faFileInvoiceDollar, faIdCard, faUser, faBriefcase, faCalendarAlt, faMoneyBillWave, faGift, faMoneyCheckAlt, faDownload, faPrint } from '@fortawesome/free-solid-svg-icons';
import payrollService from '../../services/payrollService';

const Payslip = ({ payroll, onClose }) => {
  const [payslip, setPayslip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayslip = async () => {
      setLoading(true);
      setError(null);
      try {
        // Generate payslip (API returns payslip data)
        const res = await payrollService.generatePayslip(payroll._id);
        setPayslip(res.payslip);
      } catch (err) {
        setError(err.message || 'Failed to fetch payslip');
      }
      setLoading(false);
    };
    if (payroll) fetchPayslip();
  }, [payroll]);

  // Theme colors
  const themeColors = {
    gradient: 'linear-gradient(135deg, rgb(44, 62, 80), rgb(52, 152, 219))',
    primary: '#2c3e50',
    secondary: '#3498db',
    light: 'rgba(52, 152, 219, 0.1)',
    border: 'rgba(52, 152, 219, 0.2)',
  };

  if (loading) return <div className="fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}><div className="bg-white p-4 rounded shadow">Loading payslip...</div></div>;
  if (error) return <div className="fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}><div className="bg-white p-4 rounded shadow text-danger">{error}</div></div>;
  if (!payslip) return null;

  return (
    <div className="fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050, padding: '1rem' }}>
      <div className="bg-white rounded-4 shadow-lg position-relative" style={{ width: '100%', maxWidth: '550px', animation: 'fadeIn 0.3s ease', overflow: 'hidden' }}>
        {/* Header with gradient background */}
        <div className="p-4 text-center text-white" style={{ background: themeColors.gradient }}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faFileInvoiceDollar} size="lg" className="me-2" />
              <h2 className="mb-0 fs-4 fw-bold">Employee Payslip</h2>
            </div>
            <button onClick={onClose} className="btn btn-sm text-white border-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <p className="mb-0 small opacity-75">Generated on {new Date(payslip.generatedAt).toLocaleDateString()}</p>
        </div>

        <div className="p-4">
          {/* Employee Info */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="d-flex align-items-center p-3 h-100 rounded-3" style={{ backgroundColor: themeColors.light }}>
                <FontAwesomeIcon icon={faIdCard} className="me-3" style={{ color: themeColors.primary }} />
                <div>
                  <p className="small text-muted mb-1">Employee ID</p>
                  <p className="fw-medium mb-0" style={{ color: themeColors.primary }}>{payslip.user?._id?.slice(-4) || '-'}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center p-3 h-100 rounded-3" style={{ backgroundColor: themeColors.light }}>
                <FontAwesomeIcon icon={faUser} className="me-3" style={{ color: themeColors.primary }} />
                <div>
                  <p className="small text-muted mb-1">Name</p>
                  <p className="fw-medium mb-0" style={{ color: themeColors.primary }}>{payroll.user?.name || '-'}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center p-3 h-100 rounded-3" style={{ backgroundColor: themeColors.light }}>
                <FontAwesomeIcon icon={faBriefcase} className="me-3" style={{ color: themeColors.primary }} />
                <div>
                  <p className="small text-muted mb-1">Designation</p>
                  <p className="fw-medium mb-0" style={{ color: themeColors.primary }}>{payroll.user?.designation || '-'}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center p-3 h-100 rounded-3" style={{ backgroundColor: themeColors.light }}>
                <FontAwesomeIcon icon={faCalendarAlt} className="me-3" style={{ color: themeColors.primary }} />
                <div>
                  <p className="small text-muted mb-1">Pay Period</p>
                  <p className="fw-medium mb-0" style={{ color: themeColors.primary }}>{payslip.month}/{payslip.year}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Salary Info */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3" style={{ borderBottom: `1px solid ${themeColors.border}` }}>
              <h5 className="mb-0 fw-semibold" style={{ color: themeColors.primary }}>Salary Details</h5>
            </div>
            <div className="card-body">
              <div className="mb-3 pb-3" style={{ borderBottom: `1px solid ${themeColors.border}` }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="me-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: themeColors.light }}>
                      <FontAwesomeIcon icon={faMoneyBillWave} style={{ color: themeColors.primary }} />
                    </div>
                    <span className="fw-medium" style={{ color: themeColors.primary }}>Base Salary</span>
                  </div>
                  <span className="fw-semibold fs-5">${payslip.baseSalary?.toLocaleString()}</span>
                </div>
              </div>

              <div className="mb-3 pb-3" style={{ borderBottom: `1px solid ${themeColors.border}` }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="me-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: themeColors.light }}>
                      <FontAwesomeIcon icon={faGift} style={{ color: themeColors.primary }} />
                    </div>
                    <span className="fw-medium" style={{ color: themeColors.primary }}>Bonus</span>
                  </div>
                  <span className="fw-semibold fs-5">${payslip.bonus?.toLocaleString()}</span>
                </div>
              </div>

              <div className="mb-3 pb-3" style={{ borderBottom: `1px solid ${themeColors.border}` }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="me-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: themeColors.light }}>
                      <FontAwesomeIcon icon={faMoneyCheckAlt} style={{ color: themeColors.primary }} />
                    </div>
                    <span className="fw-medium" style={{ color: themeColors.primary }}>Deductions</span>
                  </div>
                  <span className="fw-semibold fs-5">${payslip.deductions?.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="me-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: themeColors.light }}>
                      <FontAwesomeIcon icon={faMoneyCheckAlt} style={{ color: themeColors.primary }} />
                    </div>
                    <span className="fw-medium" style={{ color: themeColors.primary }}>Net Pay</span>
                  </div>
                  <span className="fw-bold fs-4" style={{ color: themeColors.primary }}>${payslip.netPay?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="d-flex justify-content-between">
            <button className="btn d-flex align-items-center" style={{ backgroundColor: themeColors.light, color: themeColors.primary, border: 'none', transition: 'all 0.3s ease' }} onMouseOver={e => e.currentTarget.style.backgroundColor = themeColors.border} onMouseOut={e => e.currentTarget.style.backgroundColor = themeColors.light} onClick={() => window.print()}>
              <FontAwesomeIcon icon={faPrint} className="me-2" /> Print
            </button>

            <div>
              <button className="btn me-2 d-flex align-items-center" style={{ backgroundColor: themeColors.light, color: themeColors.primary, border: 'none', transition: 'all 0.3s ease' }} onMouseOver={e => e.currentTarget.style.backgroundColor = themeColors.border} onMouseOut={e => e.currentTarget.style.backgroundColor = themeColors.light} onClick={() => window.print()}>
                <FontAwesomeIcon icon={faDownload} className="me-2" /> Download
              </button>

              <button className="btn d-flex align-items-center" style={{ background: themeColors.gradient, color: 'white', border: 'none', transition: 'all 0.3s ease' }} onMouseOver={e => e.currentTarget.style.opacity = '0.9'} onMouseOut={e => e.currentTarget.style.opacity = '1'} onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payslip;
