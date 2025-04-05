document.addEventListener("DOMContentLoaded", function () {
    console.log("tech.js is running");

    // Prevent duplicate execution
    if (window.techJsHasRun) {
        console.warn("Tech script already executed. Stopping duplicate run.");
        return;
    }
    window.techJsHasRun = true;

    // Load gadgets data from JSON file
    fetch('gadgets.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(gadgets => {
            // Store gadgets data and initialize the page
            initializeGadgetsPage(gadgets);
        })
        .catch(error => {
            console.error('Error loading gadgets data:', error);
            document.getElementById("gadgets-container").innerHTML = 
                "<p class='error-message'>Failed to load gadgets data. Please try again later.</p>";
        });

    function initializeGadgetsPage(gadgets) {
        // Display all gadgets initially
        displayGadgets(gadgets);

        // Set up event listeners for filtering
        const categoryFilter = document.getElementById("category-filter");
        if (categoryFilter) {
            categoryFilter.addEventListener("change", () => filterGadgets(gadgets));
        }

        // Search functionality
        const searchInput = document.getElementById("search-input");
        const searchButton = document.getElementById("search-button");
        
        if (searchButton) {
            searchButton.addEventListener("click", () => filterGadgets(gadgets));
        }
        
        if (searchInput) {
            searchInput.addEventListener("keyup", function(event) {
                if (event.key === "Enter") {
                    filterGadgets(gadgets);
                }
            });
        }
    }

    function displayGadgets(gadgetsToDisplay) {
        let gadgetsContainer = document.getElementById("gadgets-container");
        if (!gadgetsContainer) {
            console.error("gadgets-container not found");
            return;
        }

        gadgetsContainer.innerHTML = ""; // Clear previous content

        if (gadgetsToDisplay.length === 0) {
            gadgetsContainer.innerHTML = "<p class='no-results'>No gadgets found matching your criteria.</p>";
            return;
        }

        gadgetsToDisplay.forEach(gadget => {
            let gadgetCard = document.createElement("div");
            gadgetCard.classList.add("gadget-card");
            
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
            
            gadgetCard.innerHTML = `
                <img src="${gadget.image}" alt="${gadget.name}" onerror="this.src='images/fallback.jpg';">
                <h3>${gadget.name}</h3>
                <p>${gadget.description}</p>
                <span class="category">${gadget.category.charAt(0).toUpperCase() + gadget.category.slice(1)}</span>
                <div class="rating">${ratingHTML} <span>(${gadget.rating})</span></div>
                <div class="price">${gadget.price}</div>
                <a href="tech-details.html?id=${gadget.id}">View Details</a>
            `;
            gadgetsContainer.appendChild(gadgetCard);
        });
    }

    function filterGadgets(gadgets) {
        const categoryFilter = document.getElementById("category-filter");
        const searchInput = document.getElementById("search-input");
        
        const selectedCategory = categoryFilter.value;
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        let filteredGadgets = gadgets;
        
        // Filter by category
        if (selectedCategory !== "all") {
            filteredGadgets = filteredGadgets.filter(gadget => gadget.category === selectedCategory);
        }
        
        // Filter by search term
        if (searchTerm !== "") {
            filteredGadgets = filteredGadgets.filter(gadget => 
                gadget.name.toLowerCase().includes(searchTerm) || 
                gadget.brand.toLowerCase().includes(searchTerm) || 
                gadget.description.toLowerCase().includes(searchTerm) ||
                gadget.category.toLowerCase().includes(searchTerm)
            );
        }
        
        displayGadgets(filteredGadgets);
    }
});
