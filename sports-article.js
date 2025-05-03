document.addEventListener("DOMContentLoaded", function () {
    // Get article ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get("id");

    // Article content container
    const articleContent = document.getElementById("article-content");

    if (!articleId) {
        articleContent.innerHTML = `
            <h1>Article Not Found</h1>
            <p>The article you're looking for could not be found.</p>
            <a href="sports.html" class="back-button"><i class="fas fa-arrow-left"></i> Back to Sports Articles</a>
        `;
        return;
    }

    // Fetch article data
    fetch("sports.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(articles => {
            const article = articles.find(a => a.id == articleId);
            
            if (article) {
                // Update the page title
                document.title = `${article.title} - SkvyCoders`;
                
                // Format the content, replacing newlines with paragraph breaks
                const formattedContent = article.content
                    .split('\n\n')
                    .map(paragraph => `<p>${paragraph}</p>`)
                    .join('');
                
                articleContent.innerHTML = `
                    <h1>${article.title}</h1>
                    
                    <div class="article-meta">
                        <span class="article-category">${article.category}</span>
                        <span class="article-date">Published on ${article.publishDate}</span>
                    </div>
                    
                    <img src="${article.image}" alt="${article.title}" onerror="this.src='images/fallback.jpg';">
                    
                    <div class="article-content">
                        ${formattedContent}
                    </div>
                    
                    <div class="share-buttons">
                        <h3>Share This Article</h3>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" target="_blank">
                            <i class="fab fa-facebook-square fa-2x" style="color: #3b5998;"></i>
                        </a>
                        <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}" target="_blank">
                            <i class="fab fa-twitter-square fa-2x" style="color: #1da1f2;"></i>
                        </a>
                        <a href="https://wa.me/?text=${encodeURIComponent(article.title + ' ' + window.location.href)}" target="_blank">
                            <i class="fab fa-whatsapp-square fa-2x" style="color: #25D366;"></i>
                        </a>
                        <a href="https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}" target="_blank">
                            <i class="fab fa-telegram fa-2x" style="color: #0088cc;"></i>
                        </a>
                    </div>
                    
                    <a href="sports.html" class="back-button"><i class="fas fa-arrow-left"></i> Back to Sports Articles</a>
                `;
            } else {
                articleContent.innerHTML = `
                    <h1>Article Not Found</h1>
                    <p>The article you're looking for could not be found.</p>
                    <a href="sports.html" class="back-button"><i class="fas fa-arrow-left"></i> Back to Sports Articles</a>
                `;
            }
        })
        .catch(error => {
            console.error("Error loading article:", error);
            articleContent.innerHTML = `
                <h1>Error Loading Article</h1>
                <p>There was a problem loading this article. Please try again later.</p>
                <a href="sports.html" class="back-button"><i class="fas fa-arrow-left"></i> Back to Sports Articles</a>
            `;
        });
});
