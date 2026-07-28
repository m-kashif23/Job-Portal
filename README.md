# Job Portal

A full-stack job portal application with a Spring Boot backend and an Angular frontend. The project includes user authentication, job posting, applications, payments, and admin management features.

## Project Structure

- Backend: Job/backend-springapp
- Frontend: Job/jobportal-frontend
- Resume storage: Resume/

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.2.5
- Spring Security with JWT
- Spring Data JPA
- MySQL

### Frontend
- Angular 15
- TypeScript
- Bootstrap 5

## Getting Started

### 1. Backend Setup

Navigate to the backend folder:

```bash
cd Job/backend-springapp
mvn spring-boot:run
```

Make sure your MySQL database is configured in the application properties file.

### 2. Frontend Setup

Navigate to the frontend folder:

```bash
cd Job/jobportal-frontend
npm install
npm start
```

The app will typically run at:
- Frontend: http://localhost:4200
- Backend: http://localhost:8080

## Default Admin Account

On first run, the backend creates a bootstrap admin account:
- Email: admin@jobportal.com
- Password: Admin@123

## Features

- User registration and login
- JWT-based authentication
- Job posting and management
- Applicant tracking
- Resume upload support
- Payment handling
- Admin dashboard

## Notes

- Resume files are stored in the Resume directory.
- Configure environment variables if you need to override storage or CORS settings.

## License

This project is for educational and personal development purposes.
