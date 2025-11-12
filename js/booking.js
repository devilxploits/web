// Premium Booking System
class BookingSystem {
    constructor() {
        this.selectedDate = null;
        this.selectedTime = null;
        this.selectedService = 'consultation';
        this.currentWeekStart = new Date();
        this.initializeEventListeners();
        this.generateDates();
        this.generateTimeSlots();
    }

    initializeEventListeners() {
        // Open booking modal
        const bookNowBtns = document.querySelectorAll('#floatingBookBtn, .book-now-btn, #scheduleMeetBtn');
        bookNowBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal();
            });
        });

        // Close booking modal
        const closeBtn = document.getElementById('closeBookingModal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        const closeAfterBooking = document.getElementById('closeAfterBooking');
        if (closeAfterBooking) {
            closeAfterBooking.addEventListener('click', () => this.closeModal());
        }

        // Close on outside click
        const modal = document.getElementById('bookingModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // Date navigation
        const prevWeekBtn = document.getElementById('prevWeek');
        const nextWeekBtn = document.getElementById('nextWeek');
        
        if (prevWeekBtn) {
            prevWeekBtn.addEventListener('click', () => this.navigateWeek(-1));
        }
        if (nextWeekBtn) {
            nextWeekBtn.addEventListener('click', () => this.navigateWeek(1));
        }

        // Form submission
        const bookingForm = document.getElementById('finalBookingForm');
        if (bookingForm) {
            bookingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitBooking();
            });
        }
    }

    openModal() {
        const modal = document.getElementById('bookingModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.updateBusinessHours();
        }
    }

    closeModal() {
        const modal = document.getElementById('bookingModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            this.resetBooking();
        }
    }

    resetBooking() {
        this.selectedDate = null;
        this.selectedTime = null;
        
        // Hide form and summary
        const formSection = document.getElementById('bookingFormSection');
        const summarySection = document.getElementById('bookingSummary');
        if (formSection) formSection.style.display = 'none';
        if (summarySection) summarySection.style.display = 'none';
        
        // Clear selections
        document.querySelectorAll('.date-option').forEach(opt => opt.classList.remove('selected'));
        document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));
        
        // Reset form
        const form = document.getElementById('finalBookingForm');
        if (form) form.reset();
    }

    updateBusinessHours() {
        const now = new Date();
        const hours = now.getHours();
        const day = now.getDay();
        
        let status = 'Open until 5:00 PM';
        
        if (day === 0) {
            status = 'Closed on Sundays';
        } else if (day === 6) {
            status = 'Saturday: By Appointment Only';
        } else if (hours >= 17) {
            status = 'Closed - Opens Tomorrow 8:00 AM';
        } else if (hours < 8) {
            status = 'Opens at 8:00 AM';
        }
        
        const statusElement = document.querySelector('.booking-info-item:has(.fa-clock) span');
        if (statusElement) {
            statusElement.textContent = status;
        }
    }

    generateDates() {
        const datePicker = document.getElementById('datePicker');
        if (!datePicker) return;

        datePicker.innerHTML = '';
        
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(this.currentWeekStart);
            date.setDate(date.getDate() + i);
            
            const dayName = days[date.getDay()];
            const dayNumber = date.getDate();
            const isToday = this.isToday(date);
            const isPast = date < new Date().setHours(0, 0, 0, 0);
            const isSunday = date.getDay() === 0;
            
            const dateOption = document.createElement('div');
            dateOption.className = 'date-option';
            if (isPast || isSunday) dateOption.classList.add('disabled');
            if (isToday) dateOption.classList.add('today');
            
            dateOption.innerHTML = `
                <div class="date-day">${dayName}</div>
                <div class="date-number">${dayNumber}</div>
            `;
            
            if (!isPast && !isSunday) {
                dateOption.addEventListener('click', () => this.selectDate(date, dateOption));
            }
            
            datePicker.appendChild(dateOption);
        }
        
        this.updateWeekDisplay();
    }

    navigateWeek(direction) {
        this.currentWeekStart.setDate(this.currentWeekStart.getDate() + (direction * 7));
        this.generateDates();
    }

    updateWeekDisplay() {
        const display = document.getElementById('currentWeekDisplay');
        if (!display) return;

        const endDate = new Date(this.currentWeekStart);
        endDate.setDate(endDate.getDate() + 6);
        
        const options = { month: 'long', day: 'numeric' };
        const startStr = this.currentWeekStart.toLocaleDateString('en-US', options);
        const endStr = endDate.toLocaleDateString('en-US', options);
        
        display.textContent = `${startStr} - ${endStr}`;
    }

    isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }

    selectDate(date, element) {
        document.querySelectorAll('.date-option').forEach(opt => opt.classList.remove('selected'));
        element.classList.add('selected');
        this.selectedDate = date;
        
        // Clear time selection
        this.selectedTime = null;
        document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));
        
        // Hide form
        const formSection = document.getElementById('bookingFormSection');
        if (formSection) formSection.style.display = 'none';
    }

    generateTimeSlots() {
        this.generateSlotsForPeriod('morningSlots', 8, 12);
        this.generateSlotsForPeriod('afternoonSlots', 12, 17);
    }

    generateSlotsForPeriod(containerId, startHour, endHour) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        
        const intervals = [0, 45]; // 00 and 45 minutes
        
        for (let hour = startHour; hour < endHour; hour++) {
            intervals.forEach(minute => {
                const timeStr = this.formatTime(hour, minute);
                const slot = document.createElement('div');
                slot.className = 'time-slot';
                slot.textContent = timeStr;
                
                slot.addEventListener('click', () => this.selectTime(timeStr, slot));
                container.appendChild(slot);
            });
        }
    }

    formatTime(hour, minute) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const displayMinute = minute.toString().padStart(2, '0');
        return `${displayHour}:${displayMinute} ${period}`;
    }

    selectTime(time, element) {
        if (!this.selectedDate) {
            alert('Please select a date first');
            return;
        }

        document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));
        element.classList.add('selected');
        this.selectedTime = time;
        
        // Show booking form
        const formSection = document.getElementById('bookingFormSection');
        if (formSection) {
            formSection.style.display = 'block';
            formSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    async submitBooking() {
        const name = document.getElementById('bookingName').value;
        const email = document.getElementById('bookingEmail').value;
        const phone = document.getElementById('bookingPhone').value;
        const notes = document.getElementById('bookingNotes').value;
        const submitButton = document.querySelector('.btn-confirm-booking');

        const bookingData = {
            name,
            email,
            phone,
            notes,
            date: this.selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }),
            time: this.selectedTime,
            service: 'ONE-ON-ONE FREE CONSULTATION',
            duration: '45 minutes',
            timestamp: new Date().toISOString()
        };

        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';

        // Send email to admin using sendMail.php
        const success = await this.sendEmailNotification(bookingData);

        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-calendar-check"></i> Confirm Appointment';

        if (success) {
            // Show confirmation
            this.showConfirmation(bookingData);
        } else {
            alert('Failed to send booking confirmation. Please contact us directly at info@medtruecareservices.com or call +1 (234) 456-6677');
        }
    }

    showConfirmation(data) {
        // Hide form section
        const formSection = document.getElementById('bookingFormSection');
        if (formSection) formSection.style.display = 'none';

        // Show summary
        const summarySection = document.getElementById('bookingSummary');
        const summaryDate = document.getElementById('summaryDate');
        const summaryTime = document.getElementById('summaryTime');

        if (summarySection) summarySection.style.display = 'block';
        if (summaryDate) summaryDate.textContent = data.date;
        if (summaryTime) summaryTime.textContent = data.time;

        summarySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    async sendEmailNotification(data) {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('email', data.email);
            formData.append('phone', data.phone);
            formData.append('service', `APPOINTMENT BOOKING: ${data.service}`);
            formData.append('message', `
Appointment Details:
Date: ${data.date}
Time: ${data.time}
Duration: ${data.duration}

Additional Notes:
${data.notes || 'No additional notes provided'}

Booking Timestamp: ${data.timestamp}
            `.trim());

            const response = await fetch('sendMail.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.text();
            
            if (result.includes('success')) {
                console.log('Booking email sent successfully');
                return true;
            } else {
                console.error('Failed to send booking email:', result);
                return false;
            }
        } catch (error) {
            console.error('Error sending booking email:', error);
            return false;
        }
    }
}

// Initialize booking system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Load booking modal HTML
    fetch('booking-modal.html')
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML('beforeend', html);
            new BookingSystem();
        })
        .catch(error => console.error('Error loading booking modal:', error));
});
