# Share-Ed

> **Learn. Earn. Grow.**

Share-Ed is a full-stack peer learning and incentive platform designed for intra-campus academic collaboration. 
It enables students to upload and access verified study materials, connect with peer mentors, book learning sessions, and earn Campus Credits for contributing to the learning community. 
The platform also provides administrators with tools to verify notes, manage users, and monitor platform activity.

---

## Features

* Secure user authentication using JWT and Supabase Auth
* Upload and share syllabus-specific study notes
* Admin approval system for uploaded notes
* Peer mentor registration and management
* Rule-based mentor matching
* Book and manage mentoring sessions
* Campus Credits reward system
* Role-based access (Student, Mentor, Admin)
* Responsive React-based user interface

---

## Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* JWT Authentication
* Multer

### Database

* Supabase
* PostgreSQL
* Supabase Storage

### Tools

* Git & GitHub
* VS Code
* Figma

---

## Project Structure

```text
share-ed/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

## Installation

### Clone the repository

```bash
git clone https://github.com/nanditha4040/share-ed.git
cd share-ed
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

### Install Backend Dependencies

```bash
cd ../server
npm install
```

---

## Environment Variables

Create a `.env` file inside the `server` directory.

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
PORT=5000
```

---

## Running the Application

### Start Backend

```bash
cd server
npm start
```

### Start Frontend

```bash
cd client
npm run dev
```

The application will run at:

* Frontend: http://localhost:5173
* Backend: http://localhost:5000

---

## Screenshots

Add screenshots of the following pages to showcase the application:

* Login Page
* Dashboard
* Notes Hub
* Mentor Matching
* Session Booking
* Admin Dashboard

---

## Future Enhancements

* AI-powered mentor recommendation
* AI-based doubt-solving assistant
* Multi-college support
* In-app chat system
* Notification system
* Leaderboard and achievements
* Certificate generation
* Mobile application

## Authors
**Nanditha M Menon**

**Minakshi Vinod**

Department of Computer Science and Engineering
Chinmaya Vishwa Vidyapeeth

---

## License

This project was developed for academic purposes as part of the B.Tech Mini Project (2025–2026).
