# Truco Game

A real-time multiplayer Truco card game built with React, TypeScript, and Socket.IO. Truco is a popular South American card game that combines strategy, bluffing, and skill.

## Features

- 🎮 Real-time multiplayer gameplay
- 👥 Support for up to 4 players
- 👀 Spectator mode
- 💬 In-game chat
- 🎯 Traditional Truco rules with betting (Envido, Truco, Re-truco, Vale cuatro)
- 📱 Responsive design

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Node.js, Express, Socket.IO
- **Styling**: CSS with responsive design
- **Build Tool**: Vite
- **Package Manager**: npm

## Prerequisites

- Node.js (version 16 or higher)
- npm

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd truco
```

2. Install dependencies:
```bash
npm install
```

## How to Run

### Development Mode

To run both the client and server concurrently in development mode:

```bash
npm run dev
```

This will start:
- Client (React app) on `http://localhost:3000`
- Server (Express + Socket.IO) on `http://localhost:3001`

### Run Components Separately

If you prefer to run the client and server separately:

**Start the server:**
```bash
npm run server
```

**Start the client (in a new terminal):**
```bash
npm run client
```

### Production Build

To build the application for production:

```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

## How to Play

### Local Play
1. Open your browser and navigate to `http://localhost:3000`

### Network Play (Multiple Devices)
1. Start the game with `npm run dev`
2. Find your computer's IP address (e.g., `ipconfig` on Windows or `ifconfig` on Mac/Linux)
3. Other players can join by navigating to `http://YOUR_IP:3000` (replace YOUR_IP with your actual IP address)
4. Enter your name to join as a player or join as a spectator
5. Wait for other players to join (minimum 2 players required)
6. **All players vote to start** by clicking the "Vote to Start Game" button
7. Once all players have voted, the game starts automatically
8. Play cards and make strategic bets
9. Use the chat feature to communicate with other players

### Manual Server Start (Alternative)
If you prefer to start games manually from the server terminal:
1. Run the server and client separately (see "Run Components Separately" section)
2. In the server terminal, type `start` and press Enter to force-start the game

### Game Rules

- Truco is played with a Spanish deck (40 cards)
- Each player receives 3 cards per round
- Players can bet points through "Envido" (based on card values) and "Truco" (based on winning hands)
- First team to reach the target score wins

## Project Structure

```
truco/
├── src/                    # React frontend source
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   └── App.tsx            # Main app component
├── server/                # Backend server
│   ├── index.js          # Express server setup
│   └── gameEngine.js     # Game logic
├── cards/                # Card assets
├── package.json          # Dependencies and scripts
└── vite.config.ts        # Vite configuration
```

## Available Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run client` - Start only the React development server
- `npm run server` - Start only the Express server
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.