document.addEventListener("DOMContentLoaded", function () {
    console.log("tech-details.js is running");

    // Prevent duplicate execution
    if (window.techDetailsJsHasRun) {
        console.warn("Tech details script already executed. Stopping duplicate run.");
        return;
    }
    window.techDetailsJsHasRun = true;

    // Get the gadget ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const gadgetId = parseInt(urlParams.get('id'));

    if (!gadgetId) {
        displayError("Invalid gadget ID. Please try again.");
        return;
    }

    // Show loading state
    const detailsContainer = document.getElementById("gadget-details");
    if (detailsContainer) {
        detailsContainer.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading gadget details...</p>
            </div>
        `;
    }

    // Load basic gadget data from JSON file
    fetch('gadgets.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(gadgets => {
            // Find the specific gadget
            const gadget = gadgets.find(g => g.id === gadgetId);
            
            if (!gadget) {
                throw new Error('Gadget not found');
            }
            
            // Now load the detailed description for this gadget
            return fetch('gadget-description.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to load gadget descriptions');
                    }
                    return response.json();
                })
                .then(descriptions => {
                    // Find the description for this specific gadget
                    const gadgetDetails = descriptions.find(d => d.id === gadgetId);
                    
                    if (!gadgetDetails) {
                        console.warn(`No detailed description found for gadget ID ${gadgetId}, using basic info only`);
                        displayGadgetDetails(gadget);
                    } else {
                        // Merge the basic gadget info with the detailed description
                        const completeGadget = { ...gadget, ...gadgetDetails };
                        displayGadgetDetails(completeGadget);
                    }
                    
                    // Display related gadgets (same category but not the current one)
                    const relatedGadgets = gadgets.filter(g => 
                        g.category === gadget.category && g.id !== gadget.id
                    ).slice(0, 3); // Get up to 3 related gadgets
                    
                    displayRelatedGadgets(relatedGadgets);
                });
        })
        .catch(error => {
            console.error('Error loading gadget details:', error);
            displayError("Failed to load gadget details. Please try again later.");
        });

    function displayGadgetDetails(gadget) {
        const detailsContainer = document.getElementById("gadget-details");
        if (!detailsContainer) return;

        // Generate star rating HTML
        let ratingHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(gadget.rating)) {
                ratingHTML += '<i class="fas fa-star"></i>';
            } else if (i - 0.5 <= gadget.rating) {
                ratingHTML += '<i class="fas fa-star-half-alt"></i>';
            } else {
                ratingHTML += '<i class="far fa-star"></i>';
            }
        }

        // Set page title
        document.title = `${gadget.name} - SkvyCoders`;

        // Generate the details HTML
        detailsContainer.innerHTML = `
            <div class="gadget-details-container">
                <div class="gadget-image">
                    <img src="${gadget.image}" alt="${gadget.name}" onerror="this.src='images/fallback.jpg';">
                </div>
                <div class="gadget-info">
                    <h1>${gadget.name}</h1>
                    <div class="gadget-meta">
                        <span class="brand"><i class="fas fa-tag"></i> ${gadget.brand}</span>
                        <span class="category"><i class="fas fa-layer-group"></i> ${gadget.category.charAt(0).toUpperCase() + gadget.category.slice(1)}</span>
                        <div class="rating">${ratingHTML} <span>(${gadget.rating})</span></div>
                    </div>
                    <div class="price">${gadget.price}</div>
                    <div class="description">
                        <h3>Description</h3>
                        <p>${gadget.description}</p>
                        ${gadget.extendedDescription ? `<p>${gadget.extendedDescription}</p>` : ''}
                    </div>
                    <div class="specifications">
                        <h3>Key Specifications</h3>
                        ${displaySpecifications(gadget)}
                    </div>
                    <div class="buttons">
                        <a href="#" class="btn buy-btn"><i class="fas fa-shopping-cart"></i> Buy Now</a>
                        <a href="#" class="btn wishlist-btn"><i class="fas fa-heart"></i> Add to Wishlist</a>
                    </div>
                </div>
            </div>
        `;
    }

    function displaySpecifications(gadget) {
        // Use specifications from gadget-description.json if available, otherwise display basic info
        if (gadget.specifications && Array.isArray(gadget.specifications)) {
            let specsHTML = '<ul>';
            gadget.specifications.forEach(spec => {
                specsHTML += `<li><strong>${spec.name}:</strong> ${spec.value}</li>`;
            });
            specsHTML += '</ul>';
            return specsHTML;
        }
        
        // Fallback to display basic info if specifications are not available
        return `
            <ul>
                <li><strong>Brand:</strong> ${gadget.brand}</li>
                <li><strong>Category:</strong> ${gadget.category}</li>
                <li><strong>Rating:</strong> ${gadget.rating} out of 5</li>
            </ul>
        `;
    }

    function displayRelatedGadgets(relatedGadgets) {
        const relatedContainer = document.getElementById("related-gadgets");
        if (!relatedContainer) return;

        if (relatedGadgets.length === 0) {
            relatedContainer.innerHTML = "<p>No related gadgets found.</p>";
            return;
        }

        let html = '<h2>Related Gadgets</h2><div class="related-gadgets-container">';
        
        relatedGadgets.forEach(gadget => {
            // Generate star rating HTML
            let ratingHTML = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= Math.floor(gadget.rating)) {
                    ratingHTML += '<i class="fas fa-star"></i>';
                } else if (i - 0.5 <= gadget.rating) {
                    ratingHTML += '<i class="far fa-star"></i>';
                }
            }
            
            html += `
                <div class="related-gadget-card">
                    <img src="${gadget.image}" alt="${gadget.name}" onerror="this.src='images/fallback.jpg';">
                    <h3>${gadget.name}</h3>
                    <div class="price">${gadget.price}</div>
                    <div class="rating">${ratingHTML}</div>
                    <a href="tech-details.html?id=${gadget.id}">View Details</a>
                </div>
            `;
        });
        
        html += '</div>';
        relatedContainer.innerHTML = html;
    }

    function displayError(message) {
        const detailsContainer = document.getElementById("gadget-details");
        if (detailsContainer) {
            detailsContainer.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>${message}</p>
                    <a href="tech.html" class="btn">Return to Gadgets</a>
                </div>
            `;
        }
    }
});
