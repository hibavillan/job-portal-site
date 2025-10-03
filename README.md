# Job Portal

A full-stack job portal application that connects job seekers with employers. Built with Node.js, Express, MongoDB, and React.

## Features

- User registration and authentication for job seekers and employers
- Job posting and management for employers
- Job search and filtering for job seekers
- Job application system
- User dashboards
- Responsive design

## Tech Stack

- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** React, Material-UI, Axios
- **Authentication:** JWT
- **Database:** MongoDB

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/job-portal.git
   cd job-portal
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

4. Set up environment variables:
   - Copy `backend/.env` and update the values:
     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```

5. Start MongoDB (if running locally):
   ```bash
   mongod
   ```

6. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

7. Start the frontend (in a new terminal):
   ```bash
   cd frontend
   npm start
   ```

8. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create a new job (Employer only)
- `PUT /api/jobs/:id` - Update a job (Employer only)
- `DELETE /api/jobs/:id` - Delete a job (Employer only)

### Applications
- `POST /api/applications` - Apply for a job
- `GET /api/applications/me` - Get user's applications
- `GET /api/applications/job/:jobId` - Get applications for a job (Employer only)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Material-UI for the UI components
- Express.js for the backend framework
- MongoDB for the database
