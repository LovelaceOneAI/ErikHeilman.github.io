// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Adjust offset if header height changes
                behavior: 'smooth'
            });
        }
    });
});

// ===== Contact Form Handling (Optional) =====
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Basic alert, replace with actual submission logic if needed
        alert('Form submission placeholder. Implement backend logic.');
        contactForm.reset();
    });
}

// ===== Intersection Observer for Fade-in Elements =====
function setupFadeInObserver() {
    const faders = document.querySelectorAll('.fade-in');
    if (faders.length === 0) return; // No elements to observe

    const appearOptions = {
        threshold: 0.1,
        // rootMargin: "0px 0px -50px 0px" // Optional: Adjust margin
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Stop observing once visible
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });
}

// ===== GitHub Projects Fetching =====
async function fetchGitHubProjects(username) {
    const projectsGrid = document.getElementById('github-projects-grid');
    if (!projectsGrid) {
        console.error('Project grid container (#github-projects-grid) not found!');
        return;
    }

    const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&direction=desc`;
    let loadingMessage = projectsGrid.querySelector('p'); // Get loading message if it exists

    try {
        console.log(`Fetching repos for ${username}...`);
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }
        const repos = await response.json();
        console.log(`Found ${repos.length} repos.`);

        // Clear the grid (loading message or previous content)
        projectsGrid.innerHTML = '';

        if (repos.length === 0) {
            projectsGrid.innerHTML = '<p>No public repositories found on GitHub.</p>';
            return;
        }

        repos.forEach(repo => {
            const card = document.createElement('div');
            // Add .card-style if using the consolidated style, otherwise .project-card
            card.classList.add('project-card', 'fade-in', 'card-style'); // Use 'card-style'

            const description = repo.description ? repo.description.replace(/</g, "&lt;").replace(/>/g, "&gt;") : 'No description provided.';
            const language = repo.language ? `<span>${repo.language}</span>` : '';

            card.innerHTML = `
                <div class="project-info">
                    <h3>${repo.name}</h3>
                    <p>${description}</p>
                    ${repo.language ? `<div class="project-tags">${language}</div>` : ''}
                    <div class="project-links">
                        <a href="${repo.html_url}" class="project-link" target="_blank">
                            <i class="fab fa-github"></i> GitHub Repo
                        </a>
                        ${repo.homepage ? `
                        <a href="${repo.homepage}" class="project-link" target="_blank">
                            <i class="fas fa-link"></i> Live Site
                        </a>` : ''}
                    </div>
                </div>
            `;
            projectsGrid.appendChild(card);
        });

        // *** Setup observer AFTER adding cards ***
        console.log("Setting up observer for new project cards.");
        setupFadeInObserver();

    } catch (error) {
        console.error('Failed to fetch GitHub projects:', error);
        // Ensure grid exists before modifying
        if(projectsGrid) {
             projectsGrid.innerHTML = '<p style="color: red;">Could not load projects from GitHub. Check console for errors.</p>';
        }
    }
}

// ===== Main Initialization =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Loaded. Initializing...");

    // Update copyright year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Fetch GitHub Projects
    fetchGitHubProjects('LovelaceOneAI');

    // Setup observer for any initial static .fade-in elements (if any)
    // Note: The dynamic ones are handled after the fetch completes.
    setupFadeInObserver(); 

    // Remove or implement other functions like fetchXPosts, updateGitHubStats if needed.
    // For now, they are commented out or removed to avoid conflicts.
    /*
    // Fetch X posts
    // fetchXPosts(); 
    
    // Update GitHub stats
    // updateGitHubStats();
    */
});

// Cleaned up / Removed old/duplicate listeners and unused functions 