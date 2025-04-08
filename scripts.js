document.addEventListener("DOMContentLoaded", () => {
    fetch('entries.json')
        .then(response => {
            console.log('Response received');
            return response.json();
        })
        .then(entries => {
            console.log("Entries loaded:", entries);

            // Get button and dropdown elements
            var genreBtns = document.querySelectorAll('.genre-btn');
            var vibeBtns = document.querySelectorAll('.vibe-btn');
            var occasionBtns = document.querySelectorAll('.occasion-btn');

            var submitButton = document.querySelector('button[name="submit"]');
            var output = document.querySelector('.output');
            var backgroundBlur = document.querySelector('.background-blur');

            // get controls container
            var controlsContainer = document.querySelector('.container');
            var submitButtonContainer = document.querySelector('.submit-btn')

            var errorPopup = document.querySelector(".error");
            var closeError = document.querySelector(".close-btn");
          
            

            let selectedGenre = '';
            let selectedVibe = '';
            let selectedOccasion = '';

// Function to check if genre matches
function isGenreMatch(entryGenres, selectedGenre) {
    if (Array.isArray(entryGenres)) {
        return entryGenres.some(genre => genre.toLowerCase() === selectedGenre.toLowerCase());
    }
    return entryGenres.toLowerCase() === selectedGenre.toLowerCase();
}



// Event listeners for genre buttons
genreBtns.forEach(button => {
    button.addEventListener('click', () => {
        selectedGenre = button.value; // Save the selected genre
        console.log('Selected genre:', selectedGenre); // Debug log

        genreBtns.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Check if a matching entry exists for the selected genre
        var matchingEntries = entries.filter((entry) => isGenreMatch(entry.genre, selectedGenre));
        console.log('Matching entries:', matchingEntries); // Debug log

        // Enable or disable the other controls based on genre matching
        if (matchingEntries.length > 0) {
            vibeSelect.disabled = false;
            occasionBtns.forEach(btn => btn.disabled = false);
        } else {
            vibeSelect.disabled = true;
            occasionBtns.forEach(btn => btn.disabled = true);
        }
    });
});

// Function to check if vibe matches
function isVibeMatch(entryVibes, selectedVibe) {
    // Check if entryVibes is an array
    if (Array.isArray(entryVibes)) {
        // If it's an array, check if the selectedVibe is in the array (case-insensitive)
        return entryVibes.some(vibe => vibe.toLowerCase() === selectedVibe.toLowerCase());
    }
    
    // If it's not an array, just check if it matches directly (case-insensitive)
    return entryVibes.toLowerCase() === selectedVibe.toLowerCase();
}

// Event listeners for vibe buttons
vibeBtns.forEach(button => {
    button.addEventListener('click', () => {
        selectedVibe = button.value; // Save the selected vibe
        console.log('Selected vibe:', selectedVibe); // Debug log

        vibeBtns.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

            // Event listeners for occasion buttons
            occasionBtns.forEach(button => {
                button.addEventListener('click', () => {
                    selectedOccasion = button.value; // Save the selected occasion
                    console.log('Selected occasion:', selectedOccasion); // Debug log
                    occasionBtns.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                });
            });

            // Function to format duration (min:sec)
            function formatDuration(duration) {
                const minutes = Math.floor(duration);
                const seconds = Math.round((duration - minutes) * 60);
                return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            }

            // Function to check if occasion matches
            function isOccasionMatch(entryOccasions, selectedOccasion) {
                if (Array.isArray(entryOccasions)) {
                    return entryOccasions.some(occasion => occasion.toLowerCase() === selectedOccasion.toLowerCase());
                }
                return entryOccasions.toLowerCase() === selectedOccasion.toLowerCase();
            }

            // Handle submit button
            submitButton.addEventListener('click', () => {
                console.log('Submit button clicked'); // Debug log

                // Filter matching entries based on selected genre, vibe, and occasion
                var matchingEntries = entries.filter((entry) => {
                    return entry.genre === selectedGenre &&
                        entry.vibe === selectedVibe &&
                        isOccasionMatch(entry.occasion, selectedOccasion); // Now checking for multiple occasions
                });

                console.log("Matching entries:", matchingEntries); // Debug log to check the results

                if (matchingEntries.length > 0) {
                    // Randomly select an entry from the matching entries
                    var randomEntry = matchingEntries[Math.floor(Math.random() * matchingEntries.length)];
                    console.log('Random matching entry:', randomEntry); // Debug log

                    // Set background image 
                    if (randomEntry.image) {
                        backgroundBlur.style.backgroundImage = `url('${randomEntry.image}')`;
                        backgroundBlur.style.backgroundSize = 'cover';
                        backgroundBlur.style.backgroundPosition = 'center';
                        backgroundBlur.style.backgroundRepeat = 'no-repeat';
                        backgroundBlur.style.backgroundAttachment = 'fixed';
                    } else {
                        console.warn("No image found for this entry.");
                        backgroundBlur.style.backgroundImage = 'none';
                    }

                    const formattedDuration = formatDuration(randomEntry['duration (min)']);
                    output.id = "results-container"; // Dynamically adding the ID for styling
                    output.innerHTML = `
                        <h4 class="title">${randomEntry.title}</h4>
                        <h3 class="artist">${randomEntry.artist}</h3>
                        <p class="result year"> ${randomEntry.year}</p>
                        <p class="result duration">${formattedDuration}</p>
                        <p class="result occasion">occasion: ${randomEntry.occasion}</p>
                        <p class="result vibe">vibe: ${randomEntry.vibe}</p>
    
                    `;
                    controlsContainer.style.display = "none"; //hide container
                    submitButtonContainer.style.display = "none"; //hide container
                    errorPopup.style.display = "none"; // Hide error if match found
                    backgroundBlur.style.display = "block"; // Show the background blur
                } else {
                    console.log('No matching entries found'); // Debug log
                    errorPopup.style.display = "flex"; // Show error popup
                    output.innerHTML = ""; // Clear previous output
                    backgroundBlur.style.display = "none"; // Hide the background blur
                }
            });

            closeError.addEventListener("click", () => {
                errorPopup.style.display = "none";
            });
            errorPopup.addEventListener("click", (event) => {
                if (event.target === errorPopup) {
                    errorPopup.style.display = "none";
                }
            });
        })
        .catch(error => {
            console.error('Error loading entries:', error);
        });
});
const ellipseContainer = document.querySelector(".ellipse-container");
const imageUrls = [
    "assets/albumcovers/acousticsoul.jpeg",
    "assets/albumcovers/agift&acurse.jpeg",
    "assets/albumcovers/atlantamillionairesclub.jpeg",
    "assets/albumcovers/awakenmylove.jpg",
    "assets/albumcovers/dripharder.jpeg",
    "assets/albumcovers/eastatlantaloveletter.jpeg"
];

let images = [];

// Create and append images dynamically
imageUrls.forEach((src, index) => {
    let img = document.createElement("img");
    img.src = src;
    img.classList.add("ellipse-image");
    ellipseContainer.appendChild(img);
    images.push(img);
});

// Function to update image positions based on scroll
function updateEllipse() {
    let scrollPosition = window.scrollY;
    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight / 2;

    images.forEach((img, index) => {
        let angle = (index / images.length) * Math.PI * 2; // Spread in a circle
        let xOffset = Math.cos(angle) * 200; // Adjust width of ellipse
        let yOffset = Math.sin(angle) * 100; // Adjust height of ellipse

        let opacity = Math.min(1, (scrollPosition - index * 200) / 300); // Gradual fade-in

        img.style.transform = `translate(${centerX + xOffset}px, ${centerY + yOffset + scrollPosition * 0.3}px)`;
        img.style.opacity = opacity > 0 ? opacity : 0;
    });
}

// Attach event listener to scroll event
window.addEventListener("scroll", updateEllipse);
