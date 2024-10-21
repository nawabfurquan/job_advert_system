
To run the backend server, we need:
    - A stable internet connection (to connect to MongoDB server)
    - Node and npm installed in the system


Setup and run the backend server:

1. Navigate to the folder '/code/trunk/job_advert_system/backend' in the terminal.

2. Install the node_modules by running the command: 'npm install' (If the command fails, use npm install --force). 
This will generate a folder 'node_modules' at the root level of backend folder.

3. After the installation, run the server using the command: 'npm run start'. 

4. This will start the server and display the text: 'Server listening' when the server starts.

5. Now, the server will be running at http://localhost:5000



Run the unit tests in the backend:

1. To run all unit tests in the backend, navigate to the '/code/trunk/job_advert_system/backend' folder and run command: 'npm run test'.

2. To generate the coverage of the unit tests, run command: 'npm run coverage'. A folder named 'coverage' will be 
generated at the root level of the backend folder.


Access the swagger documentation for the APIs:

1. After starting the server, navigate to 'http://localhost:5000/api-docs'