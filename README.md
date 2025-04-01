# Jobify - AI-Powered Job Matching Platform

**Tagline**: A Pool of Jobs

Jobify is an AI-powered platform that provides personalized job recommendations, resume building. It integrates web scraping, machine learning, and responsive design to simplify the job search process.


## Tech Stack

- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js, MongoDB
- **Other**: Cheerio, Puppeteer, bcrypt.js, dotenv

---

## Prerequisites

Before setting up the application, ensure the following are installed on your system:
- **Node.js** (v16 or higher): [Download](https://nodejs.org/en/download)
- **MongoDB** (local or Atlas): [Download](https://www.mongodb.com/try/download/community)
- **Git**: [Download](https://git-scm.com/downloads)

---

## Installation

### Backend Setup
1. Navigate to the backend folder:

cd job-matching-backend

2. Install dependencies:

npm install

3. Start the backend server:

npm start or  nodemon server.js


### Frontend Setup
1. Navigate to the frontend folder:

cd ../job-matching-frontend

2. Install dependencies:

npm install

3. Start the frontend server:

npm start 

for job_listing collection in Data base job_matching, you can use following commands to insert data in it.

dump.py transfers csv file to json file and then inserts data in job_matching database

so there are multiple scraped data files so must run dump.py for each file, make sure to replace file name in dump.py.

and also check the images path and change accordingly.





