import React from "react";
import malePlaceholder from "../assets/images/male.png"; // fallback if image missing

const birthdayData = [
  {
    id: 1,
    name: "Sarah Johnson",
    department: "HR",
    date: "April 3",
    image: "/api/placeholder/40/40",
  },
  {
    id: 2,
    name: "Michael Chen",
    department: "Engineering",
    date: "April 8",
    image: "/api/placeholder/40/40",
  },
  {
    id: 3,
    name: "Jessica Williams",
    department: "Marketing",
    date: "April 12",
    image: "/api/placeholder/40/40",
  },
  {
    id: 4,
    name: "David Rodriguez",
    department: "Finance",
    date: "April 16",
    image: "/api/placeholder/40/40",
  },
  {
    id: 5,
    name: "Emily Thompson",
    department: "Operations",
    date: "April 22",
    image: "/api/placeholder/40/40",
  },
];

const calculateDaysUntil = (dateStr) => {
  const [month, day] = dateStr.split(" ");
  const today = new Date();
  const currentYear = today.getFullYear();
  let birthDate = new Date(`${month} ${day}, ${currentYear}`);

  if (birthDate < today) {
    birthDate.setFullYear(currentYear + 1);
  }

  const diffTime = birthDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const BirthdayCard = () => {
  return (
    <div className="birthday-container">
      <div className="birthday-card">
        {/* Header */}
        <div className="birthday-header">
          <div>
            <h2>🎂 Upcoming Birthdays</h2>
            <p>April 2025</p>
          </div>
          <button className="view-all-button">View All</button>
        </div>

        {/* List */}
        <div className="birthday-list">
          {birthdayData.map((employee) => {
            const daysUntil = calculateDaysUntil(employee.date);
            return (
              <div key={employee.id} className="birthday-item">
                <div className="employee-img-wrap">
                  <img
                    src={employee.image || malePlaceholder}
                    alt={employee.name}
                    className="employee-img"
                  />
                  <div className="badge">{employee.date.split(" ")[1]}</div>
                </div>
                <div className="employee-info">
                  <h4>{employee.name}</h4>
                  <p>{employee.department}</p>
                </div>
                <div className="date-info">
                  <span>{employee.date}</span>
                  <p>{daysUntil === 0 ? "🎉 Today!" : `${daysUntil} days left`}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="birthday-footer">
          <button className="send-wishes-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="button-icon"
              viewBox="0 0 24 24"
              fill="none"
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
  );
};

export default BirthdayCard;
