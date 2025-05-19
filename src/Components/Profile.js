// import React, { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBriefcase, faBuilding, faSitemap, faMapMarkerAlt, faEnvelope, faCamera, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

// const Profile = () => {
//   const [isEditing, setIsEditing] = useState({
//     jobTitle: false,
//     department: false,
//     organization: false,
//     location: false,
//     email: false,
//   });

//   const [jobTitle, setJobTitle] = useState('Your job title');
//   const [department, setDepartment] = useState('Your department');
//   const [organization, setOrganization] = useState('Your organization');
//   const [location, setLocation] = useState('Indore');
//   const [email, setEmail] = useState('prachi.mathe0@gmail.com');
//   const [coverImage, setCoverImage] = useState(null);
//   const [profileImage, setProfileImage] = useState(null);

//   const handleEdit = (field) => {
//     setIsEditing({ ...isEditing, [field]: true });
//   };

//   const handleBlur = (field) => {
//     setIsEditing({ ...isEditing, [field]: false });
//   };

//   const handleCoverUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setCoverImage(URL.createObjectURL(file));
//     }
//   };

//   const handleProfileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setProfileImage(URL.createObjectURL(file));
//     }
//   };

//   return (
//     <div className="profile-container">
//       {/* Cover Section */}
//       <div className="cover-section" style={{ backgroundImage: `url(${coverImage})` }}>
//         <input
//           type="file"
//           accept="image/*"
//           id="cover-upload"
//           style={{ display: 'none' }}
//           onChange={handleCoverUpload}
//         />
//         <label htmlFor="cover-upload" className="cover-upload-button">
//           <FontAwesomeIcon icon={faCamera} /> Change Cover Photo
//         </label>
//       </div>

//       <div className="content-section">
//         {/* Left Section */}
//         <div className="left-section">
//           <div className="profile-image" style={{ backgroundImage: `url(${profileImage})` }}>
//             {!profileImage && "PM"}
//           </div>
//           <input
//             type="file"
//             accept="image/*"
//             id="profile-upload"
//             style={{ display: 'none' }}
//             onChange={handleProfileUpload}
//           />
//           <label htmlFor="profile-upload" className="profile-upload-button">
//             <FontAwesomeIcon icon={faCamera} /> Change Profile Photo
//           </label>

//           <h2>Prachi Mathe</h2>
//           <button className="manage-button">Manage your account</button>

//           <div className="about-section">
//             <h3>About</h3>

//             {/* Job Title */}
//             <div className="info-item">
//               <FontAwesomeIcon icon={faBriefcase} />
//               {isEditing.jobTitle ? (
//                 <input
//                   type="text"
//                   value={jobTitle}
//                   onChange={(e) => setJobTitle(e.target.value)}
//                   onBlur={() => handleBlur('jobTitle')}
//                   autoFocus
//                 />
//               ) : (
//                 <p onClick={() => handleEdit('jobTitle')}>{jobTitle}</p>
//               )}
//             </div>

//             {/* Department */}
//             <div className="info-item">
//               <FontAwesomeIcon icon={faBuilding} />
//               {isEditing.department ? (
//                 <input
//                   type="text"
//                   value={department}
//                   onChange={(e) => setDepartment(e.target.value)}
//                   onBlur={() => handleBlur('department')}
//                   autoFocus
//                 />
//               ) : (
//                 <p onClick={() => handleEdit('department')}>{department}</p>
//               )}
//             </div>

//             {/* Organization */}
//             <div className="info-item">
//               <FontAwesomeIcon icon={faSitemap} />
//               {isEditing.organization ? (
//                 <input
//                   type="text"
//                   value={organization}
//                   onChange={(e) => setOrganization(e.target.value)}
//                   onBlur={() => handleBlur('organization')}
//                   autoFocus
//                 />
//               ) : (
//                 <p onClick={() => handleEdit('organization')}>{organization}</p>
//               )}
//             </div>

//             {/* Location */}
//             <div className="info-item">
//               <FontAwesomeIcon icon={faMapMarkerAlt} />
//               {isEditing.location ? (
//                 <input
//                   type="text"
//                   value={location}
//                   onChange={(e) => setLocation(e.target.value)}
//                   onBlur={() => handleBlur('location')}
//                   autoFocus
//                 />
//               ) : (
//                 <p onClick={() => handleEdit('location')}>{location}</p>
//               )}
//             </div>

//             {/* Email */}
//             <div className="info-item">
//               <FontAwesomeIcon icon={faEnvelope} />
//               {isEditing.email ? (
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   onBlur={() => handleBlur('email')}
//                   autoFocus
//                 />
//               ) : (
//                 <p onClick={() => handleEdit('email')}>{email}</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Right Section */}
//         <div className="right-section">
//           <div className="worked-on">
//             <h3>Worked on</h3>
//             <p>Others will only see what they can access.</p>
//             <div className="work-item">
//               <FontAwesomeIcon icon={faCheckCircle} className="work-icon" />
//               <div>
//                 <strong>ZXCXZCCZ</strong>
//                 <p>task management · You updated this today</p>
//               </div>
//             </div>
//             <div className="work-item">
//               <FontAwesomeIcon icon={faCheckCircle} className="work-icon" />
//               <div>
//                 <strong>New todo</strong>
//                 <p>task management · You updated this today</p>
//               </div>
//             </div>
//             <div className="work-item">
//               <FontAwesomeIcon icon={faCheckCircle} className="work-icon" />
//               <div>
//                 <strong>fdffdfdffsdsdsdsds</strong>
//                 <p>task management and dashboard · You created this on October 22, 2024</p>
//               </div>
//             </div>
//             <p className="view-all">View all</p>
//           </div>

//           <div className="places-work">
//             <h3>Places you work in</h3>
//             <div className="place-item">
//               <span className="jira-logo">Jira</span>
//               <p>task management</p>
//             </div>
//             <div className="place-item">
//               <span className="jira-logo">Jira</span>
//               <p>task management and dashboard</p>
//             </div>
//           </div>

//           <div className="works-with">
//             <h3>Works with</h3>
//             <button className="collaborators-button">Collaborators</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;
import React, { useState, useEffect } from "react";
// import { FaGlobe } from 'react-icons/fa';
import UserImage from "../assets/images/male.png";
import UserDetails from "../dummyData.json";
import { useDispatch, useSelector } from "react-redux";
import { setLogInUser } from "../redux/slices/authSlice";

// Reusable ProfileField component with "Anyone" label
const ProfileField = ({ label, value, onSave }) => {
  const [editMode, setEditMode] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  // Handle input change
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  // Auto-save when leaving edit mode
  useEffect(() => {
    if (!editMode && inputValue !== value) {
      onSave(inputValue);
    }
  }, [editMode]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "15px",
      }}
    >
      <div style={{ flex: 1 }}>
        <label style={{ fontWeight: "bold" }}>{label}</label>
        {editMode ? (
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            onBlur={() => setEditMode(false)}
            autoFocus
            style={{
              width: "100%",
              padding: "5px",
              marginTop: "5px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        ) : (
          <div
            // onClick={() => setEditMode(true)}
            style={{ marginTop: "5px", cursor: "pointer" }}
          >
            {inputValue || "Click to edit"}
          </div>
        )}
      </div>
      <div
        style={{ display: "flex", alignItems: "center", marginLeft: "10px" }}
      >
        {/* <FaGlobe color="#888" title="Anyone can see this" /> */}
        {/* <span style={{ marginLeft: "5px", color: "#888" }}>Anyone</span> */}
      </div>
    </div>
  );
};

const ManageAccount = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [profileData, setProfileData] = useState({
    fullName: user?.name,
    jobTitle: user?.role?.toUpperCase() || "Manager",
    department: user?.department || "Your department",
    organization: "Shanti Infosoft LLP",
    location: "Indore",
  });

  const [profilePhoto, setProfilePhoto] = useState(
    user?.profilePhoto ? user?.profilePhoto : UserImage
  );
  const [coverImage, setCoverImage] = useState(
    user?.coverImage ? user?.coverImage : UserImage
  );

  // Function to save field data (simulate API save)
  const handleSave = (field, value) => {
    const updatedData = {
      ...profileData,
      [field]: value,
    };
    setProfileData(updatedData);
    dispatch(setLogInUser({ ...user, ...updatedData }));
  };

  // Handle profile photo upload
  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePhoto(reader.result);
        handleSave("profilePhoto", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle cover image upload
  const handleCoverImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCoverImage(reader.result);
        handleSave("coverImage", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}
        className="title"
      >
        Profile and visibility
      </h1>
      <p style={{ fontSize: "14px" }}>
        Manage your personal information, and control which information other
        people see and apps may access.
      </p>

      {/* Cover image with profile photo overlay */}
      <div
        style={{
          position: "relative",
          marginBottom: "40px",
          textAlign: "center",
        }}
      >
        {/* Cover Image */}
        <div
          style={{
            width: "100%",
            height: "150px",
            backgroundColor: "#e0e7ff",
            backgroundImage: `url(${coverImage || ""})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverImageUpload}
            style={{ display: "none" }}
            id="cover-upload"
          />
          <label
            htmlFor="cover-upload"
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              textAlign: "center",
              lineHeight: "150px",
              fontSize: "16px",
              color: "#333",
              cursor: "pointer",
            }}
          >
            {coverImage ? "" : "Upload Cover Image"}
          </label>
        </div>

        {/* Profile Photo Overlay */}
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            backgroundImage: `url(${profilePhoto || ""})`,
            backgroundColor: "#0052cc",
            backgroundSize: "cover",
            backgroundPosition: "center",
            cursor: "pointer",
            position: "absolute",
            bottom: "-30px",
            left: "50%",
            transform: "translateX(-50%)",
            border: "3px solid white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePhotoUpload}
            style={{ display: "none" }}
            id="profile-upload"
          />
          <label
            htmlFor="profile-upload"
            style={{
              width: "100%",
              height: "100%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {!profilePhoto && "PM"}
          </label>
        </div>
      </div>

      {/* About you section */}
      <div
        style={{ background: "#f0f4f7", padding: "20px", borderRadius: "8px" }}
      >
        <h3
          style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}
        >
          About You
        </h3>

        <ProfileField
          label="Full Name"
          value={profileData.fullName}
          onSave={(value) => handleSave("fullName", value)}
        />
        {/* <ProfileField
          label='Public Name'
          value={profileData.publicName}
          onSave={(value) => handleSave('publicName', value)}
        /> */}
        <ProfileField
          label="Job Title"
          value={profileData.jobTitle}
          onSave={(value) => handleSave("jobTitle", value)}
        />
        <ProfileField
          label="Department"
          value={profileData.department}
          onSave={(value) => handleSave("department", value)}
        />
        <ProfileField
          label="Organization"
          value={profileData.organization}
          onSave={(value) => handleSave("organization", value)}
        />
        <ProfileField
          label="Location"
          value={profileData.location}
          onSave={(value) => handleSave("location", value)}
        />
      </div>
    </div>
  );
};

export default ManageAccount;
