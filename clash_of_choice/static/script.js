document.addEventListener("DOMContentLoaded", () => {
    const gameContainer = document.querySelector(".container");
    const userResult = document.querySelector(".user_result img");
    const cpuResult = document.querySelector(".cpu_result img");
    const result = document.querySelector(".result");
    const optionImages = document.querySelectorAll(".option_image");

    const playGame = async (userChoice, element) => {
        // Add active class to the clicked image
        optionImages.forEach(img => img.classList.remove("active"));
        element.classList.add("active");

        // Reset images and result text
        userResult.src = cpuResult.src = "/static/images/rock.png";
        result.textContent = "Wait...";

        // Start the shaking animation
        gameContainer.classList.add("start");

        try {
            // Send the user's choice to the backend
            const response = await fetch('/play', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ choice: userChoice })
            });

            const data = await response.json();

            // Set a timeout to display the result calculation
            setTimeout(() => {
                gameContainer.classList.remove("start");

                // Update the UI with the results from the backend
                userResult.src = `/static/images/${data.user_choice}.png`;
                cpuResult.src = `/static/images/${data.cpu_choice}.png`;
                result.textContent = data.result;

            }, 2500);

        } catch (error) {
            console.error('Error:', error);
            gameContainer.classList.remove("start");
            result.textContent = "Error playing the game. Please try again.";
        }
    };

    optionImages.forEach((image) => {
        image.addEventListener("click", (e) => {
            const userChoice = image.querySelector("img").alt.toLowerCase();
            playGame(userChoice, image);
        });
    });
});

// Example JavaScript for game logic and audio controls
const backgroundMusic = document.getElementById('backgroundMusic');

// Function to play background music
function playBackgroundMusic() {
    backgroundMusic.play();
}
// Function to pause background music
function pauseBackgroundMusic() {
    backgroundMusic.pause();
}

