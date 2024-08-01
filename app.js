const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Setup Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Middleware to serve static files
app.use(express.static('public'));

// Route to serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to handle form submission
app.post('/submit', upload.single('resume'), (req, res) => {
    const { name, email, tel } = req.body;
    const resumePath = req.file.path;

    // Setup Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'yiwhapukdee@gmail.com', // Replace with your email
            pass: 'ldqa ubes jblu sjua'   // Replace with your email password
        }
    });

    const mailOptions = {
        from: 'yiwhapukdee@gmail.com',  // Replace with your email
        to: email,
        subject: 'Application Received',
        text: `Dear ${name},\n\nThank you for your application. We have received your resume and will review it shortly.\n\nBest regards,\n\nHR`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Error sending email');
        }
        console.log('Email sent:', info.response);
        res.send('Application submitted successfully');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
