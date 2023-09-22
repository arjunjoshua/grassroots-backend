# Grassroots - Backend

## Overview

The backend for the Grassroots application aims to provide all the necessary APIs for match scheduling. It's built with a serverless architecture and hosted on Vercel.

## Features

### Endpoints

- **POST /api/auth/register**: Register a new user
- **POST /api/auth/login**: Login an existing user
- **POST /api/team/create**: Create a new team
- **GET /api/matches**: List all available matches based on team details
- **POST /api/matchPost/create**: Create a new match post
- **POST /api/matchPost/interested**: Mark as interested in a match
- **GET /api/notifications**: Get user notifications

## Getting Started

1. Clone this repository
2. Run `npm install`
3. Start the application with `npm start`

## Technology Stack

- Node.js
- MongoDB hosted on Atlas
- Serverless architecture on Vercel

