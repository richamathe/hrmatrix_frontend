import React from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Building, Calendar, Award, Clock } from 'lucide-react';
import { useSelector } from 'react-redux';
import themeColors from '../../theme/colors';

const Profile = () => {
  const user = useSelector((state) => state.auth.user);

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate years of experience based on joining date
  const calculateExperience = (joiningDate) => {
    if (!joiningDate) return 'N/A';
    const joinDate = new Date(joiningDate);
    const today = new Date();
    const diffTime = Math.abs(today - joinDate);
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));

    if (diffYears === 0) {
      return `${diffMonths} month${diffMonths !== 1 ? 's' : ''}`;
    }
    return `${diffYears} year${diffYears !== 1 ? 's' : ''} ${diffMonths} month${diffMonths !== 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-6" style={{ fontFamily: "'Open Sans', sans-serif", color: '#000' }}>
      <div style={{
        borderBottom: '1px solid #e9ecef',
        paddingBottom: '15px',
        marginBottom: '25px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: '600',
            color: themeColors.darkText,
            marginBottom: '5px'
          }}>My Profile</h2>
          <p style={{
            color: themeColors.lightText,
            fontWeight: '400',
            fontSize: '0.9rem'
          }}>
            View and manage your personal information
          </p>
        </div>
        <div style={{
          background: themeColors.light,
          borderRadius: '50%',
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <User size={24} color={themeColors.secondary} />
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded shadow-sm overflow-hidden" style={{
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e9ecef'
      }}>
        <div style={{
          background: themeColors.gradient,
          height: '120px',
          position: 'relative'
        }}></div>
        <div className="px-4 py-4">
          <div className="d-flex flex-column flex-sm-row align-items-center" style={{
            marginTop: '-60px',
            position: 'relative'
          }}>
            <div style={{
              padding: '3px',
              background: 'white',
              borderRadius: '50%',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              marginRight: '20px'
            }}>
              <img
                src={user?.profilePhoto ? `${process.env.REACT_APP_BACKEND_URL}/${user.profilePhoto}` : 'https://via.placeholder.com/150'}
                alt="Profile"
                height="110px"
                width="110px"
                style={{
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: `3px solid white`
                }}
              />
            </div>
            <div style={{
              textAlign: 'left',
              paddingTop: '60px'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: themeColors.darkText,
                marginBottom: '5px'
              }}>{user?.name}</h3>
              <p style={{
                color: themeColors.secondary,
                fontWeight: '500',
                marginBottom: '5px'
              }}>{user?.designation}</p>
              <p style={{
                color: themeColors.lightText,
                marginBottom: '12px'
              }}>{user?.department}</p>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <span style={{
                  background: themeColors.light,
                  color: themeColors.secondary,
                  padding: '5px 12px',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Award size={14} />
                  {calculateExperience(user?.joiningDate)} experience
                </span>

                <span style={{
                  background: 'rgba(46, 204, 113, 0.1)',
                  color: '#27ae60',
                  padding: '5px 12px',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Clock size={14} />
                  Active Employee
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded shadow-sm p-4" style={{
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: '600',
          color: themeColors.darkText,
          marginBottom: '15px',
          paddingBottom: '8px',
          borderBottom: '1px solid #e9ecef'
        }}>
          Personal Information
        </h3>
        <div className="row g-3">
          <div className="col-md-6 mb-3">
            <div className="d-flex align-items-center">
              <div style={{
                background: themeColors.light,
                borderRadius: '4px',
                padding: '8px',
                marginRight: '12px'
              }}>
                <Mail color={themeColors.secondary} size={18} />
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: themeColors.lightText, marginBottom: '2px' }}>Email</p>
                <p style={{ fontWeight: '500', color: themeColors.darkText, fontSize: '0.95rem' }}>{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <div className="d-flex align-items-center">
              <div style={{
                background: themeColors.light,
                borderRadius: '4px',
                padding: '8px',
                marginRight: '12px'
              }}>
                <Phone color={themeColors.secondary} size={18} />
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: themeColors.lightText, marginBottom: '2px' }}>Phone</p>
                <p style={{ fontWeight: '500', color: themeColors.darkText, fontSize: '0.95rem' }}>{user?.phone || user?.mobile || 'Not set'}</p>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <div className="d-flex align-items-center">
              <div style={{
                background: themeColors.light,
                borderRadius: '4px',
                padding: '8px',
                marginRight: '12px'
              }}>
                <MapPin color={themeColors.secondary} size={18} />
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: themeColors.lightText, marginBottom: '2px' }}>Address</p>
                <p style={{ fontWeight: '500', color: themeColors.darkText, fontSize: '0.95rem' }}>{user?.address || 'Not set'}</p>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <div className="d-flex align-items-center">
              <div style={{
                background: themeColors.light,
                borderRadius: '4px',
                padding: '8px',
                marginRight: '12px'
              }}>
                <Briefcase color={themeColors.secondary} size={18} />
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: themeColors.lightText, marginBottom: '2px' }}>Position</p>
                <p style={{ fontWeight: '500', color: themeColors.darkText, fontSize: '0.95rem' }}>{user?.position || 'Not set'}</p>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <div className="d-flex align-items-center">
              <div style={{
                background: themeColors.light,
                borderRadius: '4px',
                padding: '8px',
                marginRight: '12px'
              }}>
                <Building color={themeColors.secondary} size={18} />
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: themeColors.lightText, marginBottom: '2px' }}>Department</p>
                <p style={{ fontWeight: '500', color: themeColors.darkText, fontSize: '0.95rem' }}>{user?.department}</p>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <div className="d-flex align-items-center">
              <div style={{
                background: themeColors.light,
                borderRadius: '4px',
                padding: '8px',
                marginRight: '12px'
              }}>
                <Calendar color={themeColors.secondary} size={18} />
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: themeColors.lightText, marginBottom: '2px' }}>Joining Date</p>
                <p style={{ fontWeight: '500', color: themeColors.darkText, fontSize: '0.95rem' }}>{formatDate(user?.joiningDate)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 