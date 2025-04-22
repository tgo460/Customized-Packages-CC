// DOM Elements
const searchForm = document.getElementById('searchForm');
const resultsSection = document.getElementById('results');
const packageResults = document.getElementById('packageResults');
const filterButtons = document.querySelectorAll('.filter-btn');
const bookingModal = document.getElementById('bookingModal');
const closeBtn = document.querySelector('.close-btn');
const bookingForm = document.getElementById('bookingForm');
const bookingSummary = document.getElementById('bookingSummary');
const totalPriceElement = document.getElementById('totalPrice');

// Global Variables
let currentPackages = [];
let selectedPackage = null;

// Navigation Handlers
document.querySelector('.nav-links').addEventListener('click', async (e) => {
    e.preventDefault();
    if (e.target.tagName === 'A') {
        const section = e.target.getAttribute('href').substring(1);
        switch(section) {
            case 'search':
                document.getElementById('search').classList.remove('hidden');
                document.getElementById('results').classList.add('hidden');
                document.getElementById('bookings').classList.add('hidden');
                break;
            case 'packages':
                document.getElementById('search').classList.add('hidden');
                document.getElementById('results').classList.remove('hidden');
                // Load all available packages
                try {
                    const response = await fetch('/api/packages');
                    const packages = await response.json();
                    currentPackages = packages;
                    displayPackages(packages);
                } catch (error) {
                    console.error('Error loading packages:', error);
                }
                break;
            case 'bookings':
                document.getElementById('search').classList.add('hidden');
                document.getElementById('results').classList.add('hidden');
                document.getElementById('bookings').classList.remove('hidden');
                // Load user's bookings
                try {
                    const response = await fetch('/api/packages/bookings');
                    if (!response.ok) {
                        throw new Error('Failed to fetch bookings');
                    }
                    const bookings = await response.json();
                    displayBookings(bookings);
                } catch (error) {
                    console.error('Error loading bookings:', error);
                    const bookingsList = document.querySelector('.bookings-list');
                    bookingsList.innerHTML = `
                        <div class="error">
                            <h3>Error loading bookings</h3>
                            <p>${error.message}</p>
                            <p>Please try again later or contact support if the problem persists.</p>
                        </div>`;
                }
                break;
        }
    }
});

// Display Bookings
function displayBookings(bookings) {
    const bookingsList = document.querySelector('.bookings-list');
    bookingsList.innerHTML = '';
    
    if (!bookings || bookings.length === 0) {
        bookingsList.innerHTML = `
            <div class="no-results">
                <h3>No bookings found</h3>
                <p>You haven't made any bookings yet. Start by searching for packages!</p>
            </div>`;
        return;
    }

    bookings.forEach(booking => {
        const bookingCard = document.createElement('div');
        bookingCard.className = 'booking-card';
        bookingCard.innerHTML = `
            <h3>Booking ID: ${booking.packageId}</h3>
            <div class="booking-details">
                <p>Flight: ${booking.flight.airline} - ${booking.flight.flightNumber}</p>
                <p>Hotel: ${booking.hotel.name}</p>
                <p>Bus: ${booking.bus.operator}</p>
                <p>Total Price: ₹${booking.totalPrice}</p>
                <p>Status: ${booking.status}</p>
            </div>
        `;
        bookingsList.appendChild(bookingCard);
    });
}

// Event Listeners
searchForm.addEventListener('submit', handleSearch);
document.querySelector('.filters').addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
        handleFilter(e);
    }
});
closeBtn.addEventListener('click', () => bookingModal.classList.add('hidden'));
bookingForm.addEventListener('submit', handleBooking);

// Search Packages
async function handleSearch(e) {
    e.preventDefault();
    
    // Show loading state
    packageResults.innerHTML = '<div class="loading">Searching for packages...</div>';
    
    const searchData = {
        source: document.getElementById('source').value,
        destination: document.getElementById('destination').value,
        departureDate: document.getElementById('departureDate').value,
        budget: parseFloat(document.getElementById('budget').value),
        preferences: {
            flightClass: document.getElementById('flightClass').value,
            hotelRating: parseInt(document.getElementById('hotelRating').value),
            busType: document.getElementById('busType').value
        }
    };

    console.log('Sending search request with data:', searchData);

    try {
        const response = await fetch('/api/packages/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(searchData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Server error: ${errorData.message || response.statusText}`);
        }

        const data = await response.json();
        console.log('Raw server response:', data);
        
        // Store the packages in the global variable
        currentPackages = Array.isArray(data) ? data : data.packages || [];
        console.log('Processed packages:', currentPackages);
        
        if (currentPackages.length === 0) {
            packageResults.innerHTML = `
                <div class="no-results">
                    <h3>No packages found</h3>
                    <p>No travel packages found matching your criteria. This might be because:</p>
                    <ul>
                        <li>The total package cost exceeds your budget of ₹${searchData.budget}</li>
                        <li>No available flights, hotels, or buses for the selected dates</li>
                        <li>No combinations matching your preferences</li>
                    </ul>
                    <p>Try adjusting your search criteria:</p>
                    <ul>
                        <li>Increase your budget</li>
                        <li>Try different dates</li>
                        <li>Adjust your preferences (flight class, hotel rating, bus type)</li>
                    </ul>
                </div>`;
        } else {
            displayPackages(currentPackages);
            document.querySelector('.filters').style.display = 'flex';
        }
        resultsSection.classList.remove('hidden');
    } catch (error) {
        console.error('Error searching packages:', error);
        packageResults.innerHTML = `
            <div class="error">
                <h3>Error searching packages</h3>
                <p>${error.message}</p>
                <p>Please try again or contact support if the problem persists.</p>
            </div>`;
    }
}

// Display Packages
function displayPackages(packages) {
    packageResults.innerHTML = '';
    
    packages.forEach(pkg => {
        const card = document.createElement('div');
        card.className = 'package-card';
        card.innerHTML = `
            <h3>${pkg.flight.airline} - ${pkg.flight.flightNumber}</h3>
            <div class="service-details">
                <h4>Flight Details</h4>
                <p>Departure: ${formatDate(pkg.flight.departureTime)}</p>
                <p>Arrival: ${formatDate(pkg.flight.arrivalTime)}</p>
                <p>Price: ₹${pkg.flight.price}</p>
            </div>
            <div class="service-details">
                <h4>Hotel Details</h4>
                <p>${pkg.hotel.name} - ${pkg.hotel.roomType}</p>
                <p>Check-in: ${pkg.hotel.checkInTime}</p>
                <p>Price: ₹${pkg.hotel.price}</p>
            </div>
            <div class="service-details">
                <h4>Bus Details</h4>
                <p>${pkg.bus.operator} - ${pkg.bus.busNumber}</p>
                <p>Departure: ${formatDate(pkg.bus.departureTime)}</p>
                <p>Price: ₹${pkg.bus.price}</p>
            </div>
            <div class="price">Total Price: ₹${pkg.totalPrice}</div>
            <button class="book-btn" onclick="openBookingModal(${JSON.stringify(pkg).replace(/"/g, '&quot;')})">
                Book Now
            </button>
        `;
        packageResults.appendChild(card);
    });
}

// Filter Packages
function handleFilter(e) {
    const sortType = e.target.dataset.sort;
    console.log('Sort type:', sortType);
    console.log('Current packages before sort:', currentPackages);
    
    filterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    const sortedPackages = [...currentPackages];
    switch (sortType) {
        case 'price-low':
            sortedPackages.sort((a, b) => a.totalPrice - b.totalPrice);
            break;
        case 'price-high':
            sortedPackages.sort((a, b) => b.totalPrice - a.totalPrice);
            break;
        case 'duration':
            sortedPackages.sort((a, b) => {
                const durationA = new Date(a.flight.arrivalTime) - new Date(a.flight.departureTime);
                const durationB = new Date(b.flight.arrivalTime) - new Date(b.flight.departureTime);
                return durationA - durationB;
            });
            break;
    }
    console.log('Sorted packages:', sortedPackages);
    displayPackages(sortedPackages);
}

// Booking Modal
function openBookingModal(package) {
    selectedPackage = package;
    bookingModal.classList.remove('hidden');
    updateBookingSummary();
}

function updateBookingSummary() {
    if (!selectedPackage) return;

    const flightSeats = parseInt(document.getElementById('flightSeats').value) || 1;
    const hotelRooms = parseInt(document.getElementById('hotelRooms').value) || 1;
    const busSeats = parseInt(document.getElementById('busSeats').value) || 1;

    const totalPrice = (
        selectedPackage.flight.price * flightSeats +
        selectedPackage.hotel.price * hotelRooms +
        selectedPackage.bus.price * busSeats
    );

    bookingSummary.innerHTML = `
        <p>Flight: ${selectedPackage.flight.airline} (${flightSeats} seats) - ₹${selectedPackage.flight.price * flightSeats}</p>
        <p>Hotel: ${selectedPackage.hotel.name} (${hotelRooms} rooms) - ₹${selectedPackage.hotel.price * hotelRooms}</p>
        <p>Bus: ${selectedPackage.bus.operator} (${busSeats} seats) - ₹${selectedPackage.bus.price * busSeats}</p>
    `;
    totalPriceElement.textContent = `₹${totalPrice}`;
}

// Handle Booking
async function handleBooking(e) {
    e.preventDefault();

    if (!selectedPackage) return;

    const bookingData = {
        packageId: selectedPackage,
        flightSeats: parseInt(document.getElementById('flightSeats').value),
        hotelRooms: parseInt(document.getElementById('hotelRooms').value),
        busSeats: parseInt(document.getElementById('busSeats').value)
    };

    try {
        const response = await fetch('/api/packages/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });

        const result = await response.json();
        alert('Booking successful! Booking ID: ' + result.bookingDetails.packageId);
        bookingModal.classList.add('hidden');
        searchForm.reset();
        resultsSection.classList.add('hidden');
    } catch (error) {
        console.error('Error booking package:', error);
        alert('Error booking package. Please try again.');
    }
}

// Utility Functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
}

// Add input event listeners for booking form
['flightSeats', 'hotelRooms', 'busSeats'].forEach(id => {
    document.getElementById(id).addEventListener('input', updateBookingSummary);
}); 