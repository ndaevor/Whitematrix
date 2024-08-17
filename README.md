Installation
Prerequisites
•	Node.js and npm installed on your machine.
•	MongoDB Atlas account and cluster set up.
•	A GitHub account (optional for version control).
Steps
1.	Clone the Repository:
git clone https://github.com/your-username/grievance-management-system.git

3.	Navigate to the Project Directory:
cd grievance-management-system

4.	Install Dependencies:
npm install


5.	Set Up Environment Variables:
Create a .env file in the root of your project and add the following:
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/your-database-name?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password


Configuration
•	MongoDB Atlas: Make sure your MongoDB Atlas cluster is set up, and your IP address is whitelisted in the network settings.
•	SMTP Configuration: Ensure the email credentials in the .env file are correct for sending notifications.
Usage

Running the Application
1.	Start the Server:
npm start
2.	Access the Application:
o	Visit http://localhost:5000 in your web browser to use the application.
