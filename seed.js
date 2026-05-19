const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cidco_portal';

// Define same Schema
const CfcApplicationSchema = new mongoose.Schema({
    cfcId: { type: String, required: true, unique: true },
    serviceCategory: { type: String, required: true },
    nodeName: { type: String, required: true },
    applicantName: { type: String, required: true },
    plotNumber: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: String, default: 'Submitted' },
    documents: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

const CfcApplication = mongoose.model('CfcApplication', CfcApplicationSchema);

async function seed() {
    try {
        console.log('Connecting to MongoDB at:', MONGODB_URI);
        await mongoose.connect(MONGODB_URI);
        console.log('Connected successfully! Inserting mock record...');

        // Clear existing mock data first if any
        await CfcApplication.deleteMany({});

        const mockApp = new CfcApplication({
            cfcId: 'CFC9999',
            serviceCategory: 'noc',
            nodeName: 'belapur',
            applicantName: 'Aryan Aglawe (Mock Portal Entry)',
            plotNumber: 'Sector 15, Plot 42',
            mobileNumber: '9876543210',
            email: 'aryan@example.com',
            address: 'CIDCO Bhavan Complex, CBD Belapur, Navi Mumbai',
            status: 'Submitted',
            documents: []
        });

        await mockApp.save();
        console.log('Mock record created successfully!');
        console.log('----------------------------------------------------');
        console.log('CFC ID: CFC9999');
        console.log('Applicant: Aryan Aglawe');
        console.log('----------------------------------------------------');
        console.log('Please open MongoDB Compass now, hit refresh, and you will see the database!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

seed();
