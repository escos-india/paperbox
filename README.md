# Paperbox Marketplace

Paperbox is a full-stack marketplace application built with a modern tech stack, designed to connect buyers and vendors seamlessly. It features a robust backend for order and user management and a stunning, responsive frontend.

## 🚀 Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (React 19)
- **Styling**: Tailwind CSS, PostCSS
- **Animations**: Framer Motion
- **3D Graphics**: Three.js, React Three Fiber
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose Schema)
- **Authentication**: JWT, BcryptJS
- **File Storage**: Cloudinary
- **Payments**: Razorpay
- **Email**: Nodemailer

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- MongoDB instance (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/escos-india/paperbox.git
   cd paperbox-main
   ```

2. **Frontend Setup**
   ```bash
   # Install dependencies
   npm install

   # Start the development server
   npm run dev
   ```
   The frontend will be available at [http://localhost:3000](http://localhost:3000).

3. **Backend Setup**
   Open a new terminal and navigate to the backend directory:
   ```bash
   cd backend

   # Install dependencies
   npm install

   # Start the backend server
   npm run dev
   ```
   The backend API will be available at [http://localhost:5000](http://localhost:5000) (default port).

### Environment Variables

Make sure to configure your environment variables.
- **Root `.env`**: Frontend configurations (API base URL, etc.)
- **Backend `.env`**: Database URI, JWT Secret, Cloudinary credentials, Razorpay keys, etc.

## 📜 Scripts

### Frontend
- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint checks.

### Backend
- `npm run dev`: Runs the backend in development mode with Nodemon.
- `npm run start`: Runs the backend server.
- `npm run seed`: Seeds the database with initial data.
- `npm test`: Runs backend tests.

## 🤝 Contribution

Contributions are welcome! Please ensure that you update the `.gitignore` as needed and follow the existing code style.
