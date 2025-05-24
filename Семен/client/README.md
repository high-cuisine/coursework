# Business Management System

A modern web application for managing banks, suppliers, customers, products, and orders.

## Features

- Dashboard with key metrics
- CRUD operations for all entities
- Modern and responsive UI
- Real-time data updates
- Form validation
- Error handling

## Prerequisites

- Node.js 16.x or later
- npm 7.x or later
- PostgreSQL database
- Backend server running on port 5009

## Installation

1. Clone the repository
2. Navigate to the client directory:
   ```bash
   cd client
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technologies Used

- React
- Vite
- Material-UI
- React Query
- React Router
- Axios

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── pages/         # Page components
  ├── services/      # API services
  ├── App.jsx        # Main application component
  └── main.jsx       # Application entry point
```

## API Endpoints

The application expects the following API endpoints to be available:

- `/api/banks` - Bank management
- `/api/suppliers` - Supplier management
- `/api/customers` - Customer management
- `/api/products` - Product management
- `/api/orders` - Order management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
