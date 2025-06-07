# 🏥 Hospital Management System

A full-stack hospital management system built using **HTML, CSS, JavaScript, Node.js, Express, and MySQL**. This project allows patients to register, book appointments with doctors, view their appointment history, and enables admin users to manage doctors and appointments via a simple and interactive web interface.
---
## 📌 Features
- ✅ Secure user authentication (login/register)
- ✅ Role-based access: Admin / Doctor / Patient
- ✅ Patients can:
  - Book online or offline appointments
  - View appointment history
  - Chat with a chatbot
  - Use AI-powered symptom checker
- ✅ Admin can:
  - Add / view / delete doctors
  - Approve patient records
- ✅ Responsive and clean UI for each role
- ✅ MySQL database integration for persistent data storage
---
## 🛠️ Tech Stack
**Frontend**
- HTML, CSS, JavaScript
- Chatbot using JavaScript
- AI symptom checker

**Backend**
- Node.js
- Express.js
- MySQL
- dotenv (for environment config)
- bcrypt (for password hashing)
- jsonwebtoken (for authentication)
---
## 📁 Project Structure
hospital-management-system/

├── config/

│ └── db.js # MySQL connection configuration

├── middleware/

│ └── auth.js # Auth middleware for protected routes

├── routes/

│ ├── adminRoutes.js

│ ├── appointmentRoutes.js

│ ├── authRoutes.js

│ ├── protectedRoutes.js

│ └── userRoutes.js

├── database/

│ └── hospital_management.sql # MySQL schema and tables

├── frontend/

│ ├── admin/

│ │ ├── admin.html

│ │ ├── admin.css

│ │ └── admin.js

│ ├── doctor/

│ │ ├── doctor.html

│ │ ├── doctor.css

│ │ └── doctor.js

│ ├── images/

│ └── user/

│ ├── index.html

│ ├── signup.html

│ ├── login.html

│ ├── profile.html

│ ├── book-appointment.html

│ ├── find-a-doctor.html

│ ├── about-us.html

│ ├── chatbot.js

│ └── other CSS and JS files

├── .env # Environment variables

├── package.json

├── package-lock.json

├── server.js # Main server entry point

└── README.md # Project description and guide

---

## 📊 Database Schema (MySQL)

- **user** (`user_id`, `name`, `email`, `password`, `role`)
- **doctors** (`doctor_id`, `user_id`, `specialization`, `availability_schedule`)
- **patient** (`patient_id`, `user_id`, `age`, `gender`)
- **appointment** (`appointment_id`, `patient_id`, `doctor_id`, `appointment_type`, `status`, `appointment_date`)

---

## 🚀 How to Run

1️⃣ Clone the repository:

git clone https://github.com/your-username/hospital-management-system.git


2️⃣ Install dependencies:

cd hospital-management-system

npm install

3️⃣ Configure your .env file (if used) with your database credentials.

4️⃣ Run the backend server:

node server.js

5️⃣ Open public/index.html in your browser to start using the system.

## 📌 API Endpoints

*Appointment APIs*

POST /api/appointments/book — Book a new appointment

GET /api/appointments/patient/:id — Get appointment history for a patient


*Doctor APIs*

GET /api/doctors/ — Get all doctors

POST /api/doctors/add — Add a new doctor

DELETE /api/doctors/:id — Delete a doctor


*User APIs*

POST /api/users/register — Register a new user

POST /api/users/login — User login

## 📌 Author

Harsh Dave
