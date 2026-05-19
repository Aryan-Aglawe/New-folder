const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cidco_portal';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from current directory
app.use(express.static(path.join(__dirname)));
// Serve uploaded files static route
app.use('/uploads', express.static(uploadsDir));

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB Compass database at ' + MONGODB_URI);
    })
    .catch((err) => {
        console.error('MongoDB connection error details:', err.message);
        console.error('Please make sure MongoDB is running and MongoDB Compass is installed/active.');
    });

// Mongoose Schemas & Models
const CfcApplicationSchema = new mongoose.Schema({
    cfcId: { type: String, required: true, unique: true },
    serviceCategory: { type: String, required: true },
    nodeName: { type: String, required: true },
    applicantName: { type: String, required: true },
    plotNumber: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: String, default: 'Submitted' }, // Submitted, Verification, Site Survey, Approved
    documents: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

const PaymentSchema = new mongoose.Schema({
    transactionId: { type: String, required: true, unique: true },
    cfcId: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentDate: { type: Date, default: Date.now },
    status: { type: String, default: 'SUCCESSFUL' }
});

const CfcApplication = mongoose.model('CfcApplication', CfcApplicationSchema);
const Payment = mongoose.model('Payment', PaymentSchema);

// Admin Credentials & Session Schemas
const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    salt: { type: String, required: true },
    fullName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const AdminSessionSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 86400 } // Session automatically expires in 24 hours
});

const Admin = mongoose.model('Admin', AdminSchema);
const AdminSession = mongoose.model('AdminSession', AdminSessionSchema);

// Cryptography utility functions for secure password management
function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return { salt, hash };
}

function verifyPassword(password, salt, originalHash) {
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === originalHash;
}

// Authentication middleware for administrative endpoints
const authenticateAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ error: 'Access denied. Authorization token missing.' });
        }

        const token = authHeader.replace('Bearer ', '').trim();
        const session = await AdminSession.findOne({ token });
        if (!session) {
            return res.status(401).json({ error: 'Invalid or expired admin session. Please log in again.' });
        }

        req.adminUsername = session.username;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Internal verification check failed.' });
    }
};

// Multer Config for Document Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// ==========================================
// NODEMAILER EMAIL NOTIFICATION CONFIGURATION
// ==========================================
const nodemailer = require('nodemailer');

let transporter;
const isSmtpConfigured = !!(process.env.SMTP_USER && process.env.SMTP_PASS);

if (isSmtpConfigured) {
    transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Use SSL/TLS
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
    console.log('🔌 Nodemailer: Production SMTP configuration loaded (smtp.gmail.com:465).');
} else {
    // Dynamically create an Ethereal testing account so emails generate real web previews automatically!
    nodemailer.createTestAccount((err, account) => {
        if (err) {
            console.error('Failed to create Ethereal SMTP test account. Falling back to console logging.', err.message);
            transporter = {
                sendMail: async (mailOptions) => {
                    console.log('\n============= [SIMULATED EMAIL SENT] =============');
                    console.log(`To: ${mailOptions.to}`);
                    console.log(`Subject: ${mailOptions.subject}`);
                    console.log(`Body:\n${mailOptions.text}`);
                    console.log('==================================================\n');
                    return { messageId: 'simulated-' + Date.now() };
                }
            };
            return;
        }

        console.log('🔌 Nodemailer: Ethereal test SMTP account configured for payment success notifications!');
        console.log(`   Username: ${account.user}`);
        transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass
            }
        });
    });
}

// Email Sender Helper Function
async function sendPaymentSuccessEmail(toEmail, applicantName, cfcId, amount, txnId) {
    try {
        const mailOptions = {
            from: process.env.SMTP_USER ? `"CIDCO Citizen Portal" <${process.env.SMTP_USER}>` : '"CIDCO Citizen Portal" <no-reply@cidco.maharashtra.gov.in>',
            to: toEmail,
            subject: `Payment Successful - Estate Service Challan [Ref: ${txnId}]`,
            text: `Dear ${applicantName},\n\nYour payment of ₹${parseFloat(amount).toLocaleString('en-IN')}.00 for CFC Application ID: ${cfcId} has been successfully processed.\n\nTransaction Details:\n- Transaction Reference: ${txnId}\n- Amount Paid: ₹${amount}\n- Payment Date: ${new Date().toLocaleString()}\n\nYour application status has been updated to "Site Survey & Assessment". Our Estate Officer will contact you shortly for boundary verification.\n\nThank you for using CIDCO Estate Services.\n\nBest regards,\nCIDCO Citizen Support Team\nCity and Industrial Development Corporation of Maharashtra`,
            html: `
                <div style="font-family: 'Outfit', 'Plus Jakarta Sans', Arial, sans-serif; padding: 25px; background-color: #f8fafc; color: #1e293b;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                        <div style="background: linear-gradient(135deg, #10b981, #0d9488); padding: 30px; text-align: center; color: white;">
                            <h2 style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">CITY AND INDUSTRIAL DEVELOPMENT CORPORATION</h2>
                            <p style="margin: 5px 0 0 0; font-size: 13px; opacity: 0.9;">Government of Maharashtra Undertaking</p>
                        </div>
                        <div style="padding: 30px;">
                            <h3 style="color: #10b981; margin-top: 0; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 24px;">✓</span> Payment Successful!
                            </h3>
                            <p style="font-size: 15px; line-height: 1.6; color: #475569;">Dear <strong>${applicantName}</strong>,</p>
                            <p style="font-size: 15px; line-height: 1.6; color: #475569;">We are pleased to inform you that your online challan payment for estate services has been successfully processed.</p>
                            
                            <!-- Receipt Summary Table -->
                            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 25px 0;">
                                <table style="width: 100%; border-collapse: collapse; font-size: 14.5px;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-weight: 500; border-bottom: 1px solid #e2e8f0;">CFC Application ID</td>
                                        <td style="padding: 8px 0; text-align: right; color: #1e293b; font-weight: 700; border-bottom: 1px solid #e2e8f0;">${cfcId}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-weight: 500; border-bottom: 1px solid #e2e8f0;">Transaction Ref ID</td>
                                        <td style="padding: 8px 0; text-align: right; color: #1e293b; font-weight: 700; font-family: monospace; border-bottom: 1px solid #e2e8f0;">${txnId}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-weight: 500; border-bottom: 1px solid #e2e8f0;">Amount Paid</td>
                                        <td style="padding: 8px 0; text-align: right; color: #10b981; font-weight: 800; font-size: 16px; border-bottom: 1px solid #e2e8f0;">₹${parseFloat(amount).toLocaleString('en-IN')}.00</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Payment Date</td>
                                        <td style="padding: 8px 0; text-align: right; color: #1e293b; font-weight: 600;">${new Date().toLocaleString()}</td>
                                    </tr>
                                </table>
                            </div>
                            
                            <p style="font-size: 14px; line-height: 1.6; color: #475569;"><strong>Next Steps:</strong> Your application status has been updated to <strong>"Site Survey & Assessment"</strong>. A CIDCO Estate Officer will contact you to coordinate the physical boundary verification of your plot.</p>
                            <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px;">If you have any questions, please contact our citizen support center or check your application progress using the status tracker on our portal.</p>
                        </div>
                        <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 5px 0;">This is an automated notification. Please do not reply directly to this email.</p>
                            <p style="margin: 0;">© 2026 CIDCO Maharashtra Limited. All Rights Reserved.</p>
                        </div>
                    </div>
                </div>
            `
        };

        if (transporter && typeof transporter.sendMail === 'function') {
            const info = await transporter.sendMail(mailOptions);
            console.log(`[Email] Payment receipt email sent successfully to ${toEmail}: ${info.messageId}`);
            
            const previewUrl = nodemailer.getTestMessageUrl ? nodemailer.getTestMessageUrl(info) : null;
            if (previewUrl) {
                console.log(`[Email Preview Link] 📬 Preview URL: ${previewUrl}`);
                return { success: true, previewUrl };
            }
            return { success: true };
        }
        return { success: false, error: 'Transporter is not initialized.' };
    } catch (error) {
        console.error('[Email Error] Failed to send payment receipt email:', error);
        return { success: false, error: error.message };
    }
}

// REST API Endpoints

// Config Endpoint - Get SMTP Status
app.get('/api/config/smtp-status', (req, res) => {
    res.json({
        smtpActive: isSmtpConfigured,
        smtpUser: isSmtpConfigured ? process.env.SMTP_USER : null
    });
});

// 1. Submit CFC Application
app.post('/api/applications', async (req, res) => {
    try {
        const { serviceCategory, nodeName, applicantName, plotNumber, mobileNumber, email, address } = req.body;
        
        // Simple server-side validation
        if (!serviceCategory || !nodeName || !applicantName || !plotNumber || !mobileNumber || !email || !address) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Generate clean unique CFC Application ID (CFC + random 4-digit number)
        let isUnique = false;
        let cfcId = '';
        while (!isUnique) {
            cfcId = 'CFC' + Math.floor(1000 + Math.random() * 9000);
            const existing = await CfcApplication.findOne({ cfcId });
            if (!existing) isUnique = true;
        }

        const newApplication = new CfcApplication({
            cfcId,
            serviceCategory,
            nodeName,
            applicantName,
            plotNumber,
            mobileNumber,
            email,
            address,
            status: 'Submitted'
        });

        const savedApplication = await newApplication.save();
        console.log(`[MongoDB] Created CFC Application in DB: ${cfcId}`);
        res.status(201).json(savedApplication);
    } catch (error) {
        console.error('Error saving application:', error);
        res.status(500).json({ error: 'Failed to submit application. Database error occurred.' });
    }
});

// 2. Track CFC Application Status
app.get('/api/applications/:id', async (req, res) => {
    try {
        const cfcId = req.params.id.toUpperCase().trim();
        const application = await CfcApplication.findOne({ cfcId });
        
        if (!application) {
            return res.status(404).json({ error: `Application with ID ${cfcId} not found.` });
        }
        
        res.status(200).json(application);
    } catch (error) {
        console.error('Error fetching application:', error);
        res.status(500).json({ error: 'Database query error.' });
    }
});

// 3. Upload Verification Documents for Application
app.post('/api/applications/:id/upload', upload.single('document'), async (req, res) => {
    try {
        const cfcId = req.params.id.toUpperCase().trim();
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const application = await CfcApplication.findOne({ cfcId });
        if (!application) {
            return res.status(404).json({ error: `Application ${cfcId} not found.` });
        }

        // Update application's document list and progress status to "Verification"
        application.documents.push(req.file.filename);
        application.status = 'Verification';
        await application.save();

        console.log(`[MongoDB] File uploaded for application ${cfcId}: ${req.file.filename}`);
        res.status(200).json({
            message: 'File uploaded successfully!',
            filename: req.file.filename,
            application
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Failed to upload document and record in MongoDB.' });
    }
});

// 4. Create Online Payment for Estate Challan
app.post('/api/payments', async (req, res) => {
    try {
        const { cfcId, amount, paymentMethod } = req.body;

        if (!cfcId || !amount || !paymentMethod) {
            return res.status(400).json({ error: 'CFC Application ID, Amount and Payment Method are required.' });
        }

        // Verify application exists
        const application = await CfcApplication.findOne({ cfcId: cfcId.toUpperCase().trim() });
        if (!application) {
            return res.status(404).json({ error: `Application or Challan with ID ${cfcId} is not registered in our system.` });
        }

        // Generate Transaction Reference ID (TXN + random 6-digit number)
        let isUnique = false;
        let transactionId = '';
        while (!isUnique) {
            transactionId = 'TXN' + Math.floor(100000 + Math.random() * 900000);
            const existing = await Payment.findOne({ transactionId });
            if (!existing) isUnique = true;
        }

        const newPayment = new Payment({
            transactionId,
            cfcId: cfcId.toUpperCase().trim(),
            amount: parseFloat(amount),
            paymentMethod,
            status: 'SUCCESSFUL'
        });

        const savedPayment = await newPayment.save();

        // Update Application Status to "Site Survey & Assessment" once payment is made
        application.status = 'Site Survey';
        await application.save();

        console.log(`[MongoDB] Created Payment in DB: ${transactionId} for CFC Application: ${cfcId}`);

        // Send payment confirmation email notification to the citizen
        let emailResult = null;
        if (application.email) {
            emailResult = await sendPaymentSuccessEmail(
                application.email,
                application.applicantName,
                application.cfcId,
                amount,
                transactionId
            );
        }

        res.status(201).json({
            ...savedPayment.toObject(),
            emailSent: !!(emailResult && emailResult.success),
            emailPreviewUrl: (emailResult && emailResult.previewUrl) || null,
            emailError: (emailResult && emailResult.error) || null
        });
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ error: 'Database transaction failed.' });
    }
});

// 5. Retrieve Payment Receipt
app.get('/api/payments/:id', async (req, res) => {
    try {
        const transactionId = req.params.id.toUpperCase().trim();
        const payment = await Payment.findOne({ transactionId });

        if (!payment) {
            return res.status(404).json({ error: `Payment receipt with transaction reference ${transactionId} not found.` });
        }

        // Fetch application details to check email notification status
        const application = await CfcApplication.findOne({ cfcId: payment.cfcId });

        res.status(200).json({
            ...payment.toObject(),
            emailSent: !!(application && application.email),
            applicantEmail: (application && application.email) || null,
            smtpActive: isSmtpConfigured
        });
    } catch (error) {
        console.error('Error loading payment receipt:', error);
        res.status(500).json({ error: 'Database query error.' });
    }
});

// ==========================================
// ADMINISTRATIVE PORTAL ENDPOINTS (AUTHENTICATED)
// ==========================================

// A0. Admin Registration / Sign Up
app.post('/api/admin/register', async (req, res) => {
    try {
        const { username, password, fullName } = req.body;
        if (!username || !password || !fullName) {
            return res.status(400).json({ error: 'All registration fields are required.' });
        }

        const cleanUsername = username.toLowerCase().trim();
        const existing = await Admin.findOne({ username: cleanUsername });
        if (existing) {
            return res.status(400).json({ error: 'This administrator username is already taken.' });
        }

        const { salt, hash } = hashPassword(password);
        const newAdmin = new Admin({
            username: cleanUsername,
            passwordHash: hash,
            salt: salt,
            fullName: fullName.trim()
        });

        await newAdmin.save();
        console.log(`[Admin DB] Registered new admin account: ${cleanUsername}`);
        res.status(201).json({ message: 'Administrator profile registered successfully!' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Failed to register administrator.' });
    }
});

// A0b. Admin Authentication / Login
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }

        const cleanUsername = username.toLowerCase().trim();
        const admin = await Admin.findOne({ username: cleanUsername });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid administrator credentials.' });
        }

        const isValid = verifyPassword(password, admin.salt, admin.passwordHash);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid administrator credentials.' });
        }

        // Create secure session token
        const token = crypto.randomBytes(32).toString('hex');
        const session = new AdminSession({
            token,
            username: cleanUsername
        });
        await session.save();

        console.log(`[Admin Session] Active login registered for: ${cleanUsername}`);
        res.status(200).json({
            token,
            username: admin.username,
            fullName: admin.fullName
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Database session validation failed.' });
    }
});

// A1. Retrieve All Applications for Admin Dashboard (Protected)
app.get('/api/admin/applications', authenticateAdmin, async (req, res) => {
    try {
        const applications = await CfcApplication.find().sort({ createdAt: -1 });
        res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching admin applications:', error);
        res.status(500).json({ error: 'Failed to fetch applications for administration panel.' });
    }
});

// A2. Update Progress/Scrutiny Status of an Application (Protected)
app.patch('/api/admin/applications/:cfcId/status', authenticateAdmin, async (req, res) => {
    try {
        const cfcId = req.params.cfcId.toUpperCase().trim();
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: 'Status value is required.' });
        }

        const updatedApplication = await CfcApplication.findOneAndUpdate(
            { cfcId },
            { status },
            { new: true }
        );

        if (!updatedApplication) {
            return res.status(404).json({ error: `Application with ID ${cfcId} not found.` });
        }

        console.log(`[Admin Action] Status of application ${cfcId} updated to '${status}' by admin '${req.adminUsername}'`);
        res.status(200).json(updatedApplication);
    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({ error: 'Failed to save application status update.' });
    }
});


// Catch-all route to serve index.html for frontend routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`========================================================================`);
    console.log(`🚀 CIDCO Full-Stack Citizen Portal running at: http://localhost:${PORT}`);
    console.log(`🔌 Connect MongoDB Compass to: mongodb://127.0.0.1:27017/cidco_portal`);
    console.log(`========================================================================`);
});
