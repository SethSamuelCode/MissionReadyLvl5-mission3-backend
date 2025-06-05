# Turners Cars Interview AI Assistant

## Project Overview

This is an AI-powered interview assistant designed for Turners Cars to help conduct structured, fair, and consistent job interviews using Google's Gemini AI. The application allows for dynamic interview sessions tailored to specific job roles.

## Features

- 🤖 AI-driven interview simulation
- 🎯 Customizable for different job positions
- 🔒 Secure and private interview sessions
- 💬 Interactive chat-based interview process

## Technologies Used

- React
- Google Gemini AI

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Google Gemini API Key

## Environment Setup

1. Clone the repository
2. Create a `.env` file with the following variables:
   ```
    SERVER_LISTEN_PORT=4000
    GEMINI_API_KEY={{ your_google_gemini_api_key }}
   ```

## Running locally with docker compose
run containers
```sh

./runDockerCompose.sh
```
go to [http://localhost][def] to use Project

stop containers
```sh
ctrl + c 
```
clean up

```sh
docker compose down 
```

## Deployment

The application can be deployed to any Node.js compatible hosting platform.

## Key Components

- **ChatSession**: Manages AI interview interactions
- **Interview Flow**: Guides candidates through job-specific interviews
- **UUID Management**: Ensures unique and persistent interview sessions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact


Project Link: [Your Project Repository URL]

## acknowledgements  

 * [Valentine for frontend and system prompt](https://github.com/valentine-ncube)
 * [Kent for system prompt](https://github.com/Kent-Wharerau)
 * [Rachel for system prompt](https://github.com/muddyducky)


[def]: http://localhost