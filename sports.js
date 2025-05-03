document.addEventListener("DOMContentLoaded", function () {
    console.log("sports.js is running");

    // Prevent duplicate execution
    if (window.hasRun) {
        console.warn("Script already executed. Stopping duplicate run.");
        return;
    }
    window.hasRun = true;

    fetch("sports.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(articles => {
            let sportsContainer = document.getElementById("sports-container");
            if (!sportsContainer) {
                console.error("sports-container not found");
                return;
            }

            console.log("Sports articles fetched:", articles);

            // Sort articles by publication date (newest first)
            articles.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));

            sportsContainer.innerHTML = ""; // Clear previous content
            articles.forEach(article => {
                let articleBox = document.createElement("div");
                articleBox.classList.add("article-box");
                articleBox.innerHTML = `
                    <img src="${article.image}" alt="${article.title}" onerror="this.src='images/fallback.jpg';">
                    <h3>${article.title}</h3>
                    <p class="category"><span class="sport-category">${article.category}</span></p>
                    <p>${article.summary}</p>
                    <p><strong>Published:</strong> ${article.publishDate}</p>
                    <a href="sports-article.html?id=${article.id}">Read More</a>
                `;
                sportsContainer.appendChild(articleBox);
            });
        })
        .catch(error => {
            console.error("Error fetching sports articles:", error);
            let sportsContainer = document.getElementById("sports-container");
            if (sportsContainer) {
                sportsContainer.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Unable to load sports articles. Please try again later.</p>
                    </div>
                `;
            }
        });
});
