import React, { useEffect, useState } from "react";
import male from '../assets/images/male.png';

import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import project from "../assets/images/users-solid.svg";
import task from "../assets/images/clipboard-user-solid.svg";
import user from "../assets/images/thumbs-up-solid.svg";
import admin from "../assets/images/gift-solid.svg";
import todo from "../assets/images/sack-dollar-solid.svg";
import progress from "../assets/images/calendar-check-solid.svg";
import Calendar from "./Calendar";
import { getAllEmployees, getBirthdaysThisMonth, getDepartmentStats } from '../services/api';
import { leaveService } from '../services/leaveService';

const Cards = () => {
  const projects = useSelector((state) => state.project.projects);
  const sprintsData = useSelector((state) => state.sprints.projects);
  const members = useSelector((state) => state.team.members);

  const [employeeCount, setEmployeeCount] = useState(0);
  const [leaveApproved, setLeaveApproved] = useState(0);
  const [leavePending, setLeavePending] = useState(0);
  const [departmentStats, setDepartmentStats] = useState([]);
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Employees
        const empRes = await getAllEmployees();
        setEmployeeCount(empRes.data.employees.length);
        // Department stats
        const deptRes = await getDepartmentStats();
        setDepartmentStats(deptRes.data.stats);
        // Birthdays
        const month = new Date().getMonth() + 1;
        const bdayRes = await getBirthdaysThisMonth(month);
        setBirthdays(bdayRes.data.employees);
        // Leave stats
        const leaves = await leaveService.getAllLeaves();
        setLeaveApproved(leaves.data.leaves.filter(l => l.status === 'Approved').length);
        setLeavePending(leaves.data.leaves.filter(l => l.status === 'Pending').length);
      } catch (e) {
        setEmployeeCount(0);
        setDepartmentStats([]);
        setBirthdays([]);
        setLeaveApproved(0);
        setLeavePending(0);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cardData = [
    {
      icon: "fa-solid fa-users",
      title: "EMPLOYEE",
      value: employeeCount,
      img: project,
      className: "",
    },
    {
      icon: "fa-solid fa-clipboard-user",
      title: "Leave Approved",
      value: leaveApproved,
      img: task,
      className: "card-col2",
    },
    {
      icon: "fa-solid fa-thumbs-up",
      title: "LEAVE Pending",
      value: leavePending,
      img: user,
      className: "card-col3",
    },
    {
      icon: "fa-solid fa-sack-dollar",
      title: "PAYROLL",
      value: "-",
      img: todo,
      className: "card-col5",
    },
    {
      icon: "fa-solid fa-building",
      title: "DEPARTMENTS",
      value: departmentStats.length,
      img: progress,
      className: "card-col6",
    },
  ];
  
  // Sample data for the attendance chart
  const attendanceData = [
    { month: "Jan", present: 92, absent: 5, late: 3 },
    { month: "Feb", present: 88, absent: 7, late: 5 },
    { month: "Mar", present: 90, absent: 6, late: 4 },
    { month: "Apr", present: 93, absent: 4, late: 3 },
    { month: "May", present: 87, absent: 8, late: 5 },
    { month: "Jun", present: 91, absent: 5, late: 4 },
  ];

  // Sample data for the birthday reminder
  const birthdayData = birthdays.map(emp => ({
    id: emp._id,
    name: emp.name,
    department: emp.department,
    date: emp.dob ? new Date(emp.dob).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
    image: emp.profilePhoto ? `http://localhost:5000/${emp.profilePhoto}` : male
  }));
  
  // Function to sort the birthday data by upcoming birthday
  const sortBirthdayData = (data) => {
    const today = new Date();
    const currentYear = today.getFullYear();
  
    // Convert birthday date string (month day) to full Date object for sorting
    return data.sort((a, b) => {
      const [monthA, dayA] = a.date.split(" ");
      const [monthB, dayB] = b.date.split(" ");
      
      const birthDateA = new Date(`${monthA} ${dayA}, ${currentYear}`);
      const birthDateB = new Date(`${monthB} ${dayB}, ${currentYear}`);
  
      // If the birthday has passed, move it to the next year
      if (birthDateA < today) birthDateA.setFullYear(currentYear + 1);
      if (birthDateB < today) birthDateB.setFullYear(currentYear + 1);
  
      return birthDateA - birthDateB; // Sort in ascending order of date
    });
  };
  
  // Sorted data
  const sortedBirthdayData = sortBirthdayData(birthdayData);
  
  console.log(sortedBirthdayData);
  

  const calculateDaysUntil = (dateStr) => {
    if (!dateStr) return null;
  
    const [month, day] = dateStr.split(" ");
    if (!month || !day) return null;
  
    const today = new Date();
    const currentYear = today.getFullYear();
    const birthDate = new Date(`${month} ${day}, ${currentYear}`);
  
    if (isNaN(birthDate)) return null;
  
    if (birthDate < today) {
      birthDate.setFullYear(currentYear + 1);
    }
  
    const diffTime = birthDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>;
  }

  return (
    <>
      <div className="container-fluid main-card">
        <div className="row">
        <div className="col-md-7 col-xl-7">
  <div className="row">
    {cardData.map((card, index) => (
      <div className="col-md-4 col-xl-4 mb-3" key={index}>
        <div className="card order-card">
          <div className="card-block">
            <div className="card-icons">
              <div>
                <h2 className="text-right">
                  <i className={card.icon}></i>
                </h2>
                <h6 className="m-b-20 card-title text-uppercase">{card.title}</h6>
                <h3 className="fw-bold mt-2">{card.value}</h3>
              </div>
              <div className={`card-icon-bg ${card.className}`}>
                <img src={card.img} alt="dashboard" className="card-img" />
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>


          <div className="col-md-5 col-xl-5">
            <Calendar/>
            {/* <div className="card">
              <div className="card-header bg-white border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Calendar</h5>
                  <div>
                    <button className="btn btn-sm btn-outline-secondary me-2">
                      <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-secondary">
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
                <p className="text-muted mb-0 mt-2">April 2025</p>
              </div>
              <div className="card-body pt-0">
                <table className="table table-borderless text-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-danger">Sun</th>
                      <th>Mon</th>
                      <th>Tue</th>
                      <th>Wed</th>
                      <th>Thu</th>
                      <th>Fri</th>
                      <th className="text-danger">Sat</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-muted small">30</td>
                      <td className="text-muted small">31</td>
                      <td className="current-day">1</td>
                      <td>2</td>
                      <td>3</td>
                      <td>4</td>
                      <td className="text-danger">5</td>
                    </tr>
                    <tr>
                      <td className="text-danger">6</td>
                      <td>7</td>
                      <td>8</td>
                      <td>9</td>
                      <td>10</td>
                      <td>11</td>
                      <td className="text-danger">12</td>
                    </tr>
                    <tr>
                      <td className="text-danger">13</td>
                      <td>14</td>
                      <td>15</td>
                      <td className="event-day">16</td>
                      <td>17</td>
                      <td>18</td>
                      <td className="text-danger">19</td>
                    </tr>
                    <tr>
                      <td className="text-danger">20</td>
                      <td>21</td>
                      <td>22</td>
                      <td className="holiday-day">23</td>
                      <td>24</td>
                      <td>25</td>
                      <td className="text-danger">26</td>
                    </tr>
                    <tr>
                      <td className="text-danger">27</td>
                      <td>28</td>
                      <td>29</td>
                      <td>30</td>
                      <td className="text-muted small">1</td>
                      <td className="text-muted small">2</td>
                      <td className="text-muted text-danger small">3</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div> */}
          </div>
        </div>
        <div className="row mt-4">
        
          <div className="col-md-7 col-xl-7">
            <div className="card chart-card">
              <div className="card-header bg-white border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-0">Employee Attendance Overview</h5>
                    <p className="text-muted mb-0 mt-1">
                      Monthly attendance statistics (%)
                    </p>
                  </div>
                  <div>
                    <select className="form-select form-select-sm">
                      <option>Last 6 Months</option>
                      <option>Last 12 Months</option>
                      <option>This Year</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={attendanceData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="present" fill="#4CAF50" name="Present" />
                    <Bar dataKey="absent" fill="#F44336" name="Absent" />
                    <Bar dataKey="late" fill="#FFC107" name="Late" />
                  </BarChart>
                </ResponsiveContainer>

                <div className="row mt-4">
                  <div className="col-md-4">
                    <div className="p-3 bg-light-success rounded">
                      <div className="d-flex align-items-center">
                        <i className="fa-solid fa-check-circle text-success me-2 fs-4"></i>
                        <div>
                          <h6 className="mb-0">Average Present</h6>
                          <h3 className="mb-0 text-success">90.2%</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-light-danger rounded">
                      <div className="d-flex align-items-center">
                        <i className="fa-solid fa-times-circle text-danger me-2 fs-4"></i>
                        <div>
                          <h6 className="mb-0">Average Absent</h6>
                          <h3 className="mb-0 text-danger">5.8%</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-light-warning rounded">
                      <div className="d-flex align-items-center">
                        <i className="fa-solid fa-exclamation-circle text-warning me-2 fs-4"></i>
                        <div>
                          <h6 className="mb-0">Average Late</h6>
                          <h3 className="mb-0 text-warning">4.0%</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-5 col-xl-5">
          <div className="birthday-container">
            <div className="birthday-card">
              {/* Header Section */}
              <div className="birthday-header">
                <div className="header-content">
                  <div>
                    <h2 className="header-title">Upcoming Birthdays</h2>
                    <p className="header-subtitle">April 2025</p>
                  </div>
                  <button className="view-all-button">View All</button>
                </div>
              </div>

              {/* Birthday List */}
              <div className="birthday-list">
                {sortedBirthdayData.map((employee) => {
                  const daysUntil = calculateDaysUntil(employee.date);
                  return (
                    <div key={employee.id} className="birthday-item">
                      <div className="employee-image-container">
                        <img
                          src={employee.image}
                          alt={employee.name}
                          className="employee-image"
                        />
                        <div className="date-badge">
                          {employee.date.split(" ")[1]}
                        </div>
                      </div>

                      <div className="employee-info">
                        <h3 className="employee-name">{employee.name}</h3>
                        <p
                          className={`employee-department dept-${employee.department.toLowerCase()}`}
                        >
                          {employee.department}
                        </p>
                      </div>

                      <div className="birthday-date-container">
                        <div className="birthday-date">{employee.date}</div>
                        <p className="days-left">
                          {daysUntil === 0
                            ? "Today!"
                            : `${daysUntil} days left`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer Section */}
              <div className="birthday-footer">
                <button className="send-wishes-button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="button-icon"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  Send Birthday Wishes
                </button>
              </div>
            </div>
          </div>
</div>
        
      
          
        </div>
      </div>
    </>
  );
};

export default Cards;
