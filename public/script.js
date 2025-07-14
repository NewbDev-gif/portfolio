// This event listener ensures your code runs after the HTML is fully loaded.
document.addEventListener('DOMContentLoaded', () => {

    // --- YOUR EXISTING JAVASCRIPT (for cursor, nav, etc.) ---
    // I'm adding placeholder code. Keep your original code for these features.
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");
    window.addEventListener("mousemove", function (e) {
        const posX = e.clientX;
        const posY = e.clientY;
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });
    // --- End of your existing JS ---


    // --- NEW BACKEND-CONNECTED CODE ---
    
    const backendUrl = ''; // Our server's URL

    // --- 1. DYNAMICALLY LOAD PROJECTS ---
    async function loadProjects() {
        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid) return; // Exit if the grid isn't on the page

        try {
            const response = await fetch(`${backendUrl}/api/projects`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const projects = await response.json();

            projectsGrid.innerHTML = ''; // Clear any loading text

            projects.forEach(project => {
                // Create the project card HTML using the data from the backend
                const projectCardHTML = `
                    <a href="${project.link}" target="_blank" class="project-card">
                        <div class="card-border"></div>
                        <div class="card-background" style="background-image: url('${project.imageUrl}');"></div>
                        <div class="card-overlay">
                            <h4>${project.title}</h4>
                            <p>${project.description}</p>
                        </div>
                    </a>
                `;
                // Add the new card to the grid
                projectsGrid.insertAdjacentHTML('beforeend', projectCardHTML);
            });

        } catch (error) {
            console.error('Failed to load projects:', error);
            projectsGrid.innerHTML = '<p style="color: #ff4d4d;">[ ERROR: Failed to load project data from server. ]</p>';
        }
    }

    // --- 2. HANDLE CONTACT FORM SUBMISSION ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Stop the form from reloading the page

            const submitButton = contactForm.querySelector('.submit-btn');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Transmitting...';
            submitButton.disabled = true;

            // Collect form data into a simple object
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`${backendUrl}/api/contact`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (response.ok) {
                    alert(`Success: ${result.message}`);
                    contactForm.reset(); // Clear the form fields
                } else {
                    throw new Error(result.message || 'An unknown error occurred.');
                }

            } catch (error) {
                console.error('Contact form submission error:', error);
                alert(`Error: ${error.message}`);
            } finally {
                // Restore the button state whether the submission succeeded or failed
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }

    // --- INITIALIZE EVERYTHING ---
    loadProjects(); // Call the function to load projects as soon as the page is ready

});