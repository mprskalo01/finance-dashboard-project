# financeMERN
The FAInance web application is designed as a component for easy integration into existing business environments, providing financial overview and forecasts based on artificial intelligence.

The application was primarily developed using React  and TypeScript for the frontend and Node.js for the backend. A key part of the application is the implementation of regression and LSTM (Long Short-Term Memory) AI models for predicting financial trends.

The implementation of the locally trained LSTM model in the application was accomplished through integration with the backend, where the model is used to generate forecasts based on user revenue data. The frontend of the application is designed to intuitively display the results of AI analysis, allowing users to easily understand predicted financial trends.


## Frontend technologies | React & TypeScript
For the frontend, I used Vite with the React + TypeScript template due to its fast build times, simplicity, and optimized development environment. React offers efficient component-based architecture, while TypeScript provides type safety, improving code quality and maintainability.

## Backend technologies | Node & MongoDB
For the backend, I used Node.js with Express and MongoDB because of their scalability, ease of use, and seamless integration with JavaScript. Node.js handles asynchronous operations efficiently, Express simplifies server-side logic, and MongoDB offers flexibility with its NoSQL database structure.

### Screenshots of the application  

***On the Dashboard page, the interface is organized using a grid system, allowing each section to serve a specific function and display relevant information. Users can access all CRUD operations and view profile, account, and transaction details.***  

![dashboard](https://github.com/user-attachments/assets/939c1def-c8c6-40bd-a596-42f3ba674236)  



 ***The main feature of the Predictions page is a large graph displaying relevant data, with buttons above it to activate prediction functions. When pressed, the AI predicts next year's business revenue using linear regression or the current year's revenue with an LSTM model.***  

   
![predictions](https://github.com/user-attachments/assets/1e661ffc-fb1b-4bc0-ba58-726a5511856f)   



***In addition to these interfaces, the app includes user registration and login pages with relevant forms. If an admin logs in, they see an admin dashboard with access to all registered users, where they can view, edit, or delete user data. The app also features dialogs for various CRUD operations, such as adding transactions, products, and editing monthly data.***

### Diagrams

#### Use case diagram   

  ![eng_usecase](https://github.com/user-attachments/assets/f4e16665-e1b5-4d26-9d54-988406682a54)



#### Basic Architecture Diagram  

  
![dijagram komponenti](https://github.com/user-attachments/assets/d5dc0cba-60aa-4404-91f3-1ee5402c8752)



#### Database diagram

   ![dijagrambaze](https://github.com/user-attachments/assets/54df9802-28a9-4b06-9043-d8fa37c0e035)

