document.addEventListener('DOMContentLoaded', () => {
  // --- SEAT SELECTOR ---
  const seatsGrid = document.querySelector('.seats-grid');
  const seatsCountInput = document.getElementById('numSeats');
  const selectedSeatsDisplay = document.getElementById('selectedSeatsDisplay');
  const totalFareDisplay = document.getElementById('totalFareDisplay');

  let selectedSeats = [];
  const baseFarePerSeat = 850; // Example base rate in INR

  if (seatsGrid) {
    // Generate mock seat layout
    const rows = 6;
    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= 4; c++) {
        // Create aisle
        if (c === 3) {
          const aisle = document.createElement('div');
          aisle.className = 'seat-aisle';
          seatsGrid.appendChild(aisle);
        }

        const colLetter = String.fromCharCode(64 + c); // A, B, C, D
        const seatId = `${r}${colLetter}`;
        
        const seatBox = document.createElement('div');
        seatBox.className = 'seat-box';
        seatBox.innerText = seatId;

        // Mock some pre-booked seats
        if ((r === 2 && c === 2) || (r === 4 && c === 4) || (r === 1 && c === 1)) {
          seatBox.classList.add('booked');
        } else {
          seatBox.addEventListener('click', () => {
            toggleSeat(seatBox, seatId);
          });
        }
        seatsGrid.appendChild(seatBox);
      }
    }
  }

  function toggleSeat(seatBox, seatId) {
    if (seatBox.classList.contains('selected')) {
      seatBox.classList.remove('selected');
      selectedSeats = selectedSeats.filter(id => id !== seatId);
    } else {
      seatBox.classList.add('selected');
      selectedSeats.push(seatId);
    }
    updateSeatDetails();
  }

  function updateSeatDetails() {
    if (seatsCountInput) {
      seatsCountInput.value = selectedSeats.length || '';
    }
    if (selectedSeatsDisplay) {
      selectedSeatsDisplay.innerText = selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None';
    }
    if (totalFareDisplay) {
      totalFareDisplay.innerText = `₹${selectedSeats.length * baseFarePerSeat}`;
    }
  }

  // Sync manual input changes to seat selections (optional reset)
  if (seatsCountInput) {
    seatsCountInput.addEventListener('input', () => {
      // Clear selections if manually typing seat count
      const selectedBoxes = document.querySelectorAll('.seat-box.selected');
      selectedBoxes.forEach(box => box.classList.remove('selected'));
      selectedSeats = [];
      if (selectedSeatsDisplay) selectedSeatsDisplay.innerText = 'Manual Selection';
      if (totalFareDisplay) {
        const val = parseInt(seatsCountInput.value) || 0;
        totalFareDisplay.innerText = `₹${val * baseFarePerSeat}`;
      }
    });
  }

  // --- FORM VALIDATION & CONFIRMATION ---
  const bookingForm = document.getElementById('bookingForm');
  const confirmationModal = document.getElementById('successModal');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (validateForm()) {
        const passengerDetails = getFormData();
        showSuccessPopup(passengerDetails);
      }
    });

    // Handle Direct WhatsApp Booking Button
    const btnWhatsappBooking = document.getElementById('btnWhatsappBooking');
    if (btnWhatsappBooking) {
      btnWhatsappBooking.addEventListener('click', (e) => {
        e.preventDefault();
        if (validateForm()) {
          const details = getFormData();
          const whatsappUrl = generateWhatsappUrl(details);
          window.open(whatsappUrl, '_blank');
        }
      });
    }
  }

  function validateForm() {
    const name = document.getElementById('passengerName');
    const phone = document.getElementById('passengerPhone');
    const email = document.getElementById('passengerEmail');
    const pickup = document.getElementById('pickupPoint');
    const drop = document.getElementById('dropPoint');
    const date = document.getElementById('travelDate');
    const busType = document.getElementById('busType');

    // Simple alerts or validation feedback
    if (!name.value.trim()) { alert('Please enter Passenger Name.'); name.focus(); return false; }
    if (!phone.value.trim() || phone.value.trim().length < 10) { alert('Please enter a valid 10-digit Phone Number.'); phone.focus(); return false; }
    if (!pickup.value) { alert('Please select a Pickup Point.'); pickup.focus(); return false; }
    if (!drop.value) { alert('Please select a Drop Point.'); drop.focus(); return false; }
    if (pickup.value === drop.value) { alert('Pickup and Drop points cannot be the same.'); drop.focus(); return false; }
    if (!date.value) { alert('Please select your Travel Date.'); date.focus(); return false; }
    if (!busType.value) { alert('Please select your preferred Bus Type.'); busType.focus(); return false; }

    return true;
  }

  function getFormData() {
    return {
      name: document.getElementById('passengerName').value.trim(),
      phone: document.getElementById('passengerPhone').value.trim(),
      email: document.getElementById('passengerEmail').value.trim() || 'N/A',
      pickup: document.getElementById('pickupPoint').value,
      drop: document.getElementById('dropPoint').value,
      date: document.getElementById('travelDate').value,
      seatsCount: seatsCountInput ? (seatsCountInput.value || 1) : 1,
      seatsList: selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Auto-Assigned',
      busType: document.getElementById('busType').value,
      specialRequest: document.getElementById('specialRequest').value.trim() || 'None',
      totalFare: totalFareDisplay ? totalFareDisplay.innerText : `₹${(seatsCountInput ? parseInt(seatsCountInput.value) || 1 : 1) * baseFarePerSeat}`
    };
  }

  function showSuccessPopup(details) {
    // Fill success modal details
    const summaryHtml = `
      <ul class="list-group list-group-flush text-start mb-4">
        <li class="list-group-item d-flex justify-content-between"><strong>Passenger:</strong> <span>${details.name}</span></li>
        <li class="list-group-item d-flex justify-content-between"><strong>Phone:</strong> <span>${details.phone}</span></li>
        <li class="list-group-item d-flex justify-content-between"><strong>Route:</strong> <span>${details.pickup} to ${details.drop}</span></li>
        <li class="list-group-item d-flex justify-content-between"><strong>Date:</strong> <span>${details.date}</span></li>
        <li class="list-group-item d-flex justify-content-between"><strong>Seats (${details.seatsCount}):</strong> <span>${details.seatsList}</span></li>
        <li class="list-group-item d-flex justify-content-between"><strong>Bus Type:</strong> <span>${details.busType}</span></li>
        <li class="list-group-item d-flex justify-content-between"><strong>Total Fare:</strong> <span class="text-primary fw-bold">${details.totalFare}</span></li>
      </ul>
    `;

    const summaryContainer = document.getElementById('bookingSummary');
    if (summaryContainer) {
      summaryContainer.innerHTML = summaryHtml;
    }

    // Trigger bootstrap modal
    if (typeof bootstrap !== 'undefined' && confirmationModal) {
      const modal = new bootstrap.Modal(confirmationModal);
      modal.show();

      // Reset form on modal dismiss
      confirmationModal.addEventListener('hidden.bs.modal', () => {
        bookingForm.reset();
        selectedSeats = [];
        updateSeatDetails();
      });
    } else {
      // Fallback popup if bootstrap JS is not loaded
      alert(`Booking Successful!\nRoute: ${details.pickup} to ${details.drop}\nDate: ${details.date}\nSeats: ${details.seatsList}\nTotal: ${details.totalFare}`);
      bookingForm.reset();
      selectedSeats = [];
      updateSeatDetails();
    }
  }

  function generateWhatsappUrl(details) {
    const phoneNumber = '919999999999'; // Agency Contact Phone Number
    const message = `Hello Shree Balaji Travels, I would like to book a bus ticket.
Here are my travel details:
- *Name:* ${details.name}
- *Phone:* ${details.phone}
- *Route:* ${details.pickup} to ${details.drop}
- *Date:* ${details.date}
- *Seats Count:* ${details.seatsCount}
- *Seats Selected:* ${details.seatsList}
- *Bus Preference:* ${details.busType}
- *Special Request:* ${details.specialRequest}
- *Estimated Fare:* ${details.totalFare}`;

    return `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
  }
});
