
// =====================================
// CYBERPUNK RGB PORTFOLIO
// INTERACTIVE JAVASCRIPT ENGINE
// =====================================


// 1. LOADING SCREEN

window.addEventListener("load", () => {
    setTimeout(() => {
        document.getElementById("loader")
            .classList.add("hidden");
    }, 1900);
});


// 2. CURRENT YEAR

document.getElementById("year").textContent =
    new Date().getFullYear();


// 3. MOBILE NAVIGATION

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.textContent = isOpen ? "✕" : "☰";
    menuToggle.setAttribute("aria-expanded", isOpen);
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.textContent = "☰";
        menuToggle.setAttribute("aria-expanded", "false");
    });
});


// 4. TYPING ANIMATION

const typingElement = document.getElementById("typing");

const words = [
    "CREATIVE THINKER",
    "FUTURE DEVELOPER",
    "TECH ENTHUSIAST",
    "DREAM CHASER",
    "DIGITAL EXPLORER"
];

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {
    const currentWord = words[wordIndex];

    if (!deleting) {
        typingElement.textContent =
            currentWord.substring(0, charIndex + 1);

        charIndex++;

        if (charIndex === currentWord.length) {
            deleting = true;
            setTimeout(typeEffect, 1400);
            return;
        }

    } else {
        typingElement.textContent =
            currentWord.substring(0, charIndex - 1);

        charIndex--;

        if (charIndex === 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }
    }

    setTimeout(typeEffect, deleting ? 45 : 90);
}

typeEffect();


// 5. SCROLL REVEAL

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12
    }
);

document.querySelectorAll(".reveal").forEach(element => {
    observer.observe(element);
});


// 6. INTERACTIVE 3D TILT

const tiltCards = document.querySelectorAll(".tilt-card");

const supportsHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
).matches;

if (supportsHover) {
    tiltCards.forEach(card => {

        card.addEventListener("pointermove", event => {

            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX =
                ((y - centerY) / centerY) * -7;

            const rotateY =
                ((x - centerX) / centerX) * 7;

            card.style.transform =
                `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

        });

        card.addEventListener("pointerleave", () => {
            card.style.transform =
                "perspective(1000px) rotateX(0deg) rotateY(0deg)";
        });

    });
}


// 7. PARTICLE BACKGROUND

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let particles = [];
let width = 0;
let height = 0;

const mouse = {
    x: null,
    y: null,
    radius: 120
};

const particleCount =
    window.innerWidth < 600 ? 40 : 85;

function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    particles = [];

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            size: Math.random() * 2 + 0.5,
            color: Math.random() > 0.5
                ? "#00f7ff"
                : "#b000ff"
        });
    }
}

function drawParticles() {

    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, index) => {

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse interaction

        if (mouse.x !== null && mouse.y !== null) {

            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius && distance > 0) {

                const force = (mouse.radius - distance) / mouse.radius;

                p.x += (dx / distance) * force * 1.8;
                p.y += (dy / distance) * force * 1.8;
            }
        }

        // Draw particle

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fill();

        ctx.shadowBlur = 0;

        // Connect nearby particles

        for (let j = index + 1; j < particles.length; j++) {

            const other = particles[j];

            const dx = p.x - other.x;
            const dy = p.y - other.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 115) {

                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(other.x, other.y);

                ctx.strokeStyle =
                    `rgba(0, 247, 255, ${1 - distance / 115})`;

                ctx.lineWidth = 0.4;
                ctx.stroke();
            }
        }
    });

    requestAnimationFrame(drawParticles);
}

window.addEventListener("resize", resizeCanvas);

window.addEventListener("pointermove", event => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

document.addEventListener("pointerleave", () => {
    mouse.x = null;
    mouse.y = null;
});

resizeCanvas();
drawParticles();


// 8. MUSIC PLAYER

const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const muteBtn = document.getElementById("muteBtn");
const volume = document.getElementById("volume");
const musicStatus = document.getElementById("musicStatus");
const musicDisc = document.getElementById("musicDisc");

audio.volume = Number(volume.value);

function updateMusicUI(playing) {
    playBtn.textContent = playing ? "Ⅱ" : "▶";

    musicStatus.textContent =
        playing ? "NOW PLAYING" : "READY TO PLAY";

    musicDisc.classList.toggle("playing", playing);
}

playBtn.addEventListener("click", async () => {

    if (audio.paused) {

        try {
            await audio.play();
            updateMusicUI(true);

        } catch (error) {
            musicStatus.textContent = "ADD MUSIC FILE";
            console.warn("Music could not be played:", error);
        }

    } else {

        audio.pause();
        updateMusicUI(false);
    }
});

audio.addEventListener("play", () => updateMusicUI(true));
audio.addEventListener("pause", () => updateMusicUI(false));

volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);

    if (audio.volume > 0 && audio.muted) {
        audio.muted = false;
        muteBtn.textContent = "♪";
    }
});

muteBtn.addEventListener("click", () => {

    audio.muted = !audio.muted;

    muteBtn.textContent = audio.muted ? "×" : "♪";

});

audio.addEventListener("error", () => {
    musicStatus.textContent = "MUSIC FILE NOT FOUND";
});


// 9. SMOOTH NAVIGATION

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

        const target = document.querySelector(
            link.getAttribute("href")
        );

        if (target) {
            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

    });

});


// =====================================
// END OF CYBERPUNK ENGINE
// =====================================
