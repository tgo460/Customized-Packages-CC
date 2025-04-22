const { exec } = require('child_process');
const path = require('path');

const services = [
    { name: 'Flight Service', path: 'flight-service' },
    { name: 'Hotel Service', path: 'hotel-service' },
    { name: 'Bus Service', path: 'bus-service' }
];

console.log('Starting to seed all services...\n');

let completedServices = 0;

services.forEach(service => {
    console.log(`Seeding ${service.name}...`);
    
    exec(`cd ${service.path} && npm run seed`, (error, stdout, stderr) => {
        if (error) {
            console.error(`\nError seeding ${service.name}:`);
            console.error(error.message);
            return;
        }
        if (stderr) {
            console.error(`\nWarning from ${service.name}:`);
            console.error(stderr);
        }
        
        console.log(`\n${service.name} seeding output:`);
        console.log(stdout);
        
        completedServices++;
        
        if (completedServices === services.length) {
            console.log('\nAll services have been seeded successfully!');
            process.exit(0);
        }
    });
}); 