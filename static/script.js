document.addEventListener("DOMContentLoaded", () => {
    const gameContainer = document.querySelector(".container");
    const userResult = document.querySelector(".user_result img");
    const cpuResult = document.querySelector(".cpu_result img");
    const result = document.querySelector(".result");
    const optionImages = document.querySelectorAll(".option_image");
    const backgroundMusic = document.getElementById('backgroundMusic');

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
            
            if (data.error) {
                throw new Error(data.error);
            }

            // Set a timeout to display the result calculation
            setTimeout(() => {
                gameContainer.classList.remove("start");

                // Update the UI with the game result
                userResult.src = `/static/images/${data.user_choice}.png`;
                cpuResult.src = `/static/images/${data.computer_choice}.png`;
                result.textContent = data.result;

            }, 2500);

        } catch (error) {
            console.error('Error:', error);
            result.textContent = 'Error: ' + error.message;
            gameContainer.classList.remove("start");
        }
    };

    // Add click event listeners to option images
    optionImages.forEach((image) => {
        image.addEventListener("click", (e) => {
            const userChoice = image.querySelector("img").alt.toLowerCase();
            playGame(userChoice, image);
        });
    });

    // Auto-play background music (with error handling for autoplay policies)
    const playBackgroundMusic = () => {
        const playPromise = backgroundMusic.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Autoplay prevented:", error);
                // Show a play button or handle the error appropriately
            });
        }
    };

    // Try to play music when the page loads
    playBackgroundMusic();
});
