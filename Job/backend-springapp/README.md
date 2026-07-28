# Job Portal — Spring Boot 3 + JWT Security (merged project)

Merged codebase: the JWT authentication project + the job portal application, with all review fixes applied.

## Run

1. Set your MySQL password in `src/main/resources/application.properties` (or switch to the commented H2 config for a quick test).
2. `mvn spring-boot:run`
3. A bootstrap admin is created automatically on first run:
   - email: `admin@jobportal.com`
   - password: `Admin@123` (change in application.properties)

## Auth flow

1. `POST /auth/register` — body: `{ "username": "...", "email": "...", "password": "...", "mobileNumber": "..." }`
   Role is always forced to USER. Any `roles` value in the body is ignored.
2. `POST /auth/login` — body: `{ "email": "...", "password": "..." }`
   Returns `{ token, email, roles }`. Role comes from the database, never from the request.
3. Send `Authorization: Bearer <token>` on every `/api/**` request (and on `/auth/me`, `/auth/password`, `/auth/me` delete).

`/auth/addNewUser` and `/auth/generateToken` still work as aliases of register/login.

## Endpoints

Public:
- POST /auth/register, POST /auth/login

Authenticated (any user):
- PUT    /auth/me        body: { "username": "...", "mobileNumber": "..." }  (email is not editable)
- PUT    /auth/password  body: { "currentPassword": "...", "newPassword": "..." }
- DELETE /auth/me        deletes your own account
- GET  /api/jobs?page=&size=   (page/size optional; omit both for the full unpaginated list)
- GET  /api/jobs/{id}
- GET  /api/jobs/category/{free|premium}
- GET  /api/jobs/search/{title}
- POST /api/applicants
- GET  /api/applicants/{id}
- POST /api/applicants/{applicantId}/apply/{jobId}
- GET  /api/applicants/{id}/applications
- GET  /api/applicants/{id}/jobs/{free|premium}
- POST /api/applicants/{id}/payments
- GET  /api/payments/{id}
- GET  /api/applicants/by-email?email=...
- POST /api/applicants/{id}/resume  multipart field "file" — only the profile's own account may upload
- GET  /api/applicants/{id}/resume  downloads the stored file

Admin only (ADMIN authority):
- POST   /api/admin/jobs
- PUT    /api/admin/jobs/{id}
- DELETE /api/admin/jobs/{id}
- GET    /api/admin/applicants
- DELETE /api/admin/applicants/{id}
- PUT    /api/admin/applications/{id}/status   body: { "status": "SHORTLISTED" }
- GET    /api/admin/applications?page=&size=   (page/size optional; omit both for the full unpaginated list)
- DELETE /api/admin/applications/{id}
- GET    /api/admin/payments

## Resume storage

Uploaded resumes are stored on disk under `app.resume.storage-dir` (default `C:/Users/kashi/OneDrive/Desktop/Job2/Resume`, overridable via the `RESUME_STORAGE_DIR` env var). Max upload size is 5MB (`spring.servlet.multipart.max-file-size`).

## CORS

Allowed frontend origin(s) come from `app.cors.allowed-origins` (default `http://localhost:4200`, overridable via the `CORS_ALLOWED_ORIGINS` env var, comma-separated for multiple origins).

## Status codes

201 create, 200 read/update, 400 failed validation (e.g. blank/malformed field), 401 bad login or bad token, 403 non-admin hitting /api/admin/**, 404 unknown id, 409 duplicate email/username/application. All errors return `{ "message": "..." }`.
