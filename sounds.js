// Sound effects for interactive elements
const sounds = {
    hover: new Audio('sounds/hover.mp3'),
    flip: new Audio('sounds/flip.mp3'),
    click: new Audio('sounds/click.mp3')
};

// Play sound with volume control
function playSound(sound, volume = 0.3) {
    try {
        sound.volume = volume;
        sound.currentTime = 0;
        sound.play();
    } catch (e) {
        console.log("Sound error:", e);
    }
}

// Initialize sound effects for elements
function initSoundEffects() {
    // Button hover sounds
    document.querySelectorAll('button, a').forEach(el => {
        el.addEventListener('mouseenter', () => playSound(sounds.hover, 0.2));
        el.addEventListener('click', () => playSound(sounds.click));
    });

    // Card flip sounds
    document.querySelectorAll('.story-card, .game-card').forEach(card => {
        card.addEventListener('mouseenter', () => playSound(sounds.flip, 0.25));
    });
}

// Touch support for mobile devices
function initTouchSupport() {
    const cards = document.querySelectorAll('.story-card, .game-card');
    
    cards.forEach(card => {
        card.addEventListener('touchstart', (e) => {
            e.preventDefault();
            card.classList.add('touched');
            playSound(sounds.flip, 0.2);
        }, {passive: false});

        card.addEventListener('touchend', () => {
            card.classList.remove('touched');
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initSoundEffects();
    initTouchSupport();
});
