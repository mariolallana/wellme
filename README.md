# Wellness App

A comprehensive wellness tracking application that helps users monitor their nutrition, track food intake, and maintain healthy habits using AI-powered food recognition.

## Project Overview

The Wellness App is a full-stack application consisting of a React Native frontend (Expo) and a Node.js backend. It leverages AI models from Hugging Face for food recognition and nutritional analysis, providing users with accurate nutritional information from both text descriptions and food images.

## Architecture

### Backend (WellnessBackend)

The backend is built with Node.js and Express, providing a RESTful API for the frontend application.

#### Tech Stack
- **Runtime**: Node.js
  - Imagine you have different types of video games. Some games only work on a PlayStation, others only on Xbox or Nintendo
  - Similarly, computer programs need a special "place" to run, called a runtime environment
  - Traditionally, JavaScript (the programming language we use) could only run in web browsers (like Chrome or Safari)
  - Node.js is like a new "gaming console" for JavaScript that lets it run outside of web browsers
  - Think of it like this:
    * Web Browser: Lets JavaScript run websites (what users see and interact with)
    * Node.js: Lets JavaScript run on servers (the "behind the scenes" part of websites)
  - Why is this important for our app?
    * It's like having a powerful kitchen (Node.js) where all the food (data) is prepared
    * The kitchen can handle many orders (user requests) at the same time
    * It can talk to the storage room (database) to save and get information
    * It can communicate with other services (like our AI food recognition)
    * It works well with our mobile app (the "front of the restaurant" where users interact)
  - Benefits:
    * Fast and efficient (can serve many users at once)
    * Uses the same "language" throughout the whole app
    * Has lots of ready-to-use tools (like recipe books in our kitchen analogy)
    * Free to use and supported by a large community of developers
    Why Node.js?

  - A JavaScript runtime environment that allows executing JavaScript code outside of a web browser
  - Enables server-side JavaScript execution
  - Provides non-blocking I/O operations for better performance
  - Uses the V8 JavaScript engine (same as Chrome)

- **Framework**: Express.js
  - A minimal and flexible Node.js web application framework
  - Provides a robust set of features for web and mobile applications
  - Handles routing, middleware, and HTTP request/response
  - Simplifies API development with built-in tools

- **Database**: MongoDB
  - A NoSQL document-oriented database
  - Stores data in flexible, JSON-like documents
  - Provides high performance, high availability, and easy scalability
  - Supports complex queries and indexing

- **Authentication**: JWT (JSON Web Tokens)
  - A secure way to transmit information between parties
  - Stateless authentication mechanism
  - Includes user claims and is digitally signed
  - Provides secure session management

- **AI Integration**: Hugging Face Inference API
  - Access to state-of-the-art machine learning models
  - Pre-trained models for natural language processing and computer vision
  - RESTful API for easy integration
  - Pay-as-you-go pricing model

- **Image Storage**: MongoDB GridFS
  - A specification for storing and retrieving large files in MongoDB
  - Splits files into chunks for efficient storage
  - Supports files larger than 16MB
  - Maintains metadata about stored files

#### Key Components

1. **User Management**
   - User registration and authentication
   - Profile management
   - Onboarding flow
   - Dietary preferences and goals

2. **Food Tracking**
   - Food entry management
   - Nutritional data storage
   - Daily tracking and analytics

3. **AI Services**
   - Food image recognition
   - Nutritional value inference
   - Text-to-nutrition conversion

### Frontend (WellnessFrontend)

The frontend is built with React Native using Expo, providing a cross-platform mobile application.

#### Tech Stack
- **Framework**: React Native (Expo)
  - A framework for building native mobile applications using React
  - Write once, run on both iOS and Android
  - Expo provides additional tools and services for easier development
  - Hot reloading for faster development cycles

- **State Management**: React Context API
  - Built-in state management solution in React
  - Allows sharing state between components without prop drilling
  - Provides a way to pass data through the component tree
  - Used for global state like authentication and user data

- **Navigation**: React Navigation
  - Standard navigation library for React Native
  - Provides a navigation container and stack navigator
  - Handles screen transitions and navigation state
  - Supports deep linking and web URLs

- **Storage**: AsyncStorage
  - Simple, unencrypted, asynchronous, persistent, key-value storage system
  - Used for storing user preferences and authentication tokens
  - Persists data across app restarts
  - Provides a simple API for data storage and retrieval

- **UI Components**: React Native Paper
  - Material Design components for React Native
  - Provides pre-built, customizable UI components
  - Follows Material Design guidelines
  - Includes components like buttons, cards, and text inputs

- **Camera Integration**: Expo Camera
  - Provides access to the device's camera
  - Supports photo capture and video recording
  - Handles permissions and camera settings
  - Provides a simple API for camera operations

#### Key Features

1. **Authentication**
   - Login/Registration
   - Profile management
   - Secure token storage

2. **Food Tracking**
   - Manual food entry
   - Camera-based food recognition
   - Nutritional information display
   - Daily tracking dashboard

3. **User Interface**
   - Modern, intuitive design
   - Responsive layouts
   - Real-time updates

## AI Integration

### Food Recognition System

The application uses Hugging Face's AI models for food recognition and nutritional analysis:

1. **Image Processing**
   - Model: `Salesforce/blip-vqa-base`
   - Purpose: Food identification and description
   - Features:
     - Food type recognition
     - Portion size estimation
     - Preparation state detection

2. **Nutritional Analysis**
   - Model: `mistralai/Mistral-7B-Instruct-v0.2`
   - Purpose: Nutritional value inference
   - Output: Detailed macronutrient breakdown
     - Calories
     - Carbohydrates
     - Proteins
     - Fats

### Data Flow

1. **Image Processing Flow**
   ```
   User Image → Base64 Conversion → Hugging Face API → Food Description → Nutritional Analysis
   ```

2. **Text Processing Flow**
   ```
   User Input → Hugging Face API → Nutritional Analysis → Database Storage
   ```

## Database Schema

### User Schema
```typescript
{
  email: string;
  password: string;
  username: string;
  profile: {
    age: number;
    gender: 'male' | 'female';
    weight: number;
    height: number;
    goal: 'lose' | 'maintain' | 'gain';
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active';
    onboardingCompleted: boolean;
  };
  nutritionalGoals: {
    dailyCalories: number;
    macronutrientRatios: {
      protein: number;
      carbs: number;
      fats: number;
    };
  };
  dietaryPreferences: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    lowCholesterol: boolean;
    diabetesFriendly: boolean;
  };
}
```

### Food Entry Schema
```typescript
{
  userId: ObjectId;
  name: string;
  calories: number;
  carbohydrates: number;
  proteins: number;
  fats: number;
  time: Date;
  createdAt: Date;
  foodLabel?: string;
  confidence?: number;
}
```

## API Endpoints

### Authentication
- POST `/api/users/register` - User registration
- POST `/api/users/login` - User login
- GET `/api/users/profile` - Get user profile
- PUT `/api/users/profile` - Update user profile

### Food Tracking
- POST `/api/food-tracking/entries` - Add food entry
- GET `/api/food-tracking/entries` - Get food entries
- GET `/api/food-tracking/daily` - Get daily summary

### AI Services
- POST `/api/nutrient-inference` - Get nutritional information from text or image

## Setup and Installation

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd WellnessBackend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with required environment variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd WellnessFrontend/wellnessappfrontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo development server:
   ```bash
   npx expo start
   ```

## Environment Variables

### Backend (.env)
- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `HUGGINGFACE_API_KEY`: API key for Hugging Face services

### Frontend (api.config.ts)
- `DEV_API_URL`: Development API URL
- `PROD_API_URL`: Production API URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 