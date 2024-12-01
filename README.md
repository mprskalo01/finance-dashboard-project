# FAInance - AI-Powered Financial Management Platform

## Overview
FAInance is a sophisticated financial management web application that leverages artificial intelligence to provide business intelligence and forecasting capabilities. Built with modern web technologies, it seamlessly integrates into existing business environments to deliver actionable financial insights and predictive analytics.

## Key Features
- Financial dashboard with comprehensive CRUD operations
- AI-powered revenue forecasting using LSTM and regression models
- User authentication and role-based access control
- Interactive data visualization
- Admin panel for user management
- Transaction and product management
- Monthly financial data tracking

## Technology Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Modern component architecture
- Type-safe development environment
- Responsive grid-based UI design

### Backend
- Node.js with Express
- MongoDB for data persistence
- RESTful API architecture
- AI model integration
- Secure authentication system

### AI Components
- LSTM (Long Short-Term Memory) model for precise revenue forecasting
- Linear regression for trend analysis
- Backend integration for real-time predictions
- Data preprocessing and validation

## Application Screenshots

### Dashboard Interface
The dashboard features an intuitive grid layout providing quick access to:
- Profile information
- Account details
- Transaction management
- Financial overview

![Dashboard View](https://github.com/user-attachments/assets/939c1def-c8c6-40bd-a596-42f3ba674236)

### Predictions Interface
The predictions page showcases:
- Interactive data visualization
- AI prediction controls
- Linear regression forecasting
- LSTM model predictions
- Year-over-year analysis

![Predictions View](https://github.com/user-attachments/assets/1e661ffc-fb1b-4bc0-ba58-726a5511856f)

## System Architecture

### Use Case Diagram
Illustrates the system's core functionality and user interactions:
![Use Case Diagram](https://github.com/user-attachments/assets/f4e16665-e1b5-4d26-9d54-988406682a54)

### Component Architecture
Displays the system's technical structure and component relationships:
![Component Diagram](https://github.com/user-attachments/assets/d5dc0cba-60aa-4404-91f3-1ee5402c8752)

### Database Schema
Shows the data model and relationships:
![Database Diagram](https://github.com/user-attachments/assets/54df9802-28a9-4b06-9043-d8fa37c0e035)

## Installation

### Environment Variables
Create a `.env` file in the server directory with the following:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
### Project setup
```bash
# Clone the repository
git clone https://github.com/yourusername/financeMERN.git

# Install frontend dependencies
cd financeMERN/client
npm install

# Install backend dependencies
cd ../server
npm install

# Start development servers
# Frontend (in client directory)
npm start

# Backend (in server directory)
npm run dev

```

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
