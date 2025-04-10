const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Adding players with initial positions, random speeds, and names
let players = [
    { x: 10, y: 40, speed: Math.random() * 3 + 1, image: "players/Jau.png", name: "Jau Racer", angle: 0 },
    { x: 10, y: 100, speed: Math.random() * 3 + 1, image: "players/Jwl.png", name: "Jwl Bolt", angle: 0 },
    { x: 10, y: 160, speed: Math.random() * 3 + 1, image: "players/Gabbi.png", name: "Gabbi Fury", angle: 0 },
    { x: 10, y: 220, speed: Math.random() * 3 + 1, image: "players/Armel.png", name: "Armel Flash", angle: 0 },
    { x: 10, y: 280, speed: Math.random() * 3 + 1, image: "players/Etet.png", name: "Etet Blaze", angle: 0 },
    { x: 10, y: 340, speed: Math.random() * 3 + 1, image: "players/Karl.png", name: "Karl Streak", angle: 0 },
    { x: 10, y: 400, speed: Math.random() * 3 + 1, image: "players/Abat.png", name: "Abat Sprint", angle: 0 },
    { x: 10, y: 460, speed: Math.random() * 3 + 1, image: "players/Palos.png", name: "Palos Dasher", angle: 0 },
    { x: 10, y: 520, speed: Math.random() * 3 + 1, image: "players/Yowe.png", name: "Yowe Swirl", angle: 0 },
    { x: 10, y: 580, speed: Math.random() * 3 + 1, image: "players/Kuku.png", name: "Kuku Flyer", angle: 0 },
    { x: 10, y: 640, speed: Math.random() * 3 + 1, image: "players/Jing.png", name: "Jing Streak", angle: 0 },
    { x: 10, y: 700, speed: Math.random() * 3 + 1, image: "players/Kokz.png", name: "Kokz Rocket", angle: 0 },
    { x: 10, y: 760, speed: Math.random() * 3 + 1, image: "players/Hubris.png", name: "Hubris Painter", angle: 0 }
];

let raceInterval;
let winnerName = null;
let selectedPlayers = []; // Array to store selected player indices
const finishLineX = canvas.width - 60;
let gameInProgress = false; // Indicates whether the game is running

// Function to preload player images
function preloadImages(callback) {
    let loadedCount = 0;
    players.forEach(player => {
        const img = new Image();
        img.src = player.image;
        img.onload = () => {
            player.imgElement = img;
            loadedCount++;
            if (loadedCount === players.length) {
                callback();
            }
        };
    });
}

// Draw the background and finish line
function drawBackground() {
    ctx.fillStyle = "lightblue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Finish line
    ctx.fillStyle = "black";
    ctx.fillRect(finishLineX, 0, 5, canvas.height);
}

// Draw buttons inside the canvas
function drawButtons(showStart, showRestart) {
    const fontSize = 20;
    ctx.font = `${fontSize}px Arial`;

    if (showStart) {
        const textWidth = ctx.measureText("Start").width;
        ctx.fillStyle = "blue";
        ctx.fillRect(canvas.width / 4 - textWidth / 2 - 10, canvas.height - 60, textWidth + 20, fontSize + 10);
        ctx.fillStyle = "white";
        ctx.fillText("Start", canvas.width / 4 - textWidth / 2, canvas.height - 40);
    }

    if (showRestart) {
        const textWidth = ctx.measureText("Restart").width;
        ctx.fillStyle = "blue";
        ctx.fillRect((canvas.width / 4) * 3 - textWidth / 2 - 10, canvas.height - 60, textWidth + 20, fontSize + 10);
        ctx.fillStyle = "white";
        ctx.fillText("Restart", (canvas.width / 4) * 3 - textWidth / 2, canvas.height - 40);
    }
}

// Draw players
function drawPlayers() {
    players.forEach(player => {
        // Draw the player's image
        if (player.imgElement) {
            ctx.drawImage(player.imgElement, player.x, player.y, 50, 50);
        }

        // Draw player name above the image
        ctx.fillStyle = "black";
        ctx.fillText(player.name, player.x, player.y - 5);

        // Draw legs below the player's image
        const legY = player.y + 50; // Position below the player image
        const legWidth = 10;
        const legHeight = 30;

        // Draw left leg
        ctx.fillStyle = "black";
        ctx.fillRect(player.x + 15, legY, legWidth, legHeight);

        // Draw right leg
        ctx.fillRect(player.x + 25, legY, legWidth, legHeight);

        // Draw feet at the bottom of the legs
        const footY = legY + legHeight; // Position below the legs
        const footWidth = 12;
        const footHeight = 6;

        // Oscillate foot positions based on player speed and position
        const footOffset = Math.sin(player.x / 10) * 5;

        // Draw left foot
        ctx.fillStyle = "black";
        ctx.fillRect(player.x + 15 + footOffset, footY, footWidth, footHeight);

        // Draw right foot
        ctx.fillRect(player.x + 25 - footOffset, footY, footWidth, footHeight);
    });
}

// Draw player selection options
function drawPlayerSelection() {
    players.forEach((player, index) => {
        const x = 20 + index * 60; // Spacing between player icons
        const y = canvas.height - 120; // Position near the bottom
        ctx.drawImage(player.imgElement, x, y, 50, 50);

        // Highlight selected players
        if (selectedPlayers.includes(index)) {
            ctx.strokeStyle = "gold";
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, 50, 50);
        }
    });

    ctx.font = "15px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Select Players (Min: 2)", 20, canvas.height - 140);
}

// Event listener for player selection
canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    players.forEach((player, index) => {
        const x = 20 + index * 60; // Spacing for player icons
        const y = canvas.height - 120;

        if (
            mouseX >= x && mouseX <= x + 50 &&
            mouseY >= y && mouseY <= y + 50
        ) {
            if (selectedPlayers.includes(index)) {
                selectedPlayers = selectedPlayers.filter(i => i !== index); // Deselect player
            } else {
                selectedPlayers.push(index); // Select player only if less than 2 are selected
            }
        }
    });

    drawBackground();
    drawPlayerSelection();
    drawButtons(selectedPlayers.length > 1, false); // Enable "Start" button only when at least 2 players are selected
});

// Check for a winner
function checkWinner() {
    return selectedPlayers.find(index => players[index].x >= finishLineX);
}

// Function to randomize players' speeds
function randomizeSpeed() {
    selectedPlayers.forEach(index => {
        players[index].speed = Math.random() * 3 + 1; // Update speed to a random value between 1 and 4
    });
}

// Main race logic
function race() {
    drawBackground();
    drawPlayers();
    const winner = checkWinner();
    if (winner !== undefined) {
        clearInterval(raceInterval);
        clearInterval(speedChangeInterval);
        winnerName = players[winner].name;
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText(`Winner: ${winnerName}`, canvas.width / 2 - 100, canvas.height / 2);
        drawButtons(false, true); // Enable Restart button
    } else {
        updatePlayers();
    }
}

// Update players' positions
function updatePlayers() {
    selectedPlayers.forEach(index => {
        players[index].x += players[index].speed;
    });
}

// Reset the race
function resetRace() {
    selectedPlayers = [];
    winnerName = null;
    players.forEach(player => (player.x = 10)); // Reset positions
    drawBackground();
    drawPlayerSelection();
    drawButtons(false, false); // Reset buttons
}

// Start the race
canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Check if the "Start" button should be clickable
    const showStart = selectedPlayers.length > 1;

    if (
        showStart && // Only process the click if the "Start" button is visible
        mouseX >= canvas.width / 4 - 50 &&
        mouseX <= canvas.width / 4 + 50 &&
        mouseY >= canvas.height - 60 &&
        mouseY <= canvas.height - 20
    ) {
        gameInProgress = true; // Start the game
        raceInterval = setInterval(race, 50);
        speedChangeInterval = setInterval(randomizeSpeed, 1500);
        drawButtons(false, false); // Hide buttons after starting
    }

    // Check if the "Restart" button is clicked
    if (
        mouseX >= (canvas.width / 4) * 3 - 50 &&
        mouseX <= (canvas.width / 4) * 3 + 50 &&
        mouseY >= canvas.height - 60 &&
        mouseY <= canvas.height - 20
    ) {
        gameInProgress = false; // Reset the game state
        resetRace();
    }
});

// Preload images and initialize the game
preloadImages(() => {
    drawBackground();
    drawPlayerSelection();
    drawButtons(false, false);
});
