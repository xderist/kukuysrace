const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Adding 12 ducks with initial positions, random speeds, colors, and names
let ducks = [
    { x: 10, y: 20, speed: Math.random() * 3 + 1, color: "red", name: "Jau Racer" },
    { x: 10, y: 70, speed: Math.random() * 3 + 1, color: "blue", name: "Jwl Bolt" },
    { x: 10, y: 120, speed: Math.random() * 3 + 1, color: "green", name: "Gabbi Fury" },
    { x: 10, y: 170, speed: Math.random() * 3 + 1, color: "yellow", name: "Armel Flash" },
    { x: 10, y: 220, speed: Math.random() * 3 + 1, color: "purple", name: "Etet Blaze" },
    { x: 10, y: 270, speed: Math.random() * 3 + 1, color: "orange", name: "Karl Streak" },
    { x: 10, y: 320, speed: Math.random() * 3 + 1, color: "pink", name: "Abat Sprint" },
    { x: 10, y: 370, speed: Math.random() * 3 + 1, color: "brown", name: "Palos Dasher" },
    { x: 10, y: 420, speed: Math.random() * 3 + 1, color: "cyan", name: "Yowe Swirl" },
    { x: 10, y: 470, speed: Math.random() * 3 + 1, color: "magenta", name: "Kuku Flyer" },
    { x: 10, y: 520, speed: Math.random() * 3 + 1, color: "lime", name: "Jing Streak" },
    { x: 10, y: 570, speed: Math.random() * 3 + 1, color: "teal", name: "Kokz Rocket" }
];

let raceInterval;
let winnerName = null; // Variable to store the winner's name
const finishLineX = canvas.width - 60; // Position for the finish line

// Function to create a gradient background and add the finish line
function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "skyblue");
    gradient.addColorStop(1, "lightgreen");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the finish line
    ctx.fillStyle = "black"; // Line color
    ctx.fillRect(finishLineX, 0, 5, canvas.height); // Line dimensions (thin vertical line)
}

// Function to randomly update the ducks' speed
function updateSpeeds() {
    ducks.forEach(duck => {
        duck.speed = Math.random() * 3 + 1; // Speed changes between 1 and 4
    });
    setTimeout(updateSpeeds, 1000); // Change speed every second
}

// Function to draw ducks and their names
function drawDucks() {
    drawBackground(); // Draw the background first
    ducks.forEach(duck => {
        // Draw the duck (rectangle)
        ctx.fillStyle = duck.color; // Use the duck's color
        ctx.fillRect(duck.x, duck.y, 50, 30);

        // Draw the duck's name
        ctx.fillStyle = "black"; // Text color
        ctx.font = "15px Arial"; // Text font
        ctx.fillText(duck.name, duck.x, duck.y - 5); // Position name above the rectangle
    });

    // Display the winner if the race has ended
    if (winnerName) {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText(`Winner: ${winnerName}`, canvas.width / 2 - 100, canvas.height / 2);
    }
}

// Function to update ducks' positions
function updateDucks() {
    ducks.forEach(duck => {
        duck.x += duck.speed;
    });
}

// Check for a winner
function checkWinner() {
    return ducks.find(duck => duck.x + 50 >= finishLineX); // Detect duck crossing the finish line
}

// Main race function
function race() {
    drawDucks();
    updateDucks();
    const winner = checkWinner();
    if (winner) {
        clearInterval(raceInterval);
        winnerName = winner.name; // Store the winner's name
        drawDucks(); // Call drawDucks to display the winner on the canvas
        document.getElementById("restartButton").style.display = "inline"; // Show the restart button
        document.getElementById("startButton").style.display = "none"; // Hide the start button
    }
}

// Reset the game
function resetRace() {
    clearInterval(raceInterval); // Stop any ongoing race
    ducks = ducks.map((duck, index) => ({
        x: 10, 
        y: duck.y, 
        speed: Math.random() * 3 + 1, 
        color: duck.color,
        name: duck.name
    })); // Reset positions and speeds while preserving names
    winnerName = null; // Reset the winner name
    drawDucks(); // Redraw the ducks in their initial positions
    document.getElementById("restartButton").style.display = "none"; // Hide the restart button
    document.getElementById("startButton").style.display = "inline"; // Show the start button again
}

// Call drawDucks initially to display everything on page load
drawDucks();

document.getElementById("startButton").addEventListener("click", () => {
    document.getElementById("startButton").style.display = "none"; // Hide the start button
    raceInterval = setInterval(race, 50);
    updateSpeeds(); // Start updating speeds
});

document.getElementById("restartButton").addEventListener("click", () => {
    resetRace(); // Reset the race
});