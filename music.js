/* ==========================================================================
   SEAMLESS CONTINUOUS BACKGROUND MUSIC LOGIC (SPA DUAL-TOGGLE SYNC)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const audio = document.getElementById("bg-music");
    const toggles = document.querySelectorAll("#music-toggle, #home-music-toggle");
    
    if (!audio || toggles.length === 0) return;

    // Set stable, relaxing volume
    audio.volume = 0.28;

    // Check states
    const isMusicSavedPlaying = localStorage.getItem("musicPlaying") === "true";
    const savedTime = parseFloat(localStorage.getItem("musicTime") || "0");

    if (savedTime > 0) {
        audio.currentTime = savedTime;
    }

    const playAudio = () => {
        audio.play().then(() => {
            toggles.forEach(toggle => toggle.classList.add("playing"));
            localStorage.setItem("musicPlaying", "true");
        }).catch(err => {
            console.log("Audio autoplay waiting for user interaction gesture.");
        });
    };

    const pauseAudio = () => {
        audio.pause();
        toggles.forEach(toggle => toggle.classList.remove("playing"));
        localStorage.setItem("musicPlaying", "false");
    };

    // Auto-resume state if playing previously
    if (isMusicSavedPlaying) {
        playAudio();
        
        // Secondary trigger in case browser blocked initial load
        const gestureResume = () => {
            if (audio.paused && localStorage.getItem("musicPlaying") === "true") {
                playAudio();
            }
            document.removeEventListener("click", gestureResume);
            document.removeEventListener("keydown", gestureResume);
        };
        document.addEventListener("click", gestureResume);
        document.addEventListener("keydown", gestureResume);
    }

    // Toggle buttons handlers
    toggles.forEach(toggle => {
        toggle.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();
            if (audio.paused) {
                playAudio();
            } else {
                pauseAudio();
            }
        });
    });

    // Save current playback offset before unload
    window.addEventListener("beforeunload", () => {
        localStorage.setItem("musicTime", audio.currentTime.toString());
    });

    // Regularly save currentTime as backup in case of sudden exits
    setInterval(() => {
        if (!audio.paused) {
            localStorage.setItem("musicTime", audio.currentTime.toString());
        }
    }, 1000);
});
