console.log('JS is connected');
// ----------- Slideshow Logic -----------
const images = document.querySelectorAll('.slideshow-container img');
let currentIndex = 0;

function changeImage() {
  images[currentIndex].classList.add('hidden');
  currentIndex = (currentIndex + 1) % images.length;
  images[currentIndex].classList.remove('hidden');
}

document.getElementById('slideshow')?.addEventListener('click', changeImage);

// ----------- H1 Clickable Text Logic -----------
const h1 = document.getElementById('clickable-text');
const texts = [
  'Known as a mecca for rap, hip-hop, soul and R&B, <span class="atlanta">Atlanta</span> has loomed large as a destination for rockers since the 1960s.',
  'In 2009 the New York Times noted that after 2000, <span class="atlanta">Atlanta</span> moved "from the margins to becoming hip-hop\'s center of gravity, part of a larger shift in hip-hop innovation to the South."',
  '<span class="atlanta">Atlanta\'s</span> music history is a testament to its role as a center of innovation and creativity...',
  '<span class="atlanta">Atlanta\'s</span> hip-hop scene continues to shape global music trends...'
];
let textIndex = 0;

h1?.addEventListener('click', () => {
  textIndex = (textIndex + 1) % texts.length;
  h1.innerHTML = texts[textIndex];
});

// ----------- Dropdown Toggle Logic -----------
const dropdown = document.getElementById('dropdown');
const dropdownContent = document.getElementById('dropdown-content');

dropdown?.addEventListener('click', function (event) {
  event.stopPropagation();
  dropdownContent?.classList.toggle('show');
});

document.addEventListener('click', function (event) {
  if (!dropdown?.contains(event.target)) {
    dropdownContent?.classList.remove('show');
  }
});


// ---------- Vibe + Occasion JSON Filter Logic -----------

let songs = [];
const vibeBtns = document.querySelectorAll('.vibe-btn');
const occasionBtns = document.querySelectorAll('.occasion-btn');
const selectedVibeBtn = document.querySelector('.vibe-btn.selected');
const selectedOccasionBtn = document.querySelector('.occasion-btn.selected');

const vibeValue = selectedVibeBtn?.textContent.toLowerCase() || '';
const occasionValue = selectedOccasionBtn?.textContent.toLowerCase() || '';



// Add event listeners to vibe buttons
// Remove the filter calls from button click events
vibeBtns.forEach(vibeBtn => {
  vibeBtn.addEventListener('click', function() {
    vibeBtns.forEach(btn => btn.classList.remove('selected'));
    this.classList.add('selected');
    // Removed filterSongsByVibeAndOccasion() call here
  });
});

occasionBtns.forEach(occasionBtn => {
  occasionBtn.addEventListener('click', function() {
    occasionBtns.forEach(btn => btn.classList.remove('selected'));
    this.classList.add('selected');
    // Removed filterSongsByVibeAndOccasion() call here
  });
});

// Add search button event listener
document.getElementById('search-btn')?.addEventListener('click', function() {
  filterSongsByVibeAndOccasion();
});

// Modify loadSongs to NOT filter immediately
async function loadSongs() {
  try {
    const response = await fetch('playlist.json');
    songs = await response.json();
    // Removed filterSongsByVibeAndOccasion() call here
  } catch (error) {
    console.error('Error loading playlist:', error);
  }
}

// Filter songs by vibe and occasion
  // Close button functionality
  document.querySelector('.close-btn')?.addEventListener('click', function() {
    document.getElementById('error').style.display = 'none';
  });
    

// Add search button event listener
document.getElementById('search-btn')?.addEventListener('click', function() {
  // Show the playlist container
  document.getElementById('playlist').style.display = 'block';
  
  // Now filter the songs based on selected vibe and occasion
  filterSongsByVibeAndOccasion();
});

function filterSongsByVibeAndOccasion() {
  const errorDiv = document.getElementById('error');
  errorDiv.style.display = 'none';


  const vibeValue = document.querySelector('.vibe-btn.selected')?.textContent.toLowerCase() || '';
  const occasionValue = document.querySelector('.occasion-btn.selected')?.textContent.toLowerCase() || '';

  
  const errorMessageDiv = document.getElementById('error');
  errorMessageDiv.style.display = 'none';
  
  console.log("Filtering by - Vibe:", vibeValue, "Occasion:", occasionValue);

  const filtered = songs.filter(song => {
    const vibeMatch = Array.isArray(song.vibe)
      ? song.vibe.some(v => v.toLowerCase() === vibeValue)
      : song.vibe.toLowerCase() === vibeValue;

    const occasionMatch = Array.isArray(song.occasion)
      ? song.occasion.some(o => o.toLowerCase() === occasionValue)
      : song.occasion.toLowerCase() === occasionValue;

    return (vibeValue === "" || vibeMatch) && (occasionValue === "" || occasionMatch);
  });
  //remove dupes if any
  const uniqueFiltered = [...new Set(filtered.map(song => song.title))].map(title => filtered.find(song => song.title === title));
  // Display results or error
  const resultsDiv = document.getElementById('playlist');
  resultsDiv.innerHTML = '';

  if (filtered.length === 0) {
    errorMessageDiv.style.display = 'block';
    return;
  }

  filtered.forEach(song => {
    const songDiv = document.createElement("div");
    songDiv.classList.add("song-container");
  

    const blurDiv = document.createElement("div");
    blurDiv.classList.add("background-blur");
    blurDiv.style.backgroundImage = `url(${song.image})`;
  
    songDiv.appendChild(blurDiv); // add the blur as a child to the song container
  
    songDiv.innerHTML += `
      <div class="song-title">${song.title}</div>
      <div class="song-info">
        <p>Artist: ${song.artist} | Duration: ${song.duration} | Year: ${song.year} | Vibe: ${song.vibe}</p>
      </div>
    `;
  
    resultsDiv.appendChild(songDiv);
  });

  // Hide all inputs and buttons
document.querySelectorAll('input, .vibe-container, .occasion-container, .search, .choose').forEach(el => {
  el.style.display = 'none';
});

  // Scroll Observer to detect active song section
  const songSections = document.querySelectorAll(".song-container");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active"); // Fade in effect
      } else {
        entry.target.classList.remove("active"); // Fade out when not in view
      }
    });
  }, { threshold: 0.5 });

  songSections.forEach(section => observer.observe(section));
}

// Call the loadSongs function to populate the songs array when the page loads
loadSongs();