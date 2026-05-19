

let currentLang = 'en';
let currentTextSize = 'normal';
let paymentMethod = 'card';

// Automatically use absolute URL for backend API if loaded via file:/// protocol or external ports/hosts, otherwise relative
const API_BASE = (window.location.protocol === 'file:' || (!window.location.origin.includes('localhost:5000') && !window.location.origin.includes('127.0.0.1:5000')))
    ? 'http://localhost:5000'
    : '';

const translations = {
    en: {
        title: "CIDCO - Citizen Portal (Estate Services)",
        org_title: "CITY AND INDUSTRIAL DEVELOPMENT CORPORATION OF MAHARASHTRA LIMITED",
        org_subtitle: "(Government of Maharashtra Undertaking)",
        theme_btn: "Dark Mode",
        portal_title: "Citizen Portal- Estate Services",
        nav_cfc: "Submit Online CFC Application",
        nav_status: "Check status/Upload Documents",
        nav_downloads: "Download Formats, Undertakings etc.",
        nav_payment: "Online Payment",
        nav_receipt: "Print/View Estate Payment Receipt",
        welcome_title: "Welcome to CIDCO Citizen Portal",
        welcome_desc: "Access City and Industrial Development Corporation of Maharashtra estate services seamlessly online.",
        bhavan_title: "CIDCO Bhavan",
        bhavan_desc: "CBD Belapur, Navi Mumbai, Maharashtra, India",
        form_title: "Submit Online CFC Application",
        lbl_service: "Select Service Category",
        opt_select: "-- Select Option --",
        opt_noc: "No Objection Certificate (NOC)",
        opt_transfer: "Transfer of Tenancy Rights",
        opt_mortgage: "Mortgage Permission",
        opt_lease: "Extension of Lease Period",
        lbl_node: "Node Name",
        lbl_name: "Applicant Full Name",
        lbl_plot: "Plot Number / Sector Number",
        lbl_phone: "Mobile Number",
        lbl_email: "Email Address",
        lbl_address: "Correspondence Address",
        btn_submit_app: "Submit Application",
        track_title: "Check Status & Upload Documents",
        btn_track: "Track Application",
        tl_1: "CFC Application Submitted",
        tl_1_desc: "Your application has been received successfully by the CFC.",
        tl_2: "Verification of Documents",
        tl_2_desc: "Currently being scrutinized by the Estate Officer. Please upload required ID proofs below.",
        tl_3: "Site Survey & Assessment",
        tl_3_desc: "Visual inspection and boundary verification.",
        tl_4: "Final Approval & Generation",
        tl_4_desc: "Final signing off by the Joint Managing Director and certificate dispatch.",
        lbl_upload: "Upload Pending Verification Documents (PDF / Image)",
        btn_upload: "Upload File",
        dl_center_title: "Document Download Center",
        dl_center_desc: "Download official undertakings, indemnity bonds, and prescribed forms for estate transactions.",
        doc1_title: "Indemnity Bond Format",
        doc2_title: "Standard Affidavit (Annexure B)",
        doc3_title: "NOC Application Format",
        doc4_title: "Lease Agreement Undertaking",
        pay_title: "Estate Service Online Payment",
        lbl_pay_cfc: "CFC Application ID / Challan ID",
        lbl_pay_amt: "Payment Amount (INR)",
        lbl_pay_method: "Select Payment Method",
        pay_card: "Credit / Debit Card",
        pay_upi: "UPI Payment (GPay, PhonePe)",
        pay_net: "Net Banking",
        btn_pay: "Proceed & Pay Securely",
        rcpt_title: "Print & View Payment Receipt",
        btn_rcpt_load: "Load Receipt",
        rcpt_card_title: "Estate Services Payment Receipt",
        rcpt_govt: "Government of Maharashtra Undertaking",
        rcpt_lbl_id: "Transaction Reference ID",
        rcpt_lbl_cfc: "CFC Application ID",
        rcpt_lbl_date: "Payment Date & Time",
        rcpt_lbl_status: "Status",
        rcpt_status_val: "SUCCESSFUL",
        rcpt_lbl_total: "Total Paid",
        btn_rcpt_print: "Print Receipt Document",
        bot_name: "CIDCO Assistant",
        bot_status: "Online (AI Helper)",
        bot_msg_welcome: "Hello! I'm your CIDCO Estate Assistant. How can I help you with your property applications, tracking, or documents today?",
        qr_1: "How to apply for NOC?",
        qr_2: "Check Application Status",
        qr_3: "Affidavit Formats",
        nav_admin: "Admin Dashboard",
        analytics_node_title: "Application Density by Node",
        analytics_ratio_title: "Status Allocation Share",
        auth_title: "CIDCO Admin Gate",
        auth_subtitle: "Authorized personnel access only",
        auth_tab_login: "Login",
        auth_tab_register: "Register",
        lbl_username: "Username",
        lbl_password: "Password",
        btn_login: "Access Admin Portal",
        lbl_full_name: "Full Name & Title",
        btn_register: "Register Profile"
    },
    mr: {
        title: "सिडको - नागरी पोर्टल (भूमी संपदा सेवा)",
        org_title: "शहर आणि औद्योगिक विकास महामंडळ महाराष्ट्र मर्यादित",
        org_subtitle: "(महाराष्ट्र शासनाचा उपक्रम)",
        theme_btn: "डार्क मोड",
        portal_title: "नागरी पोर्टल - भूमी संपदा सेवा",
        nav_cfc: "ऑनलाइन सीएफसी (CFC) अर्ज सादर करा",
        nav_status: "स्थिती तपासा / कागदपत्रे अपलोड करा",
        nav_downloads: "नमुने, हमीपत्रे इ. डाउनलोड करा",
        nav_payment: "ऑनलाइन पेमेंट (भरणा)",
        nav_receipt: "भूमी संपदा पेमेंट पावती प्रिंट / पहा",
        welcome_title: "सिडको नागरी पोर्टलवर आपले स्वागत आहे",
        welcome_desc: "महाराष्ट्र शहर आणि औद्योगिक विकास महामंडळाच्या भूमी संपदा सेवांचा थेट ऑनलाइन लाभ घ्या.",
        bhavan_title: "सिडको भवन",
        bhavan_desc: "सीबीडी बेलापूर, नवी मुंबई, महाराष्ट्र, भारत",
        form_title: "ऑनलाइन सीएफसी (CFC) अर्ज सादर करा",
        lbl_service: "सेवा वर्ग निवडा",
        opt_select: "-- पर्याय निवडा --",
        opt_noc: "ना हरकत प्रमाणपत्र (NOC)",
        opt_transfer: "भाडेकरू हक्क हस्तांतरण",
        opt_mortgage: "गहाण ठेवण्याची परवानगी",
        opt_lease: "पट्टा कालावधी वाढवणे",
        lbl_node: "नोडचे नाव",
        lbl_name: "अर्जदाराचे पूर्ण नाव",
        lbl_plot: "प्लॉट क्रमांक / सेक्टर क्रमांक",
        lbl_phone: "मोबाईल नंबर",
        lbl_email: "ईमेल पत्ता",
        lbl_address: "पत्राचार पत्ता",
        btn_submit_app: "अर्ज सबमिट करा",
        track_title: "स्थिती तपासा आणि कागदपत्रे अपलोड करा",
        btn_track: "स्थिती तपासा",
        tl_1: "सीएफसी अर्ज दाखल झाला",
        tl_1_desc: "तुमचा अर्ज सीएफसी कार्यालयात यशस्वीरित्या प्राप्त झाला आहे.",
        tl_2: "कागदपत्रांची छाननी",
        tl_2_desc: "सध्या संपदा अधिकाऱ्यांकडून छाननी चालू आहे. कृपया खालील आवश्यक ओळखपत्रे अपलोड करा.",
        tl_3: "स्थळ पाहणी आणि मूल्यांकन",
        tl_3_desc: "प्रत्यक्ष जागेची पाहणी आणि सीमा पडताळणी प्रक्रिया.",
        tl_4: "अंतिम मंजुरी आणि निर्मिती",
        tl_4_desc: "सह व्यवस्थापकीय संचालकांची स्वाक्षरी आणि प्रमाणपत्र वितरण.",
        lbl_upload: "प्रलंबित पडताळणी कागदपत्रे अपलोड करा (PDF / प्रतिमा)",
        btn_upload: "फाइल अपलोड करा",
        dl_center_title: "कागदपत्र डाउनलोड केंद्र",
        dl_center_desc: "अधिकृत प्रतिज्ञापत्रे, हमीपत्रे आणि विहित नमुने डाउनलोड करा.",
        doc1_title: "नुकसानभरपाई हमीपत्र नमुना",
        doc2_title: "विहित प्रतिज्ञापत्र (परिशिष्ट ब)",
        doc3_title: "ना हरकत प्रमाणपत्र (NOC) अर्ज नमुना",
        doc4_title: "भाडेपट्टा करार हमीपत्र",
        pay_title: "भूमी संपदा सेवा ऑनलाइन पेमेंट",
        lbl_pay_cfc: "CFC अर्ज आयडी / चलन आयडी",
        lbl_pay_amt: "भरणा रक्कम (INR)",
        lbl_pay_method: "पेमेंट पद्धत निवडा",
        pay_card: "क्रेडिट / डेबिट कार्ड",
        pay_upi: "UPI पेमेंट (GPay, PhonePe)",
        pay_net: "नेट बँकिंग",
        btn_pay: "सुरक्षित भरणा करा",
        rcpt_title: "पेमेंट पावती प्रिंट करा आणि पहा",
        btn_rcpt_load: "पावती शोधा",
        rcpt_card_title: "भूमी संपदा सेवा पेमेंट पावती",
        rcpt_govt: "महाराष्ट्र शासनाचा उपक्रम",
        rcpt_lbl_id: "व्यवहार संदर्भ आयडी",
        rcpt_lbl_cfc: "CFC अर्ज आयडी",
        rcpt_lbl_date: "पेमेंट तारीख आणि वेळ",
        rcpt_lbl_status: "स्थिती",
        rcpt_status_val: "यशस्वी",
        rcpt_lbl_total: "एकूण भरलेली रक्कम",
        btn_rcpt_print: "पावती दस्तऐवज प्रिंट करा",
        bot_name: "सिडको सहाय्यक",
        bot_status: "ऑनलाइन (AI मदतनीस)",
        bot_msg_welcome: "नमस्कार! मी तुमचा सिडको संपदा सहाय्यक आहे. मी तुम्हाला अर्ज दाखल करणे, ट्रॅकिंग करणे किंवा इतर माहिती कशी मदत करू?",
        qr_1: "NOC साठी कसा अर्ज करावा?",
        qr_2: "अर्जाची स्थिती तपासा",
        qr_3: "प्रतिज्ञापत्र नमुने",
        nav_admin: "प्रशासक डॅशबोर्ड",
        analytics_node_title: "नोडनुसार अर्ज घनता",
        analytics_ratio_title: "स्थिती वाटप हिस्सा",
        auth_title: "सिडको प्रशासक गेट",
        auth_subtitle: "केवळ अधिकृत कर्मचाऱ्यांसाठी प्रवेश",
        auth_tab_login: "लॉगिन",
        auth_tab_register: "नोंदणी",
        lbl_username: "वापरकर्तानाव",
        lbl_password: "पासवर्ड",
        btn_login: "प्रशासक पोर्टल उघडा",
        lbl_full_name: "पूर्ण नाव आणि पद",
        btn_register: "प्रोफाइलची नोंदणी करा"
    }
};

function toggleDarkMode() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    document.querySelector('.control-btn i').className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    document.querySelector('[data-lang="theme_btn"]').textContent = isDark ? 
        (currentLang === 'en' ? 'Light Mode' : 'लाईट मोड') : 
        (currentLang === 'en' ? 'Dark Mode' : 'डार्क मोड');
}

function resizeText(size) {
    const body = document.body;
    if (size === 'decrease') {
        body.style.fontSize = '14px';
    } else if (size === 'increase') {
        body.style.fontSize = '18px';
    } else {
        body.style.fontSize = '16px';
    }
}

// Language Translation Switcher
function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'mr' : 'en';
    document.getElementById('lang-btn').querySelector('span').textContent = currentLang === 'en' ? 'मराठी' : 'English';
    
    // Translate all elements with data-lang attribute
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });

    
    const placeholders = {
        en: {
            'tracking-id-input': 'Enter CFC Application ID (e.g. CFC9831)',
            'upload-file-input': '',
            'pay-id': 'e.g. CFC9831',
            'pay-amount': 'e.g. 5000',
            'receipt-id-input': 'Enter Transaction Reference / Challan ID (e.g. TXN55981)',
            'chat-input': 'Type a message...'
        },
        mr: {
            'tracking-id-input': 'CFC अर्ज आयडी प्रविष्ट करा (उदा. CFC9831)',
            'upload-file-input': '',
            'pay-id': 'उदा. CFC9831',
            'pay-amount': 'उदा. 5000',
            'receipt-id-input': 'व्यवहार संदर्भ / चलन आयडी प्रविष्ट करा (उदा. TXN55981)',
            'chat-input': 'संदेश टाईप करा...'
        }
    };

    Object.keys(placeholders[currentLang]).forEach(id => {
        const el = document.getElementById(id);
        if (el && placeholders[currentLang][id]) el.placeholder = placeholders[currentLang][id];
    });
}

// Navigation Controller with Admin Authentication Check
function switchView(viewId) {
    // Remove active classes
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));

    let targetViewId = viewId;

    // Secure access check for admin
    if (viewId === 'admin-dashboard') {
        const token = sessionStorage.getItem('adminToken');
        if (!token) {
            targetViewId = 'admin-auth';
            setTimeout(() => switchAuthTab('login'), 20);
        }
    }

    // Set active panel
    const targetSec = document.getElementById(`view-${targetViewId}`);
    if (targetSec) targetSec.classList.add('active');

    // Set active navigation button (always highlight the requested sidebar action)
    const targetNav = document.getElementById(`nav-${viewId}`);
    if (targetNav) targetNav.classList.add('active');

    if (viewId === 'admin-dashboard') {
        const token = sessionStorage.getItem('adminToken');
        if (token) {
            const officerName = sessionStorage.getItem('adminFullName') || 'Administrator';
            const welcomeSpan = document.getElementById('admin-welcome-name');
            if (welcomeSpan) welcomeSpan.textContent = `| Active Officer: ${officerName}`;
            
            loadAdminDashboard();
        }
    }
}

// ==========================================
// DYNAMIC ADMIN AUTHENTICATION CONTROLLERS
// ==========================================

function switchAuthTab(tab) {
    const loginForm = document.getElementById('admin-login-form');
    const registerForm = document.getElementById('admin-register-form');
    const loginBtn = document.getElementById('tab-login-btn');
    const registerBtn = document.getElementById('tab-register-btn');

    if (tab === 'login') {
        loginForm.style.display = 'flex';
        registerForm.style.display = 'none';
        loginBtn.classList.add('active');
        loginBtn.style.borderBottom = '2px solid var(--primary)';
        loginBtn.style.color = 'var(--primary)';
        registerBtn.classList.remove('active');
        registerBtn.style.borderBottom = '2px solid transparent';
        registerBtn.style.color = 'var(--text-muted)';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'flex';
        registerBtn.classList.add('active');
        registerBtn.style.borderBottom = '2px solid var(--primary)';
        registerBtn.style.color = 'var(--primary)';
        loginBtn.classList.remove('active');
        loginBtn.style.borderBottom = '2px solid transparent';
        loginBtn.style.color = 'var(--text-muted)';
    }
}

async function handleAdminRegister(e) {
    e.preventDefault();
    const form = e.target;
    
    const regData = {
        fullName: form.fullName.value,
        username: form.username.value,
        password: form.password.value
    };

    showToast('Registering', 'Registering administrator account with MongoDB...', 'success');

    try {
        const response = await fetch(`${API_BASE}/api/admin/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(regData)
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Registration failed.');
        }

        showToast('Success', 'Admin profile registered successfully! Switching to Login...', 'success');
        form.reset();
        setTimeout(() => {
            switchAuthTab('login');
        }, 1200);
    } catch (err) {
        console.error(err);
        showToast('Error', err.message, 'error');
    }
}

async function handleAdminLogin(e) {
    e.preventDefault();
    const form = e.target;
    
    const loginData = {
        username: form.username.value,
        password: form.password.value
    };

    showToast('Authenticating', 'Verifying credentials with MongoDB Compass...', 'success');

    try {
        const response = await fetch(`${API_BASE}/api/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Invalid credentials.');
        }

        // Store sessions securely in SessionStorage
        sessionStorage.setItem('adminToken', data.token);
        sessionStorage.setItem('adminUsername', data.username);
        sessionStorage.setItem('adminFullName', data.fullName);

        showToast('Authorized', `Welcome back, ${data.fullName}!`, 'success');
        form.reset();
        
        setTimeout(() => {
            switchView('admin-dashboard');
        }, 1000);
    } catch (err) {
        console.error(err);
        showToast('Access Denied', err.message, 'error');
    }
}

function handleAdminLogout() {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminUsername');
    sessionStorage.removeItem('adminFullName');
    
    showToast('Logged Out', 'Your administration session has been cleared.', 'success');
    switchView('admin-dashboard'); // Triggers auth screen since session is cleared
}

// Action Handlers & Real Backend Integration (MongoDB Compass)
async function handleCfcSubmit(e) {
    e.preventDefault();
    const form = e.target;
    
    const formData = {
        serviceCategory: form.serviceCategory.value,
        nodeName: form.nodeName.value,
        applicantName: form.applicantName.value,
        plotNumber: form.plotNumber.value,
        mobileNumber: form.mobileNumber.value,
        email: form.email.value,
        address: form.address.value
    };

    showToast('Submitting', currentLang === 'en' ? 'Sending application to MongoDB...' : 'अर्ज डेटाबेसमध्ये सबमिट करत आहे...', 'success');

    try {
        const response = await fetch(`${API_BASE}/api/applications`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Server error occurred.');
        }

        const appDetails = await response.json();
        
        showToast('Success', currentLang === 'en' ? 
            `Application saved in MongoDB! ID: ${appDetails.cfcId}` : 
            `अर्ज डेटाबेसमध्ये जतन केला! आयडी: ${appDetails.cfcId}`, 'success');

        // Auto navigate to Status Tracker and prefill ID
        setTimeout(() => {
            switchView('status-tracking');
            document.getElementById('tracking-id-input').value = appDetails.cfcId;
            trackApplication();
        }, 1500);

        form.reset();
    } catch (err) {
        console.error(err);
        showToast('Error', currentLang === 'en' ? `Failed to connect with backend database. Make sure server is running!` : `डेटाबेसशी कनेक्ट करण्यात अयशस्वी. सर्व्हर सुरू असल्याची खात्री करा!`, 'error');
    }
}

async function trackApplication() {
    const inputVal = document.getElementById('tracking-id-input').value.trim();
    if (!inputVal) {
        showToast('Error', currentLang === 'en' ? 'Please enter a valid Application ID.' : 'कृपया वैध अर्ज आयडी प्रविष्ट करा.', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/applications/${inputVal}`);
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Application not found');
        }

        const app = await response.json();
        
        // Update Status Timeline Visuals dynamically based on MongoDB record
        const timelineSteps = document.querySelectorAll('.status-timeline .timeline-step');
        
        // Reset classes
        timelineSteps.forEach(step => {
            step.classList.remove('completed', 'active');
        });

        // Set classes based on MongoDB App Status
        // Statuses: 'Submitted', 'Verification', 'Site Survey', 'Approved'
        if (app.status === 'Submitted') {
            timelineSteps[0].classList.add('active');
        } else if (app.status === 'Verification') {
            timelineSteps[0].classList.add('completed');
            timelineSteps[1].classList.add('active');
        } else if (app.status === 'Site Survey') {
            timelineSteps[0].classList.add('completed');
            timelineSteps[1].classList.add('completed');
            timelineSteps[2].classList.add('active');
        } else if (app.status === 'Approved') {
            timelineSteps[0].classList.add('completed');
            timelineSteps[1].classList.add('completed');
            timelineSteps[2].classList.add('completed');
            timelineSteps[3].classList.add('active'); // or completed
        }

        // Show uploaded documents count if any
        if (app.documents && app.documents.length > 0) {
            const uploadLabel = document.querySelector('[data-lang="lbl_upload"]');
            if (uploadLabel) {
                const countText = currentLang === 'en' ? 
                    `Upload Pending Verification Documents (Uploaded: ${app.documents.length} files)` :
                    `प्रलंबित पडताळणी कागदपत्रे अपलोड करा (अपलोड केलेले: ${app.documents.length} फायली)`;
                uploadLabel.textContent = countText;
            }
        }

        document.getElementById('tracking-result-panel').style.display = 'block';
        showToast('Loaded', currentLang === 'en' ? 'Tracking details fetched from MongoDB.' : 'माहिती डेटाबेसमधून प्राप्त झाली.', 'success');
    } catch (err) {
        console.error(err);
        showToast('Not Found', currentLang === 'en' ? `No records found in MongoDB for ID: ${inputVal}` : `या आयडीसाठी डेटाबेसमध्ये कोणतीही नोंद आढळली नाही: ${inputVal}`, 'error');
        document.getElementById('tracking-result-panel').style.display = 'none';
    }
}

async function handleFileUpload() {
    const fileInput = document.getElementById('upload-file-input');
    const file = fileInput.files[0];
    const cfcId = document.getElementById('tracking-id-input').value.trim();

    if (!file) {
        showToast('Error', currentLang === 'en' ? 'Please choose a file to upload.' : 'कृपया अपलोड करण्यासाठी फाईल निवडा.', 'error');
        return;
    }
    if (!cfcId) {
        showToast('Error', currentLang === 'en' ? 'No active CFC ID loaded in tracking.' : 'ट्रॅकिंगमध्ये कोणताही सक्रिय सीएफसी आयडी आढळला नाही.', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('document', file);

    showToast('Uploading', currentLang === 'en' ? 'Uploading file and updating MongoDB...' : 'फाइल अपलोड आणि डेटाबेस अपडेट करत आहे...', 'success');

    try {
        const response = await fetch(`${API_BASE}/api/applications/${cfcId}/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Upload failed');
        }

        showToast('Success', currentLang === 'en' ? 'Document uploaded & attached to MongoDB record!' : 'दस्तऐवज यशस्वीरित्या अपलोड होऊन डेटाबेसमध्ये जतन झाला!', 'success');
        fileInput.value = '';
        
        // Refresh tracker to show updated stage
        trackApplication();
    } catch (err) {
        console.error(err);
        showToast('Upload Error', currentLang === 'en' ? 'Could not save upload to DB. Make sure server is running!' : 'अपलोड जतन करण्यात अयशस्वी.', 'error');
    }
}

function selectPayMethod(method, element) {
    paymentMethod = method;
    document.querySelectorAll('.pay-option-card').forEach(card => card.classList.remove('active'));
    element.classList.add('active');
}

async function handlePayment() {
    const payId = document.getElementById('pay-id').value.trim().toUpperCase();
    const amount = document.getElementById('pay-amount').value.trim();

    if (!payId || !amount) {
        showToast('Error', currentLang === 'en' ? 'Please fill in all payment details.' : 'कृपया सर्व पेमेंट तपशील भरा.', 'error');
        return;
    }

    showToast('Processing', currentLang === 'en' ? 'Connecting to payment gateway...' : 'पेमेंट प्रक्रिया चालू आहे...', 'success');

    try {
        const response = await fetch(`${API_BASE}/api/payments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cfcId: payId,
                amount: amount,
                paymentMethod: paymentMethod
            })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Payment failed');
        }

        const payment = await response.json();

        showToast('Success', currentLang === 'en' ? `Payment Saved to DB! Ref: ${payment.transactionId}` : `पेमेंट यशस्वी आणि डेटाबेसमध्ये जतन! संदर्भ: ${payment.transactionId}`, 'success');
        
        // Show toast if email confirmation was sent
        if (payment.emailSent) {
            setTimeout(() => {
                showToast('Email Sent', currentLang === 'en' ? `Receipt successfully emailed to applicant!` : `पावती अर्जदाराला यशस्वीरित्या ई-मेल केली!`, 'success');
            }, 800);
            if (payment.emailPreviewUrl) {
                console.log(`%c📬 [Nodemailer Ethereal Preview URL]: ${payment.emailPreviewUrl}`, 'color: #10b981; font-weight: bold; font-size: 13px;');
            }
        }
        
        switchView('receipts');
        document.getElementById('receipt-id-input').value = payment.transactionId;
        
        // Prefill receipt card values dynamically from MongoDB record
        document.getElementById('rcpt-ref').textContent = payment.transactionId;
        document.getElementById('rcpt-cfc').textContent = payment.cfcId;
        document.getElementById('rcpt-amount').textContent = `₹${parseFloat(payment.amount).toLocaleString('en-IN')}.00`;
        document.getElementById('rcpt-date').textContent = new Date(payment.paymentDate).toLocaleString();
        
        document.getElementById('receipt-result-panel').style.display = 'block';
    } catch (err) {
        console.error(err);
        showToast('Error', currentLang === 'en' ? `Payment failed: ${err.message}` : `पेमेंट अयशस्वी: ${err.message}`, 'error');
    }
}

async function loadReceipt() {
    const refInput = document.getElementById('receipt-id-input').value.trim();
    if (!refInput) {
        showToast('Error', currentLang === 'en' ? 'Please enter a valid Transaction Ref.' : 'कृपया वैध व्यवहार संदर्भ प्रविष्ट करा.', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/payments/${refInput}`);
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Receipt not found');
        }

        const payment = await response.json();
        
        // Prefill receipt card values dynamically
        document.getElementById('rcpt-ref').textContent = payment.transactionId;
        document.getElementById('rcpt-cfc').textContent = payment.cfcId;
        document.getElementById('rcpt-amount').textContent = `₹${parseFloat(payment.amount).toLocaleString('en-IN')}.00`;
        document.getElementById('rcpt-date').textContent = new Date(payment.paymentDate).toLocaleString();
        
        document.getElementById('receipt-result-panel').style.display = 'block';
        showToast('Loaded', currentLang === 'en' ? 'Receipt loaded from MongoDB Compass DB.' : 'पावती डेटाबेसमधून प्राप्त झाली.', 'success');
    } catch (err) {
        console.error(err);
        showToast('Error', currentLang === 'en' ? `Receipt ${refInput} not found in MongoDB.` : `डेटाबेसमध्ये पावती ${refInput} आढळली नाही.`, 'error');
        document.getElementById('receipt-result-panel').style.display = 'none';
    }
}

function triggerDownload(fileName) {
    showToast('Downloading', currentLang === 'en' ? `Starting download for ${fileName}` : `${fileName} डाउनलोड करत आहे`, 'success');
}

// Notification Toaster
function showToast(title, desc, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
        </div>
        <div class="toast-content">
            <h5>${title}</h5>
            <p>${desc}</p>
        </div>
    `;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.transform = 'translateX(120%)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Interactive Chatbot Assistant
function toggleChatWindow() {
    document.getElementById('chat-window').classList.toggle('open');
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const msgText = input.value.trim();
    if (!msgText) return;

    // Render User Message
    renderMessage(msgText, 'user');
    input.value = '';

    // AI Simulated Response
    setTimeout(() => {
        let reply = "I'm sorry, I didn't quite catch that. Can you please choose one of our quick topics below?";
        const cleanMsg = msgText.toLowerCase();

        if (cleanMsg.includes('noc')) {
            reply = currentLang === 'en' ? 
                "To apply for a No Objection Certificate (NOC), please click on the 'Submit Online CFC Application' in the left menu, select 'No Objection Certificate', fill out the details and click Submit." :
                "ना हरकत प्रमाणपत्रासाठी (NOC) अर्ज करण्यासाठी, कृपया डाव्या मेनूमधील 'ऑनलाइन सीएफसी अर्ज सादर करा' वर क्लिक करा, 'ना हरकत प्रमाणपत्र' निवडा, आवश्यक माहिती भरा आणि अर्ज सबमिट करा.";
        } else if (cleanMsg.includes('status') || cleanMsg.includes('track')) {
            reply = currentLang === 'en' ?
                "You can verify your CFC application status by navigating to 'Check status/Upload Documents', putting in your Application ID, and clicking Track." :
                "तुम्ही 'स्थिती तपासा / कागदपत्रे अपलोड करा' वर जाऊन, तुमचा अर्ज आयडी टाकून अर्जाची सध्याची स्थिती जाणून घेऊ शकता.";
        } else if (cleanMsg.includes('download') || cleanMsg.includes('affidavit') || cleanMsg.includes('bond')) {
            reply = currentLang === 'en' ?
                "Head over to our 'Document Download Center' using the menu on the left to find prescribed Indemnity Bonds, Affidavit formats, and NOC templates." :
                "पत्रांचे नमुने, हमीपत्रे किंवा प्रतिज्ञापत्रांसाठी डावीकडील 'नमुने, हमीपत्रे इ. डाउनलोड करा' वर क्लिक करा.";
        }

        renderMessage(reply, 'bot');
    }, 1000);
}

function handleChatEnter(e) {
    if (e.key === 'Enter') sendChatMessage();
}

function quickChat(text) {
    document.getElementById('chat-input').value = text;
    sendChatMessage();
}

function renderMessage(text, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const msgEl = document.createElement('div');
    msgEl.className = `msg ${sender}`;
    msgEl.textContent = text;
    chatMessages.appendChild(msgEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// =========================================================================
// ADMINISTRATIVE CONTROL PANEL INTEGRATION
// =========================================================================

let allApplications = [];
let currentEditingCfcId = null;

async function loadAdminDashboard() {
    showToast('Loading Dashboard', currentLang === 'en' ? 'Fetching registered applications from MongoDB...' : 'डेटाबेसमधून अर्ज लोड करत आहे...', 'success');
    try {
        const token = sessionStorage.getItem('adminToken');
        const response = await fetch(`${API_BASE}/api/admin/applications`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Server error loading applications.');
        }

        allApplications = await response.json();
        renderAdminDashboard();
    } catch (err) {
        console.error(err);
        showToast('Admin Error', currentLang === 'en' ? 'Failed to connect with admin portal API!' : 'प्रशासक पोर्टलशी कनेक्ट करण्यात अयशस्वी!', 'error');
    }
}

function renderAdminDashboard() {
    // Dynamically calculate current statistics for dashboard panels
    const total = allApplications.length;
    const pending = allApplications.filter(app => app.status === 'Verification').length;
    const survey = allApplications.filter(app => app.status === 'Site Survey').length;
    const approved = allApplications.filter(app => app.status === 'Approved').length;
    const submitted = allApplications.filter(app => app.status === 'Submitted').length;

    // Update statistics counters in UI
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-pending').textContent = pending;
    document.getElementById('stat-survey').textContent = survey;
    document.getElementById('stat-approved').textContent = approved;

    // Calculate Node Location Statistics
    const nodes = {
        belapur: { name: 'CBD Belapur', count: 0 },
        vashi: { name: 'Vashi', count: 0 },
        kharghar: { name: 'Kharghar', count: 0 },
        panvel: { name: 'New Panvel', count: 0 },
        ulwe: { name: 'Ulwe', count: 0 }
    };

    allApplications.forEach(app => {
        const nodeKey = app.nodeName ? app.nodeName.toLowerCase().trim() : '';
        if (nodes[nodeKey]) {
            nodes[nodeKey].count++;
        }
    });

    // Render Node Density Bars
    const nodeContainer = document.getElementById('analytics-nodes-container');
    if (nodeContainer) {
        nodeContainer.innerHTML = '';
        Object.keys(nodes).forEach(key => {
            const node = nodes[key];
            const percent = total > 0 ? Math.round((node.count / total) * 100) : 0;
            
            const nodeItem = document.createElement('div');
            nodeItem.className = 'node-progress-item';
            nodeItem.innerHTML = `
                <div class="node-progress-header">
                    <span>${node.name}</span>
                    <span>${node.count} (${percent}%)</span>
                </div>
                <div class="node-progress-bar-bg">
                    <div class="node-progress-bar-fill" style="width: 0%;"></div>
                </div>
            `;
            nodeContainer.appendChild(nodeItem);

            // Animate width after layout paint
            setTimeout(() => {
                const fill = nodeItem.querySelector('.node-progress-bar-fill');
                if (fill) fill.style.width = `${percent}%`;
            }, 50);
        });
    }

    // Dynamic Donut Chart Logic
    const pSub = total > 0 ? (submitted / total) * 100 : 0;
    const pVer = total > 0 ? (pending / total) * 100 : 0;
    const pSur = total > 0 ? (survey / total) * 100 : 0;
    const pApp = total > 0 ? (approved / total) * 100 : 0;

    // Update Percentage Labels in Legends
    const pctSubEl = document.getElementById('legend-pct-submitted');
    const pctVerEl = document.getElementById('legend-pct-verification');
    const pctSurEl = document.getElementById('legend-pct-survey');
    const pctAppEl = document.getElementById('legend-pct-approved');
    const donutTotalEl = document.getElementById('donut-total-count');

    if (pctSubEl) pctSubEl.textContent = `${Math.round(pSub)}%`;
    if (pctVerEl) pctVerEl.textContent = `${Math.round(pVer)}%`;
    if (pctSurEl) pctSurEl.textContent = `${Math.round(pSur)}%`;
    if (pctAppEl) pctAppEl.textContent = `${Math.round(pApp)}%`;
    if (donutTotalEl) donutTotalEl.textContent = total;

    // Set Donut Circle Stroke DashArrays and DashOffsets
    const subSeg = document.getElementById('donut-segment-submitted');
    const verSeg = document.getElementById('donut-segment-verification');
    const surSeg = document.getElementById('donut-segment-survey');
    const appSeg = document.getElementById('donut-segment-approved');

    if (subSeg && verSeg && surSeg && appSeg) {
        // Submitted segment
        subSeg.setAttribute('stroke-dasharray', `${pSub} ${100 - pSub}`);
        subSeg.setAttribute('stroke-dashoffset', '100');

        // Verification segment (offset by pSub)
        const verOffset = 100 - pSub;
        verSeg.setAttribute('stroke-dasharray', `${pVer} ${100 - pVer}`);
        verSeg.setAttribute('stroke-dashoffset', `${verOffset}`);

        // Survey segment (offset by pSub + pVer)
        const surOffset = verOffset - pVer;
        surSeg.setAttribute('stroke-dasharray', `${pSur} ${100 - pSur}`);
        surSeg.setAttribute('stroke-dashoffset', `${surOffset}`);

        // Approved segment (offset by pSub + pVer + pSur)
        const appOffset = surOffset - pSur;
        appSeg.setAttribute('stroke-dasharray', `${pApp} ${100 - pApp}`);
        appSeg.setAttribute('stroke-dashoffset', `${appOffset}`);
    }

    filterAdminApplications();
}

function filterAdminApplications() {
    const searchVal = document.getElementById('admin-search-input').value.trim().toLowerCase();
    const filterStatus = document.getElementById('admin-filter-status').value;
    const tableBody = document.getElementById('admin-applications-table-body');
    
    tableBody.innerHTML = '';

    // Filter applications matching parameters
    const filteredApps = allApplications.filter(app => {
        const matchesSearch = app.cfcId.toLowerCase().includes(searchVal) || 
                              app.applicantName.toLowerCase().includes(searchVal);
        const matchesStatus = filterStatus === 'ALL' || app.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (filteredApps.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: var(--text-muted); font-style: italic; padding: 25px;">
                    ${currentLang === 'en' ? 'No applications match selected search or filter.' : 'निवडलेल्या शोधाशी जुळणारा कोणताही अर्ज सापडला नाही.'}
                </td>
            </tr>
        `;
        return;
    }

    // Populate data table rows
    filteredApps.forEach(app => {
        const row = document.createElement('tr');
        
        let categoryText = app.serviceCategory.toUpperCase();
        if (app.serviceCategory === 'noc') categoryText = currentLang === 'en' ? 'NOC Certificate' : 'ना हरकत प्रमाणपत्र';
        else if (app.serviceCategory === 'transfer') categoryText = currentLang === 'en' ? 'Tenancy Transfer' : 'भाडेकरू हस्तांतरण';
        else if (app.serviceCategory === 'mortgage') categoryText = currentLang === 'en' ? 'Mortgage Permission' : 'गहाण परवानगी';
        else if (app.serviceCategory === 'lease') categoryText = currentLang === 'en' ? 'Lease Extension' : 'पट्टा मुदतवाढ';

        const statusClass = app.status.toLowerCase().replace(' ', '-');

        row.innerHTML = `
            <td><strong>${app.cfcId}</strong></td>
            <td>${app.applicantName}</td>
            <td>${categoryText}</td>
            <td>${app.nodeName.toUpperCase()}</td>
            <td><span class="status-badge ${statusClass}">${app.status}</span></td>
            <td style="text-align: right;">
                <button class="admin-action-btn" onclick="openAdminModal('${app.cfcId}')">
                    <i class="fa-solid fa-file-shield"></i> ${currentLang === 'en' ? 'Scrutinize' : 'छाननी'}
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function openAdminModal(cfcId) {
    const app = allApplications.find(a => a.cfcId === cfcId);
    if (!app) return;

    currentEditingCfcId = cfcId;

    // Prefill Scrutiny Modal Fields
    document.getElementById('modal-app-id').textContent = `Scrutiny Scrutinize Application: ${app.cfcId}`;
    document.getElementById('modal-applicant-name').textContent = app.applicantName;
    document.getElementById('modal-mobile').textContent = app.mobileNumber;
    document.getElementById('modal-email').textContent = app.email;
    document.getElementById('modal-node').textContent = app.nodeName.toUpperCase();
    document.getElementById('modal-plot').textContent = app.plotNumber;
    document.getElementById('modal-address').textContent = app.address;

    let categoryText = app.serviceCategory.toUpperCase();
    if (app.serviceCategory === 'noc') categoryText = 'No Objection Certificate (NOC)';
    else if (app.serviceCategory === 'transfer') categoryText = 'Transfer of Tenancy Rights';
    else if (app.serviceCategory === 'mortgage') categoryText = 'Mortgage Permission';
    else if (app.serviceCategory === 'lease') categoryText = 'Extension of Lease Period';
    
    document.getElementById('modal-service').textContent = categoryText;
    document.getElementById('modal-date').textContent = new Date(app.createdAt).toLocaleString();
    document.getElementById('modal-update-status').value = app.status;

    // Render list of uploaded documents
    const docContainer = document.getElementById('modal-documents-list');
    docContainer.innerHTML = '';

    if (app.documents && app.documents.length > 0) {
        app.documents.forEach((doc, idx) => {
            const docRow = document.createElement('div');
            docRow.className = 'doc-link-item';
            docRow.innerHTML = `
                <span><i class="fa-solid fa-file-pdf"></i> Document #${idx + 1} (${doc.split('.').pop().toUpperCase()})</span>
                <a href="${API_BASE}/uploads/${doc}" target="_blank">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> Open Attachment
                </a>
            `;
            docContainer.appendChild(docRow);
        });
    } else {
        docContainer.innerHTML = `
            <span style="font-size: 13.5px; color: var(--text-muted); font-style: italic;">
                ${currentLang === 'en' ? 'No verification documents uploaded by applicant yet.' : 'अर्जदाराने अद्याप कोणतीही कागदपत्रे अपलोड केलेली नाहीत.'}
            </span>
        `;
    }

    document.getElementById('admin-modal-overlay').style.display = 'flex';

    // Reset AI Scrutiny Module UI state
    document.getElementById('ai-results-dashboard').style.display = 'none';
    document.getElementById('ai-loading-state').style.display = 'none';
    const btnAi = document.getElementById('btn-run-ai');
    if (btnAi) {
        btnAi.style.display = 'block';
        btnAi.innerHTML = '<i class="fa-solid fa-bolt"></i> Run AI Analysis';
        btnAi.disabled = false;
    }
}

function closeAdminModal() {
    document.getElementById('admin-modal-overlay').style.display = 'none';
    currentEditingCfcId = null;
}

async function saveAdminStatusUpdate() {
    if (!currentEditingCfcId) return;

    const updatedStatus = document.getElementById('modal-update-status').value;
    showToast('Saving', currentLang === 'en' ? `Updating application ${currentEditingCfcId}...` : `अर्ज अपडेट करत आहे ${currentEditingCfcId}...`, 'success');

    try {
        const token = sessionStorage.getItem('adminToken');
        const response = await fetch(`${API_BASE}/api/admin/applications/${currentEditingCfcId}/status`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: updatedStatus })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to update application status.');
        }

        showToast('Success', currentLang === 'en' ? 
            `Saved! Application ${currentEditingCfcId} status is now: ${updatedStatus}` : 
            `जतन केले! अर्जाची स्थिती आता ${updatedStatus} आहे`, 'success');

        closeAdminModal();
        loadAdminDashboard();
    } catch (err) {
        console.error(err);
        showToast('Save Error', currentLang === 'en' ? `Could not update status: ${err.message}` : `स्थिती जतन करण्यात अयशस्वी: ${err.message}`, 'error');
    }
}

// Call on startup
document.addEventListener('DOMContentLoaded', () => {
    // You can add generic initializations here if needed
});

// AI Automated Document Scrutiny Engine (Simulated)
async function runAiScrutiny() {
    if (!currentEditingCfcId) return;
    const app = allApplications.find(a => a.cfcId === currentEditingCfcId);
    if (!app) return;

    const btn = document.getElementById('btn-run-ai');
    const loadingState = document.getElementById('ai-loading-state');
    const resultsDash = document.getElementById('ai-results-dashboard');
    const loadingText = document.getElementById('ai-loading-text');

    // UI Reset for AI scanning initialization
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    resultsDash.style.display = 'none';
    loadingState.style.display = 'flex';

    // Sequence of scanning logs for a highly realistic premium feel
    const stages = [
        "Initializing Neural Network...",
        "Running Optical Character Recognition (OCR) on Documents...",
        "Extracting Natural Language Entities (NLP)...",
        "Cross-verifying data with CIDCO Master Land Database...",
        "Calculating AI Confidence & Integrity Score..."
    ];

    for (let i = 0; i < stages.length; i++) {
        loadingText.textContent = stages[i];
        // Simulate heavy processing time
        await new Promise(resolve => setTimeout(resolve, 850));
    }

    // Populate extracted data points dynamically from application
    document.getElementById('ai-ex-name').textContent = app.applicantName;
    document.getElementById('ai-ex-plot').textContent = app.plotNumber;
    
    let typeMap = {
        noc: "NOC Certificate",
        transfer: "Tenancy Transfer",
        mortgage: "Mortgage Perm.",
        lease: "Lease Extension"
    };
    document.getElementById('ai-ex-type').textContent = typeMap[app.serviceCategory] || "Estate Service";
    document.getElementById('ai-ex-node').textContent = app.nodeName.toUpperCase();

    // Generate pseudo-random confidence score (hash-based to remain consistent for the same app)
    const baseScore = 93;
    const hash = app.applicantName.length + app.plotNumber.length;
    const decimal = (hash % 10) / 10;
    const finalScore = Math.min(99.8, baseScore + (hash % 6) + decimal).toFixed(1);
    
    const scoreEl = document.getElementById('ai-confidence-score');
    scoreEl.textContent = `${finalScore}%`;
    
    // Color coding based on score thresholds
    if (finalScore >= 95) {
        scoreEl.style.color = '#10b981'; // Green safe
    } else if (finalScore >= 80) {
        scoreEl.style.color = '#ff9800'; // Orange warning
    } else {
        scoreEl.style.color = '#ef4444'; // Red danger
    }

    // Hide scanner, show results dashboard
    loadingState.style.display = 'none';
    resultsDash.style.display = 'block';
    btn.style.display = 'none'; // Hide run button once analysis is complete
}
