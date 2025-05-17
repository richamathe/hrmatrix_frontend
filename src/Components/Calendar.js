import React, { useState } from "react";
import dayjs from "dayjs";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";



const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const startOfMonth = currentDate.startOf("month");
  const endOfMonth = currentDate.endOf("month");
  const startDate = startOfMonth.startOf("week"); // Sunday
  const endDate = endOfMonth.endOf("week"); // Saturday

  const handlePrevMonth = () => {
    setCurrentDate(prev => prev.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => prev.add(1, "month"));
  };

  const generateCalendar = () => {
    let day = startDate.clone();
    const calendar = [];
  
    while (day.isBefore(endDate, "day")) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(day.clone());
        day = day.add(1, "day");
      }
      calendar.push(week);
    }
  
    return calendar;
  };
  
  const calendar = generateCalendar();

  return (
    <div className="card">
      <div className="card-header bg-white border-0">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Calendar</h5>
          <div>
            <button
              className="btn btn-sm btn-outline-secondary me-2"
              onClick={handlePrevMonth}
            >
             <IoIosArrowBack />

            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={handleNextMonth}
            >
              <IoIosArrowForward />

            </button>
          </div>
        </div>
        <p className="text-muted mb-0 mt-2">
          {currentDate.format("MMMM YYYY")}
        </p>
      </div>

      <div className="card-body pt-0">
        <table className="table table-borderless text-center mb-0">
          <thead>
            <tr>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                <th key={index} className={index === 0 || index === 6 ? "text-danger" : ""}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calendar.map((week, weekIndex) => (
              <tr key={weekIndex}>
                {week.map((day, dayIndex) => {
                  const isCurrentMonth = day.month() === currentDate.month();
                  const isToday = day.isSame(dayjs(), "day");

                  return (
                    <td
                      key={dayIndex}
                      className={`
                        ${!isCurrentMonth ? "text-muted small" : ""}
                        ${day.day() === 0 || day.day() === 6 ? "text-danger" : ""}
                        ${isToday ? "current-day fw-bold text-primary" : ""}
                      `}
                    >
                      {day.date()}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Calendar;
