import { useRef } from 'react'
import html2canvas from 'html2canvas'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'

export default function Calendar() {
  const calendarRef = useRef()

  const myArray = [
    { name: 'Event A', start: '2025-05-28T10:00:00', end: '2025-05-28T11:00:00' },
    { name: 'Event B', start: '2025-05-29T07:00:00', end: '2025-05-29T08:00:00' },
  ]

  const events = myArray.map(({ name: title, start, end }) => ({ title, start, end }))

  const downloadImage = () => {
    html2canvas(calendarRef.current).then(canvas => {
      const link = document.createElement('a')
      link.download = 'calendar.png'
      link.href = canvas.toDataURL()
      link.click()
    })
  }

  return (
    <>
      <button onClick={downloadImage}>Download</button>
      <div ref={calendarRef}>
        <FullCalendar
          headerToolbar={{
            start: '',
            center: 'title',
            end: ''
          }}
          titleFormat={() => 'Midterm Schedule'}
          plugins={[timeGridPlugin]}
          contentHeight="auto"
          initialView="timeGridWeek"
          initialDate="2025-05-28"
          weekends={false}
          slotMinTime="07:00:00"
          slotMaxTime="18:00:00"
          hiddenDays={[0, 1, 2, 6]}
          allDaySlot={false}
          slotDuration="00:20:00"
          events={events}
        />
      </div>
    </>
  )
}
