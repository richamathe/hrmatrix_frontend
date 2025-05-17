import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import boost from "../assets/images/boost.png.webp";
import hr2 from "../assets/images/hr2.png";
import loginLogo from "../assets/images/loginLogo.png";
import payroll from "../assets/images/payroll.png.webp";
import { Link } from 'react-router-dom';
import { ArrowRight, Users, DollarSign, Calendar, BarChart2 } from 'lucide-react';
import themeColors from '../theme/colors';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="#">
            <img src={loginLogo} alt="HR Solutions" height="50" />
            <span className="ms-2 fw-bold" style={{ color: themeColors.primary }}>HRFlow</span>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav align-items-center">
              <li className="nav-item me-3">
                <Link to='/login' className="nav-link" style={{ color: themeColors.primary, fontWeight: '500' }}>Login</Link>
              </li>
              <li className="nav-item">
                <Link to='/sign' className="btn px-4 py-2" style={{
                  background: themeColors.gradient,
                  color: 'white',
                  borderRadius: '6px',
                  fontWeight: '500',
                  boxShadow: '0 4px 6px rgba(44, 62, 80, 0.1)',
                  transition: 'all 0.3s ease'
                }}>Sign up</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" style={{
        paddingTop: '120px',
        paddingBottom: '80px',
        background: 'linear-gradient(135deg, rgba(44, 62, 80, 0.05), rgba(52, 152, 219, 0.1))'
      }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 hero-text">
              <h1 style={{
                fontSize: '2.75rem',
                fontWeight: '700',
                marginBottom: '1.5rem',
                color: themeColors.primary,
                lineHeight: '1.2'
              }}>Streamline Your HR Processes</h1>
              <p style={{
                fontSize: '1.1rem',
                color: themeColors.lightText,
                marginBottom: '2rem',
                lineHeight: '1.6'
              }}>Manage employees, payroll, attendance, and leave efficiently with our all-in-one HR management system.</p>
              <Link to='/sign' className="btn px-4 py-3" style={{
                background: themeColors.gradient,
                color: 'white',
                borderRadius: '6px',
                fontWeight: '500',
                boxShadow: '0 4px 6px rgba(44, 62, 80, 0.1)',
                transition: 'all 0.3s ease'
              }}>
                Get Started Free
                <ArrowRight size={18} className="ms-2" />
              </Link>
            </div>
            <div className="col-lg-6 d-flex justify-content-center">
              <img src={hr2} alt="HR Management" className="hero-image img-fluid" style={{
                maxHeight: '450px',
                borderRadius: '10px',
                boxShadow: '0 20px 40px rgba(44, 62, 80, 0.1)',
              }} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container text-center">
          <h2 className="section-title mb-4" style={{ color: themeColors.primary, fontWeight: '700' }}>HR Management Features</h2>
          <p className="mb-5" style={{ color: themeColors.lightText, maxWidth: '700px', margin: '0 auto' }}>
            Our comprehensive HR solution provides all the tools you need to manage your workforce effectively
          </p>
          <div className="row mt-5">
            <div className="col-md-4 mb-4">
              <div className="feature-card h-100" style={{
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 10px 30px rgba(44, 62, 80, 0.08)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                border: '1px solid rgba(236, 240, 245, 0.8)'
              }}>
                <div className="feature-icon mb-4" style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: themeColors.light,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  color: themeColors.primary
                }}>
                  <Users size={30} />
                </div>
                <h3 style={{ color: themeColors.primary, fontSize: '1.4rem', marginBottom: '1rem' }}>Employee Management</h3>
                <p style={{ color: themeColors.lightText }}>Efficiently manage employee records, personal details, roles, and performance all in one place.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card h-100" style={{
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 10px 30px rgba(44, 62, 80, 0.08)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                border: '1px solid rgba(236, 240, 245, 0.8)'
              }}>
                <div className="feature-icon mb-4" style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: themeColors.light,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  color: themeColors.primary
                }}>
                  <DollarSign size={30} />
                </div>
                <h3 style={{ color: themeColors.primary, fontSize: '1.4rem', marginBottom: '1rem' }}>Payroll Management</h3>
                <p style={{ color: themeColors.lightText }}>Automate salary calculations, tax deductions, and direct deposits for seamless payroll processing.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card h-100" style={{
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 10px 30px rgba(44, 62, 80, 0.08)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                border: '1px solid rgba(236, 240, 245, 0.8)'
              }}>
                <div className="feature-icon mb-4" style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: themeColors.light,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  color: themeColors.primary
                }}>
                  <Calendar size={30} />
                </div>
                <h3 style={{ color: themeColors.primary, fontSize: '1.4rem', marginBottom: '1rem' }}>Attendance & Leave</h3>
                <p style={{ color: themeColors.lightText }}>Track attendance, manage leave requests, and maintain work schedules efficiently.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insights Section */}
      <section className="insights-section py-5" style={{ background: themeColors.lightBg }}>
        <div className="container">
          <div className="row">
            <div className="col-md-6 mb-4">
              <h2 className="section-title mb-4" style={{ color: themeColors.primary, fontWeight: '700', textAlign: 'left' }}>HR Insights</h2>
              <div className="row">
                <div className="col-12 mb-4">
                  <div className="insight-card" style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(44, 62, 80, 0.08)',
                    background: 'white',
                    transition: 'transform 0.3s ease',
                    height: '100%'
                  }}>
                    <div className="insight-image">
                      <img src={boost} alt="Employee Productivity" className="img-fluid" style={{ height: '200px', width: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="insight-content p-4">
                      <h4 style={{ color: themeColors.primary, fontWeight: '600' }}>Boosting Employee Productivity</h4>
                      <p style={{ color: themeColors.lightText }}>Learn how HR teams can implement effective strategies to improve employee productivity and engagement.</p>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="insight-card" style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(44, 62, 80, 0.08)',
                    background: 'white',
                    transition: 'transform 0.3s ease',
                    height: '100%'
                  }}>
                    <div className="insight-image">
                      <img src={payroll} alt="Payroll Best Practices" className="img-fluid" style={{ height: '200px', width: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="insight-content p-4">
                      <h4 style={{ color: themeColors.primary, fontWeight: '600' }}>Payroll Management Best Practices</h4>
                      <p style={{ color: themeColors.lightText }}>Ensure accuracy in payroll processing with these HR best practices to manage employee salaries efficiently.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <h2 className="section-title mb-4" style={{ color: themeColors.primary, fontWeight: '700', textAlign: 'left' }}>Latest HR Trends</h2>
              <div className="trends-container">
                <div className="trend-card mb-4 p-4" style={{
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(44, 62, 80, 0.08)',
                  background: 'white',
                  borderLeft: `4px solid ${themeColors.secondary}`
                }}>
                  <div className="d-flex align-items-center mb-3">
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: themeColors.light,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '15px',
                      color: themeColors.primary
                    }}>
                      <BarChart2 size={20} />
                    </div>
                    <h4 style={{ color: themeColors.primary, fontWeight: '600', margin: 0, fontSize: '1.2rem' }}>Smart Attendance & Leave Management</h4>
                  </div>
                  <p style={{ color: themeColors.lightText, marginLeft: '55px' }}>Utilize AI and automation for better attendance tracking and leave management.</p>
                </div>
                <div className="trend-card mb-4 p-4" style={{
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(44, 62, 80, 0.08)',
                  background: 'white',
                  borderLeft: `4px solid ${themeColors.secondary}`
                }}>
                  <div className="d-flex align-items-center mb-3">
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: themeColors.light,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '15px',
                      color: themeColors.primary
                    }}>
                      <DollarSign size={20} />
                    </div>
                    <h4 style={{ color: themeColors.primary, fontWeight: '600', margin: 0, fontSize: '1.2rem' }}>Seamless Payroll & Benefits</h4>
                  </div>
                  <p style={{ color: themeColors.lightText, marginLeft: '55px' }}>Integrate payroll with benefits administration for a more comprehensive approach.</p>
                </div>
                <div className="trend-card p-4" style={{
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(44, 62, 80, 0.08)',
                  background: 'white',
                  borderLeft: `4px solid ${themeColors.secondary}`
                }}>
                  <div className="d-flex align-items-center mb-3">
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: themeColors.light,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '15px',
                      color: themeColors.primary
                    }}>
                      <Users size={20} />
                    </div>
                    <h4 style={{ color: themeColors.primary, fontWeight: '600', margin: 0, fontSize: '1.2rem' }}>Remote Work HR Solutions</h4>
                  </div>
                  <p style={{ color: themeColors.lightText, marginLeft: '55px' }}>Adapt HR processes to support the growing remote and hybrid workforce models.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section py-5" style={{
        background: themeColors.gradient,
        color: 'white',
        padding: '80px 0'
      }}>
        <div className="container text-center">
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem'
          }}>Ready to Transform Your HR Management?</h2>
          <p style={{
            fontSize: '1.2rem',
            opacity: '0.9',
            marginBottom: '2rem',
            maxWidth: '700px',
            margin: '0 auto 2rem'
          }}>Join thousands of companies streamlining their HR processes</p>
          <Link to='/sign' className="btn px-5 py-3" style={{
            background: 'white',
            color: themeColors.primary,
            borderRadius: '6px',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            fontSize: '1.1rem'
          }}>
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer py-5" style={{
        background: '#1f2937',
        color: '#e5e7eb',
        padding: '80px 0 40px'
      }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
              <div className="d-flex align-items-center mb-3">
                <img src={loginLogo} alt="HR Management Logo" height="40" className="me-2" />
                <h4 className="mb-0 text-white fw-bold">HRFlow</h4>
              </div>
              <p style={{ color: '#9ca3af', lineHeight: '1.6' }}>
                Simplifying HR management with innovative technology solutions that help businesses grow and employees thrive.
              </p>
              <div className="d-flex mt-4">
                <a href="#" className="me-3" style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  transition: 'all 0.3s ease'
                }}>
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="me-3" style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  transition: 'all 0.3s ease'
                }}>
                  <i className="bi bi-twitter"></i>
                </a>
                <a href="#" className="me-3" style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  transition: 'all 0.3s ease'
                }}>
                  <i className="bi bi-linkedin"></i>
                </a>
              </div>
            </div>
            <div className="col-lg-8 col-md-6">
              <div className="row">
                <div className="col-md-4 mb-4 mb-md-0">
                  <h5 style={{ color: 'white', fontWeight: '600', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Products</h5>
                  <ul className="list-unstyled" style={{ lineHeight: '2' }}>
                    <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.3s ease' }}>HR Management</a></li>
                    <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.3s ease' }}>Payroll</a></li>
                    <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.3s ease' }}>Attendance</a></li>
                    <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.3s ease' }}>Employee Portal</a></li>
                  </ul>
                </div>
                <div className="col-md-4 mb-4 mb-md-0">
                  <h5 style={{ color: 'white', fontWeight: '600', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Company</h5>
                  <ul className="list-unstyled" style={{ lineHeight: '2' }}>
                    <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.3s ease' }}>About Us</a></li>
                    <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.3s ease' }}>Careers</a></li>
                    <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.3s ease' }}>Blog</a></li>
                    <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.3s ease' }}>Contact Us</a></li>
                  </ul>
                </div>
                <div className="col-md-4">
                  <h5 style={{ color: 'white', fontWeight: '600', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Resources</h5>
                  <ul className="list-unstyled" style={{ lineHeight: '2' }}>
                    <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.3s ease' }}>Documentation</a></li>
                    <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.3s ease' }}>Help Center</a></li>
                    <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.3s ease' }}>Tutorials</a></li>
                    <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.3s ease' }}>API</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '2rem 0' }} />
          <div className="row align-items-center">
            <div className="col-md-6 mb-3 mb-md-0">
              <p style={{ color: '#9ca3af', margin: 0 }}>© 2025 HRFlow | All Rights Reserved</p>
            </div>
            <div className="col-md-6">
              <ul className="list-inline mb-0 text-md-end">
                <li className="list-inline-item me-4">
                  <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.3s ease' }}>Privacy Policy</a>
                </li>
                <li className="list-inline-item me-4">
                  <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.3s ease' }}>Terms of Service</a>
                </li>
                <li className="list-inline-item">
                  <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.3s ease' }}>Contact HR</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;