# Travel Package Customizer - Product Requirements Document

## 1. Project Overview
The Travel Package Customizer is a microservices-based application that allows users to search, customize, and book complete travel packages including flights, hotels, and bus services.

## 2. System Architecture
The application consists of four microservices:
1. Flight Service
2. Hotel Service
3. Bus Service
4. Package Service (Main Service)

## 3. API Endpoints

### Flight Service
```
GET /api/flights
- Get all available flights

POST /api/flights/search
- Search flights based on criteria
- Request Body:
  {
    source: string,
    destination: string,
    departureDate: string,
    class: string
  }

POST /api/flights/book
- Book flight seats
- Request Body:
  {
    flightId: string,
    numberOfSeats: number
  }
```

### Hotel Service
```
GET /api/hotels
- Get all available hotels

POST /api/hotels/search
- Search hotels based on criteria
- Request Body:
  {
    location: string,
    checkInDate: string,
    rating: number
  }

POST /api/hotels/book
- Book hotel rooms
- Request Body:
  {
    hotelId: string,
    roomType: string,
    numberOfRooms: number
  }
```

### Bus Service
```
GET /api/buses
- Get all available buses

POST /api/buses/search
- Search buses based on criteria
- Request Body:
  {
    source: string,
    destination: string,
    departureDate: string,
    busType: string
  }

POST /api/buses/book
- Book bus seats
- Request Body:
  {
    busId: string,
    seatNumbers: number
  }
```

### Package Service (Main Service)
```
GET /api/packages
- Get all available packages

POST /api/packages/search
- Search packages based on criteria
- Request Body:
  {
    source: string,
    destination: string,
    departureDate: string,
    budget: number,
    preferences: {
      flightClass: string,
      hotelRating: number,
      busType: string
    }
  }

POST /api/packages/book
- Book a complete package
- Request Body:
  {
    packageId: string,
    flightSeats: number,
    hotelRooms: number,
    busSeats: number
  }

GET /api/packages/bookings
- Get all user bookings

GET /api/packages/:id
- Get package details by ID
```

## 4. Setup Instructions

### Prerequisites
1. Node.js (v14 or higher)
2. MongoDB
3. npm or yarn

### Step 1: Environment Setup
1. Create a `.env` file in the root directory with:
```
MONGODB_URI=mongodb://localhost:27017/travel-packages
PORT=3000
FLIGHT_SERVICE_URL=http://localhost:3001
HOTEL_SERVICE_URL=http://localhost:3002
BUS_SERVICE_URL=http://localhost:3003
```

### Step 2: Install Dependencies
```bash
# Install root dependencies
npm install

# Install dependencies for each service
cd flight-service && npm install
cd ../hotel-service && npm install
cd ../bus-service && npm install
cd ../packages-service && npm install
```

### Step 3: Start MongoDB
```bash
# Start MongoDB service
mongod
```

### Step 4: Seed Initial Data
```bash
# Run the seed script
node seedAll.js
```

### Step 5: Start Services
```bash
# Start Flight Service
cd flight-service && npm start

# Start Hotel Service
cd hotel-service && npm start

# Start Bus Service
cd bus-service && npm start

# Start Package Service
cd packages-service && npm start
```

## 5. Frontend Features
1. Search Packages
   - Source and Destination
   - Departure Date
   - Budget
   - Preferences (Flight Class, Hotel Rating, Bus Type)

2. View Available Packages
   - Sort by Price (Low to High, High to Low)
   - Sort by Duration
   - View Package Details

3. Book Packages
   - Select Number of Seats/Rooms
   - View Booking Summary
   - Confirm Booking

4. View Bookings
   - List of All Bookings
   - Booking Details
   - Booking Status

## 6. Error Handling
- Proper error messages for invalid inputs
- Error handling for service unavailability
- User-friendly error messages in the UI

## 7. Security Considerations
- Input validation
- Error handling
- Secure API endpoints
- Environment variable protection

## 8. Testing
- Unit tests for each service
- Integration tests for service communication
- Frontend testing for UI components

## 9. Future Enhancements
1. User Authentication
2. Payment Integration
3. Email Notifications
4. Mobile Responsive Design
5. Admin Dashboard
6. Review and Rating System

Would you like me to provide more details about any specific aspect of the PRD or help with the setup process?
