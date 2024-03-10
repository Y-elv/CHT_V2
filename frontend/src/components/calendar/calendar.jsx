import React, { useState } from 'react';
import './calendar.css'; 
import Modal from 'react-modal'

Modal.setAppElement('#root'); 


const CalendarInput = ({professionalName, district,serviceName}) => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isConfirm,setIsConfirm] = useState(false)

 
  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };


  const closeConfirm =()=>{
    setIsConfirm(false)
      }

  const handleDayClick = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const formatSelectedDays = () => {
    return selectedDays.map(day => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // Note: month is zero-based, so add 1
      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    });
  };

  const handleConfirm = async(event) => {
    event.preventDefault();
    const formattedSelectedDays = formatSelectedDays();
    console.log(`You have selected: ${formattedSelectedDays.join(', ')}`);
    console.log(`the time for your appointment ${selectedTime}`)
    
  const requestBody = {
    ProfessionalName: professionalName, 
    date: formattedSelectedDays[0],
    time: selectedTime, 
    district: district,
    serviceName: serviceName,
  };
  
  try {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const token = user.token;
    console.log('token:', token);
    const response = await fetch('https://kind-fox-sweatsuit.cyclic.app/api/v1/chatapp/booking/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,

      },
      body: JSON.stringify(requestBody),
     
      
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Booking successful:', data);
      setSelectedDays([]);
      setSelectedTime('');
      setIsConfirm(true);
    } else {
      console.error('Error submitting booking:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
  };

  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const days = [];

    for (let i = 1 - firstDayOfWeek; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      const isCurrentMonth = dayDate.getMonth() === month;
      const dayNumber = isCurrentMonth ? dayDate.getDate() : '';
      days.push(
        <div
          key={dayDate}
          className={`day ${selectedDays.includes(dayNumber) ? 'selected' : ''} ${isCurrentMonth ? '' : 'inactive'}`}
          onClick={() => isCurrentMonth ? handleDayClick(dayNumber) : null}
        >
          {dayNumber}
        </div>
      );
    }
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <>
    <form onSubmit={handleConfirm}>
    <div className="calendar-input">
      <h6>Pick from a vast range of our doctors at any time of the day</h6>
      <div className="calendar-header">
        <button onClick={handlePrevMonth} className="nav-btn">
          <i className="fas fa-chevron-left" style={{ fontSize: '12px' }}></i>
        </button>
        <div className="current-date ">
        {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()} {currentDate.toLocaleString('default', { weekday: 'long' })}
        </div>
        <button onClick={handleNextMonth} className="nav-btn">
          <i className="fas fa-chevron-right"style={{ fontSize: '12px' }} ></i>
        </button>
      </div>
      <div className="days">{renderDays()}</div>
      <div className="selected-days">
        <strong>Selected Days:</strong> {selectedDays.join(', ')}
      </div>
      <label>
            Select Time:
            <input
              type="time"
              value={selectedTime}
              onChange={handleTimeChange}
            />
          </label>
      <button 
      type='submit'
      value='Submit'
      className='btn-confirm'
        
        
        
      >
        Confirm
      </button>
    </div>
    </form>
    
    <Modal
    isOpen={isConfirm}
    onRequestClose={closeConfirm}
    style={{
      overlay: {
        backgroundColor: "#1F2633",
      },
      content: {
        color: "black",
        backgroundColor: "#B8C2D7",
        height: "55vh",
        width: "80vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",

        
      },
    }}
    >
    <p style="font-size: small;"> Hoolay !!
Your meet up request has been received And Your daoctor has Been notified. Check your email for confirmation</p>
    </Modal>
    </>
  );
};

export default CalendarInput;
