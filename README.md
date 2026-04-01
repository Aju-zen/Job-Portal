# JobConnect – Full Stack Job Portal

## Tech Stack
- **Frontend**: React.js + React Router + Axios
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Auth**: JWT + bcrypt

## Folder Structure
```
job application/
├── server/          ← Express backend
│   ├── models/      ← Mongoose models (User, Job, Application)
│   ├── routes/      ← API routes
│   ├── middleware/  ← JWT auth middleware
│   ├── uploads/     ← Resume file uploads
│   ├── index.js     ← Server entry point
│   ├── seed.js      ← Admin user seeder
│   └── .env         ← Environment variables
└── client/          ← React frontend
    └── src/
        ├── api/     ← Axios instance
        ├── context/ ← Auth context
        ├── components/
        └── pages/
```

## Prerequisites
- Node.js v16+
- MongoDB installed and running locally

## Setup & Run

### 1. Start MongoDB
Make sure MongoDB is running on your machine:
- **Windows**: Start "MongoDB" service from Services, or run `mongod` in terminal

### 2. Start the Backend
```bash
cd server
npm install
node seed.js        # Creates admin account (run once)
npm run dev         # Starts server on http://localhost:5000
```

### 3. Start the Frontend
Open a new terminal:
```bash
cd client
npm install
npm start           # Opens http://localhost:3000
```

## Test Accounts

| Role     | Email                    | Password  |
|----------|--------------------------|-----------|
| Admin    | admin@jobconnect.com     | admin123  |
| Employer | Register as Employer     | your choice |
| Seeker   | Register as Job Seeker   | your choice |

## API Endpoints

| Method | Endpoint                        | Auth     | Description              |
|--------|---------------------------------|----------|--------------------------|
| POST   | /api/auth/register              | Public   | Register user            |
| POST   | /api/auth/login                 | Public   | Login                    |
| GET    | /api/auth/me                    | JWT      | Get current user         |
| GET    | /api/jobs                       | Public   | List jobs (with filters) |
| GET    | /api/jobs/:id                   | Public   | Job details              |
| POST   | /api/jobs                       | Employer | Post a job               |
| PUT    | /api/jobs/:id                   | Employer | Edit job                 |
| DELETE | /api/jobs/:id                   | Employer | Delete job               |
| GET    | /api/jobs/employer/mine         | Employer | My posted jobs           |
| POST   | /api/applications               | Seeker   | Apply for job            |
| GET    | /api/applications/mine          | Seeker   | My applications          |
| GET    | /api/applications/job/:jobId    | Employer | Applicants for a job     |
| PUT    | /api/applications/:id/status    | Employer | Update applicant status  |
| PUT    | /api/users/profile              | JWT      | Update profile           |
| POST   | /api/users/resume               | JWT      | Upload resume            |
| GET    | /api/admin/stats                | Admin    | Dashboard stats          |
| GET    | /api/admin/users                | Admin    | All users                |
| DELETE | /api/admin/users/:id            | Admin    | Delete user              |
| GET    | /api/admin/jobs                 | Admin    | All jobs                 |
| DELETE | /api/admin/jobs/:id             | Admin    | Delete job               |
