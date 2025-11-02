# Collabx - A Collaboration Platform

Collabx is a comprehensive collaboration platform that helps users find collaborators for various activities spanning from professional research projects to finding mates to play sports with. The system provides a platform to collaborate and coordinate any group activity.

## Features

- **Activity Hosting**: Create and manage projects with detailed descriptions, timelines, and requirements
- **Activity Search & Join**: Discover activities by topic, skill, or location and request to join
- **Task Management**: Assign tasks, track progress, and collaborate effectively with team members
- **Progress Tracking**: Monitor project progress with dynamic dashboards
- **User Roles**: Support for Host, Primary Member, Secondary Member, and Temporary Member roles
- **Badge System**: Recognition system for user contributions
- **Modern UI**: Responsive design with navigation bar, dropdown menus, and dashboard widgets

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React
- React Router
- Axios for API calls
- CSS3 for styling
- date-fns for date formatting

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Install dependencies for all modules:**

```bash
npm run install-all
```

This will install dependencies for:
- Root package.json (for concurrently)
- Server package.json
- Client package.json

Alternatively, install them separately:

```bash
# Root dependencies
npm install

# Server dependencies
cd server
npm install
cd ..

# Client dependencies
cd client
npm install
cd ..
```

3. **Set up environment variables:**

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/collabx
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

For MongoDB Atlas, use:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/collabx
```

4. **Set up frontend API URL (optional):**

Create a `.env` file in the `client` directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

## Running the Application

### Development Mode (Both Server and Client)

From the root directory:

```bash
npm run dev
```

This will start both the backend server and frontend development server concurrently.

### Run Separately

**Backend Server:**
```bash
cd server
npm run dev
```

The server will run on `http://localhost:5000`

**Frontend Client:**
```bash
cd client
npm start
```

The client will run on `http://localhost:3000`

## Project Structure

```
collabx/
├── server/
│   ├── index.js              # Main server file
│   ├── models/              # MongoDB models
│   │   ├── User.js
│   │   ├── Activity.js
│   │   ├── Membership.js
│   │   └── Task.js
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   ├── activities.js
│   │   ├── tasks.js
│   │   └── users.js
│   ├── middleware/          # Middleware
│   │   └── auth.js
│   └── package.json
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/      # React components
│   │   │   └── Navbar.js
│   │   ├── pages/          # Page components
│   │   │   ├── Home.js
│   │   │   ├── Activities.js
│   │   │   ├── ActivityDetail.js
│   │   │   ├── Dashboard.js
│   │   │   ├── MyProjects.js
│   │   │   ├── Profile.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── CreateActivity.js
│   │   ├── context/        # React Context
│   │   │   └── AuthContext.js
│   │   ├── utils/          # Utility functions
│   │   │   └── api.js
│   │   ├── App.js          # Main App component
│   │   └── index.js       # Entry point
│   └── package.json
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Activities
- `GET /api/activities` - Get all activities (with filters)
- `GET /api/activities/:id` - Get activity by ID
- `POST /api/activities` - Create new activity (protected)
- `PUT /api/activities/:id` - Update activity (protected, host only)
- `POST /api/activities/:id/join` - Request to join activity (protected)
- `GET /api/activities/:id/requests` - Get collaboration requests (protected, host only)
- `PUT /api/activities/:id/requests/:requestId` - Accept/reject request (protected, host only)

### Tasks
- `GET /api/tasks` - Get tasks (filtered by activity or user) (protected)
- `GET /api/tasks/:id` - Get task by ID (protected)
- `POST /api/tasks` - Create new task (protected, host/primary member only)
- `PUT /api/tasks/:id` - Update task (protected)
- `DELETE /api/tasks/:id` - Delete task (protected, host/primary member only)

### Users
- `GET /api/users/profile/:id` - Get user profile
- `GET /api/users/my-activities` - Get current user's activities (protected)
- `PUT /api/users/profile` - Update user profile (protected)

## User Roles

1. **Host**: Initiates and manages activities
   - Can create activities
   - Can accept/reject collaboration requests
   - Can assign tasks
   - Can remove members

2. **Primary Member**: Has elevated permissions within an activity
   - Can assign tasks
   - Can add/remove members (if authorized by host)

3. **Secondary Member**: Standard collaborator
   - Can work on assigned tasks
   - Cannot assign tasks or manage members

4. **Temporary Member**: Time-limited collaboration
   - Joins for a fixed interval
   - May have compensation terms

## Usage

1. **Register/Login**: Create an account or login to existing account
2. **Browse Activities**: Search and filter activities by type, location, or skill
3. **Create Activity**: Host your own activity by providing details
4. **Join Activity**: Request to join activities that match your interests
5. **Manage Projects**: Use dashboard to manage hosted activities and view participating activities
6. **Assign Tasks**: Hosts and primary members can create and assign tasks
7. **Track Progress**: Monitor task completion and project progress

## Contributing

This project was created as part of a Software Engineering course project.

## License

MIT License

## Authors

- Akash Kharate (23BPS1112)
- Lakshya Jain (23BPS1059)

## Date

July 29, 2025
