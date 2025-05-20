document.addEventListener("DOMContentLoaded", function () {
    console.log("applications.js is running");

    // Prevent duplicate execution
    if (window.hasRun) {
        console.warn("Script already executed. Stopping duplicate run.");
        return;
    }
    window.hasRun = true;

    fetch("applications.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(guides => {
            let applicationsContainer = document.getElementById("applications-container");
            if (!applicationsContainer) {
                console.error("applications-container not found");
                return;
            }

            console.log("Application guides fetched:", guides);

            // Sort guides by last updated date (newest first)
            guides.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));

            applicationsContainer.innerHTML = ""; // Clear previous content
            guides.forEach(guide => {
                let applicationBox = document.createElement("div");
                applicationBox.classList.add("application-box");
                
                // Format the date to be more readable
                const updateDate = new Date(guide.lastUpdated);
                const formattedDate = updateDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                applicationBox.innerHTML = `
                    <img src="${guide.coverImage}" alt="${guide.title}" onerror="this.src='images/fallback.jpg';">
                    <div class="application-content">
                        <span class="application-category">${guide.category}</span>
                        <h3>${guide.title}</h3>
                        <p>${guide.description}</p>
                        <p class="steps-count"><strong>Steps:</strong> ${guide.steps.length}</p>
                        <a href="application-guide.html?id=${guide.id}">View Guide</a>
                    </div>
                `;
                applicationsContainer.appendChild(applicationBox);
            });
        })
        .catch(error => {
            console.error("Error fetching application guides:", error);
            let applicationsContainer = document.getElementById("applications-container");
            if (applicationsContainer) {
                applicationsContainer.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Unable to load application guides. Please try again later.</p>
                    </div>
                `;
            }
        });
});
