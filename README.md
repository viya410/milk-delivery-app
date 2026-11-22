# milk-delivery-app
A milk delivery app solution to list your products ad set up a milk business

Project setup:
Clone the repository in local using username/key.

Frontend setup:
Pre-requisites: Needs Angular version 22.
1. Open frontend folder in vs code.
2. Check the angular version you have installed using: npm -v, ng -v.
3. Install all required packages using npm i
4. Build & run the project on server using "npm serve" - you'll be able to access the project locally on localhost:4200

Backend setup:
Pre-requisites: Needs java, docker & postgres sql installed
1. Install docker in your system to host postgres db in it.
2. Keep the docker container running.
3. Open backend folder in vs code/intellij.
4. To setup postgres, give this command: docker run -d --name milk-postgres -e POSTGRES_DB=your_db_name -e POSTGRES_USER=your_username -e POSTGRES_PASSWORD=your_password -p 5433:5432 postgres:17 - this will start your db on port 5432
5. Build and run your maven project using the command: ./mvnw spring-boot:run


## Password recovery email setup

Password recovery uses an email address on the account. Phone-only accounts need an email address added before they can use this flow; SMS recovery is not configured.

Configure these environment variables for the backend before testing email delivery:

- `MAIL_HOST`: SMTP server hostname.
- `MAIL_PORT`: SMTP port (usually `587` for STARTTLS).
- `MAIL_USERNAME`: SMTP account username / sender address.
- `MAIL_PASSWORD`: SMTP app password or SMTP credential.
- `FRONTEND_URL`: public frontend origin used to build reset links (for local development, `http://localhost:4200`).

Do not commit SMTP credentials. The backend creates the `password_reset_tokens` table through the configured JPA schema management. Reset links expire after 30 minutes and are single-use. The raw token is not stored in the database; only its SHA-256 hash is persisted.
