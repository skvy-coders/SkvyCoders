document.addEventListener("DOMContentLoaded", function () {
    // Get guide ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const guideId = urlParams.get("id");

    // Guide content container
    const guideContent = document.getElementById("guide-content");

    if (!guideId) {
        guideContent.innerHTML = `
            <h1>Guide Not Found</h1>
            <p>The application guide you're looking for could not be found.</p>
            <a href="applications.html" class="back-button"><i class="fas fa-arrow-left"></i> Back to Application Guides</a>
        `;
        return;
    }

    // Fetch guide data
    fetch("applications.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(guides => {
            const guide = guides.find(g => g.id == guideId);
            
            if (guide) {
                // Update the page title
                document.title = `${guide.title} - SkvyCoders`;
                
                // Format the date to be more readable
                const updateDate = new Date(guide.lastUpdated);
                const formattedDate = updateDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                // Create the header section
                let headerHTML = `
                    <div class="application-header">
                        <h2>${guide.title}</h2>
                        <div class="meta-info">
                            <span class="category-badge">${guide.category}</span>
                            <span class="update-date">Last Updated: ${formattedDate}</span>
                        </div>
                        <p>${guide.description}</p>
                    </div>
                `;
                
                // Create the steps sections
                let stepsHTML = '';
                guide.steps.forEach((step, index) => {
                    stepsHTML += `
                        <div class="step-container">
                            <h3>Step ${index + 1}: ${step.title}</h3>
                            <div class="step-content">
                                <div class="step-image">
                                    <img src="${step.image}" alt="Step ${index + 1}: ${step.title}" onerror="this.src='images/fallback.jpg';">
                                </div>
                                <div class="step-description">
                                    ${step.description}
                                </div>
                            </div>
                        </div>
                    `;
                });
                
                // Create share buttons section
                let shareHTML = `
                    <div class="share-buttons">
                        <h3>Share This Guide</h3>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" target="_blank">
                            <i class="fab fa-facebook-square fa-2x" style="color: #3b5998;"></i>
                        </a>
                        <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(guide.title)}" target="_blank">
                            <i class="fab fa-twitter-square fa-2x" style="color: #1da1f2;"></i>
                        </a>
                        <a href="https://wa.me/?text=${encodeURIComponent(guide.title + ' ' + window.location.href)}" target="_blank">
                            <i class="fab fa-whatsapp-square fa-2x" style="color: #25D366;"></i>
                        </a>
                        <a href="https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(guide.title)}" target="_blank">
                            <i class="fab fa-telegram fa-2x" style="color: #0088cc;"></i>
                        </a>
                    </div>
                `;
                
                // Put it all together
                guideContent.innerHTML = `
                    ${headerHTML}
                    ${stepsHTML}
                    ${shareHTML}
                    <a href="applications.html" class="back-button"><i class="fas fa-arrow-left"></i> Back to Application Guides</a>
                `;
            } else {
                guideContent.innerHTML = `
                    <h1>Guide Not Found</h1>
                    <p>The application guide you're looking for could not be found.</p>
                    <a href="applications.html" class="back-button"><i class="fas fa-arrow-left"></i> Back to Application Guides</a>
                `;
            }
        })
        .catch(error => {
            console.error("Error loading guide:", error);
            guideContent.innerHTML = `
                <h1>Error Loading Guide</h1>
                <p>There was a problem loading this guide. Please try again later.</p>
                <a href="applications.html" class="back-button"><i class="fas fa-arrow-left"></i> Back to Application Guides</a>
            `;
        });
});
