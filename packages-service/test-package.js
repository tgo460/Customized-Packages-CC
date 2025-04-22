const axios = require('axios');

async function testPackageService() {
    try {
        // Test creating a package
        const packageData = {
            packageId: `PKG-${Date.now()}`,
            name: "Test Vacation Package",
            description: "A test package for verification",
            price: 999.99,
            duration: 7,
            services: {
                flight: {
                    id: "test-flight-id",
                    airline: "Test Airlines",
                    flightNumber: "TA123",
                    price: 300,
                    departureTime: new Date(),
                    arrivalTime: new Date()
                },
                hotel: {
                    id: "test-hotel-id",
                    name: "Test Hotel",
                    roomType: "Deluxe",
                    price: 500,
                    checkInTime: "14:00",
                    checkOutTime: "12:00"
                },
                bus: {
                    id: "test-bus-id",
                    operator: "Test Bus Co",
                    busNumber: "TB456",
                    price: 199.99,
                    departureTime: new Date(),
                    arrivalTime: new Date()
                }
            },
            totalPrice: 999.99,
            status: "available"
        };

        console.log('Testing package creation...');
        console.log('Package data:', JSON.stringify(packageData, null, 2));
        
        const createResponse = await axios.post('http://localhost:3000/api/packages', packageData);
        console.log('Create Package Response:', createResponse.data);

        // Test getting all packages
        console.log('\nTesting get all packages...');
        const getAllResponse = await axios.get('http://localhost:3000/api/packages');
        console.log('Get All Packages Response:', getAllResponse.data);

        // Test getting a specific package
        if (createResponse.data._id) {
            console.log('\nTesting get specific package...');
            const getOneResponse = await axios.get(`http://localhost:3000/api/packages/${createResponse.data._id}`);
            console.log('Get Specific Package Response:', getOneResponse.data);
        }

    } catch (error) {
        console.error('Error testing package service:');
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }
    }
}

testPackageService(); 