import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Calendar from './Calendar';
import './Results.css'; // Add a CSS file for Results-specific styles

// Helper: Convert date string to ISO format with better error handling
function normalizeDate(dateStr) {
  if (!dateStr) return { success: false, error: 'Empty date string' };
  
  try {
    // Handle "May 28 2025" format specifically
    const date = new Date(dateStr);
    
    if (isNaN(date.getTime())) {
      return { success: false, error: `Invalid date: ${dateStr}` };
    }
    
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return { success: true, value: `${yyyy}-${mm}-${dd}` };
  } catch (error) {
    return { success: false, error: `Date parsing error: ${error.message}` };
  }
}

// Helper: Ensure time is in HH:MM format with validation
function normalizeTime(timeStr) {
  if (!timeStr) return { success: false, error: 'Empty time string' };
  
  const parts = timeStr.split(':');
  if (parts.length !== 2) {
    return { success: false, error: `Invalid time format: ${timeStr}` };
  }
  
  const [hour, minute] = parts;
  const hourNum = parseInt(hour);
  const minNum = parseInt(minute);
  
  // Validate hour and minute ranges
  if (isNaN(hourNum) || isNaN(minNum) || hourNum < 0 || hourNum > 23 || minNum < 0 || minNum > 59) {
    return { success: false, error: `Invalid time values: ${timeStr}` };
  }
  
  const h = String(hourNum).padStart(2, '0');
  const m = String(minNum).padStart(2, '0');
  
  return { success: true, value: `${h}:${m}` };
}

// Helper: Remove duplicates based on unique key
function removeDuplicates(schedules) {
  const seen = new Set();
  return schedules.filter(schedule => {
    // Create unique key from schedule properties
    const key = `${schedule.classCode}-${schedule.course}-${schedule.date}-${schedule.time}`;
    if (seen.has(key)) {
      console.log('Duplicate schedule found:', schedule);
      return false;
    }
    seen.add(key);
    return true;
  });
}

function scheduleToEvent(schedule, index) {
  const errors = [];

  if (!schedule) {
    return { success: false, error: 'Schedule is null/undefined', schedule, index };
  }

  if (!schedule.date) {
    errors.push('Missing date');
  }

  if (!schedule.time) {
    errors.push('Missing time');
  }

  if (errors.length > 0) {
    return {
      success: false,
      error: errors.join(', '),
      schedule,
      index
    };
  }

  const dateResult = normalizeDate(schedule.date);
  if (!dateResult.success) {
    return {
      success: false,
      error: `Date error: ${dateResult.error}`,
      schedule,
      index
    };
  }

  const timeParts = schedule.time.split('-');
  if (timeParts.length !== 2) {
    return {
      success: false,
      error: `Invalid time format: ${schedule.time}`,
      schedule,
      index
    };
  }

  const [startRaw, endRaw] = timeParts.map(s => s.trim());

  const startResult = normalizeTime(startRaw);
  const endResult = normalizeTime(endRaw);
  if (!startResult.success) {
    return {
      success: false,
      error: `Start time error: ${startResult.error}`,
      schedule,
      index
    };
  }

  if (!endResult.success) {
    return {
      success: false,
      error: `End time error: ${endResult.error}`,
      schedule,
      index
    };
  }

  let [startHour, startMin] = startResult.value.split(':').map(Number);
  let [endHour, endMin] = endResult.value.split(':').map(Number);

  // If start is in the AM range and end is also lower, assume both are PM
  if (startHour < 7) startHour += 12;
  if (endHour < 7) endHour += 12;

  const start = `${dateResult.value}T${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}:00`;
  const end = `${dateResult.value}T${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}:00`;

  if (new Date(start) >= new Date(end)) {
    return {
      success: false,
      error: `End time (${endRaw}) must be after start time (${startRaw})`,
      schedule,
      index
    };
  }

  return {
    success: true,
    event: {
      id: schedule._id?.$oid || `schedule-${index}`,
      title: `${schedule.course} (${schedule.classCode})`,
      start,
      end,
      extendedProps: {
        classCode: schedule.classCode,
        course: schedule.course,
        room: schedule.room,
        college: schedule.college,
        examSem: schedule.examSem,
        academicYear: schedule.academicYear,
        originalIndex: index
      },
    }
  };
}


const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Defensive: If location.state is missing, show error
  if (!location.state) {
    return (
      <div className="results-container">
        <h1 className="results-title">Exam Schedule Results</h1>
        <div className="results-error">
          <h3 className="font-bold">No Schedule Data Found</h3>
          <p className="mt-2">
            No schedule data was provided. This can happen if you refreshed the page or navigated here directly.<br />
            Please return to the home page and upload or select your schedule again.
          </p>
        </div>
        <button
          className="results-btn"
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Log raw incoming data for debugging
  React.useEffect(() => {
    console.log('location.state:', location.state);
  }, [location.state]);
  
  // Read schedule data from location.state
  const dbSchedules = location.state?.dbSchedules || [];
  const ocrResults = location.state?.ocrResults || [];
  const allSchedules = dbSchedules.length > 0 ? dbSchedules : ocrResults;

  // Remove duplicates first
  const uniqueSchedules = removeDuplicates(allSchedules);
  
  React.useEffect(() => {
    console.log('Original schedules:', allSchedules.length);
    console.log('Unique schedules:', uniqueSchedules.length);
    console.log('Schedules data:', uniqueSchedules);
  }, [allSchedules, uniqueSchedules]);

  // Convert schedules to calendar events with detailed error tracking
  const conversionResults = uniqueSchedules.map((schedule, index) => 
    scheduleToEvent(schedule, index)
  );
  
  // Separate successful events from failed ones
  const successfulEvents = conversionResults
    .filter(result => result.success)
    .map(result => result.event);
    
  const failedConversions = conversionResults.filter(result => !result.success);

  // Log any failures for debugging
  if (failedConversions.length > 0) {
    console.error('Failed to convert schedules:', failedConversions);
  }

  // Show detailed error information if no events were created
  if (successfulEvents.length === 0) {
    return (
      <div className="results-container">
        <h1 className="results-title">Exam Schedule Results</h1>
        <div className="results-error">
          <h3 className="font-bold">No Valid Exam Schedules Found</h3>
          <p className="mt-2">
            Found {uniqueSchedules.length} schedule(s) but couldn't convert any to calendar events.
          </p>
          {failedConversions.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold">Conversion Errors:</h4>
              <ul className="list-disc list-inside mt-2 text-sm">
                {failedConversions.map((failure, idx) => (
                  <li key={idx}>
                    Schedule #{failure.index + 1}: {failure.error}
                    {failure.schedule && (
                      <div className="ml-4 text-xs text-gray-600">
                        Class: {failure.schedule.classCode}, 
                        Date: {failure.schedule.date}, 
                        Time: {failure.schedule.time}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button
          className="results-btn"
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="results-container">
      <h1 className="results-title">
        Exam Schedule Results ({successfulEvents.length} exam{successfulEvents.length !== 1 ? 's' : ''})
      </h1>
      <div className="results-summary">
        {failedConversions.length > 0 && (
          <div className="results-warning">
            <p className="text-sm">
              Successfully converted {successfulEvents.length} out of {uniqueSchedules.length} schedules.
              {failedConversions.length} schedule(s) had errors and were skipped.
            </p>
          </div>
        )}
        {uniqueSchedules.length !== allSchedules.length && (
          <div className="results-info">
            <p className="text-sm">
              Removed {allSchedules.length - uniqueSchedules.length} duplicate schedule(s).
            </p>
          </div>
        )}
      </div>
      <div className="results-details">
        <h3 className="font-semibold mb-2">Schedule Details:</h3>
        {successfulEvents.map((event, index) => (
          <div key={event.id} className="results-detail-item">
            <strong>{event.extendedProps.course}</strong> ({event.extendedProps.classCode}) - 
            Room {event.extendedProps.room} - {event.extendedProps.college} - 
            {new Date(event.start).toLocaleDateString()} {new Date(event.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(event.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        ))}
      </div>
      <div className="results-calendar-wrapper">
        <Calendar events={successfulEvents} />
      </div>
      <button
        className="results-btn mt-6"
        onClick={() => navigate('/')}
      >
        Back to Home
      </button>
    </div>
  );
};

export default Results;