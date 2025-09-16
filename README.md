# React Only Web POS App

## Overview

A simple Point of Sale (POS) application built with React.js for the frontend and `json-server` as a mock backend. The app uses a `db.json` file to simulate a database for managing products, transactions, and other POS-related data.

## Features

- Create, read, update, and delete (CRUD) operations for POS data
- User-friendly interface built with React.js
- Mock backend using `json-server` for API simulation
- Data persistence in `db.json`

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. **Clone the repository:**

   ```bash
   git clone <your-repository-url>
   cd react-only-web
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up json-server:**  
   Ensure the `db.json` file is in `data/` directory.  
   Install `json-server` globally or locally:
   ```bash
   npm install -g json-server
   ```
   Or, if using locally:
   ```bash
   npm install json-server --save-dev
   ```

## Running the Application

1. **Start the json-server:**  
   Run the json-server to serve the `db.json` file as a mock API:

   ```bash
   npx json-server --watch db.json --port 3001
   ```

   The server will run on [http://localhost:3001](http://localhost:3001).

2. **Start the React app:**  
   In a separate terminal, start the React development server:
   ```bash
   npm run dev
   ```
   The app will run on [http://localhost:3000](http://localhost:3000).

## Project Structure

```
react-only-web/
├── data/           # Store mock database db.json for json-server
├── public/         # Static assets
├── src/            # React source files
├── package.json    # Project dependencies and scripts
└── README.md       # This file
```

## Usage

- Open the app in your browser at [http://localhost:3000](http://localhost:3000).
- Interact with the POS interface to manage products, process transactions, or perform other operations.
- The `json-server` handles API requests at [http://localhost:3001](http://localhost:3001) and updates the `db.json` file accordingly.

## Example db.json Structure

```json
{
  "menus": [
    {
      "id": "b021",
      "name": "Nasi Goreng Hongkong",
      "price": 25000,
      "stock": 1,
      "category": "makanan"
    }
  ],
  "orders": [
    {
      "id": "e1b1",
      "customerName": "Yoga",
      "orderNumber": "70118",
      "orderType": "Dine In",
      "date": "2024-06-25",
      "time": "1:44:02 AM",
      "items": [
        {
          "id": "b021",
          "name": "Nasi Goreng Hongkong",
          "price": 25000,
          "stock": 9,
          "category": "makanan",
          "quantity": 1
        },
        ...
      ],
      "total": 89000,
      "status": 3,
      "payment": 2
    }
  ]
}
```

## db.json Field Explanations

- menus: Stores product details like name, price, stock, and category.
- orders: Stores transaction details:
  - status: Order status (e.g., 1 = In Progress, 2 = Ready, 3 = Completed).
  - payment: Paid status (e.g., 1 = Unpaid, 2 = Paid).

## Available Scripts

- `npm run dev`: Runs the React app in development mode.
- `npm run build`: Builds the app for production.
- `npx json-server --watch db.json --port 3001`: Runs the mock backend.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.
