# Sales Leads Management App

This is a React-based application for managing sales leads, built with **React**, **TypeScript**, **Tailwind CSS**, and **React Query**. It provides a rich user interface for managing sales leads with features listed below.

## Features

- **Create Leads**: Add new sales leads to the system.
- **Edit Leads**: Modify existing leads with updates.
- **List Leads**: View all sales leads with customizable pagination.
- **Delete Leads**: Remove leads from the system.
- **Multi-column Sorting**: Sort leads by multiple columns using `Ctrl` (Windows/Linux) or `Cmd` (Mac) for selecting more than one column.
- **Query-based Filtering**: Filter leads based on search criteria.
- **Bulk Deletion**: Select multiple leads for bulk deletion.
- **CSV Export**: Export your sales leads to a CSV file.

## Live Demo

Check out the live version of this application here: [Sales Leads Management App](https://sales-leads-frontend-kzehig94x-fahad-khans-projects.vercel.app/)

## Installation Guide

### Prerequisites

Before getting started, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)

### 1. Clone the repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/kfahad5607/sales-leads-frontend.git
```

### 2. Install dependencies

Navigate to the project directory:

```bash
cd sales-leads-frontend
```

Install the dependencies:

```bash
npm install
```

### 3. Set up environment variables and backend

Copy the `.env.example` file to `.env` and set the base URL of your API:

```bash
cp .env.example .env
```

Edit the `.env` file to include the API base URL:

```env
VITE_API_URL=http://localhost:8000
```

To get the FastAPI backend locally, follow the installation steps at [Sales Leads Backend](https://github.com/kfahad5607/sales-leads-backend).

### 4. Start the development server

Once dependencies are installed, you can start the development server with the following command:

```bash
npm run dev
```

This will start the app locally, typically accessible at `http://localhost:3000`.

### 5. Build the project

If you're ready to build the project for production, run:

```bash
npm run build
```

This will generate a production build that can be deployed to any server.

### 6. Preview the production build

To preview the production build locally, use the following command:

```bash
npm run preview
```