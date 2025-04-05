document.addEventListener("DOMContentLoaded", function () {
    console.log("tech.js is running");

    // Prevent duplicate execution
    if (window.techJsHasRun) {
        console.warn("Tech script already executed. Stopping duplicate run.");
        return;
    }
    window.techJsHasRun = true;

    // Sample gadgets data - in a real implementation, this would be loaded from a JSON file
    const gadgets = [
        {
            id: 1,
            name: "Galaxy S26 Ultra",
            brand: "Samsung",
            price: "$1199.99",
            category: "smartphones",
            description: "The latest flagship smartphone with advanced AI capabilities and 200MP camera.",
            image: "images/galaxy-s26.jpg",
            rating: 4.8
        },
        {
            id: 2,
            name: "MacBook Pro M4",
            brand: "Apple",
            price: "$1999.99",
            category: "laptops",
            description: "Powerful laptop with the new M4 chip, offering unmatched performance and battery life.",
            image: "images/macbook-pro.jpg",
            rating: 4.9
        },
        {
            id: 3,
            name: "Smart Watch Series 9",
            brand: "Apple",
            price: "$399.99",
            category: "wearables",
            description: "Track your health metrics and stay connected with the latest smartwatch technology.",
            image: "images/smartwatch.jpg",
            rating: 4.7
        },
        {
            id: 4,
            name: "Noise-Cancelling Headphones",
            brand: "Sony",
            price: "$349.99",
            category: "audio",
            description: "Experience premium sound quality with industry-leading noise cancellation.",
            image: "images/headphones.jpg",
            rating: 4.8
        },
        {
            id: 5,
            name: "Gaming Console Pro",
            brand: "Microsoft",
            price: "$499.99",
            category: "gaming",
            description: "Next-gen gaming with 8K graphics and immersive gameplay experience.",
            image: "images/gaming-console.jpg",
            rating: 4.6
        },
        {
            id: 6,
            name: "Wireless Earbuds Pro",
            brand: "Apple",
            price: "$249.99",
            category: "audio",
            description: "Spatial audio and active noise cancellation in a compact, wireless design.",
            image: "images/earbuds.jpg",
            rating: 4.7
        },
        {
            id: 7,
            name: "Ultra-Thin Laptop",
            brand: "Dell",
            price: "$1299.99",
            category: "laptops",
            description: "Sleek, lightweight laptop with 4K display and all-day battery life.",
            image: "images/dell-laptop.jpg",
            rating: 4.5
        },
        {
            id: 8,
            name: "Smart Home Hub",
            brand: "Google",
            price: "$129.99",
            category: "accessories",
            description: "Control your entire smart home ecosystem with voice commands and intuitive touch controls.",
            image: "images/smart-home.jpg",
            rating: 4.4
        },
        {
            id: 9,
            name: "Fitness Tracker Pro",
            brand: "Fitbit",
            price: "$149.99",
            category: "wearables",
            description: "Advanced health metrics and workout tracking in a sleek, waterproof design.",
            image: "images/fitness-tracker.jpg",
            rating: 4.3
        },
        {
            id: 10,
            name: "Premium Smartphone",
            brand: "iPhone",
            price: "$1099.99",
            category: "smartphones",
            description: "The latest iPhone with revolutionary camera system and powerful A19 chip.",
            image: "images/iphone.jpg",
            rating: 4.8
        },
        {
            id: 11,
            name: "Wireless Charging Pad",
            brand: "Anker",
            price: "$39.99",
            category: "accessories",
            description: "Fast wireless charging for all compatible devices with sleek, minimal design.",
            image: "images/charging-pad.jpg",
            rating: 4.5
        },
        {
            id: 12,
            name: "VR Headset Pro",
            brand: "Meta",
            price: "$499.99",
            category: "gaming",
            description: "Immersive virtual reality experience with next-gen graphics and haptic feedback.",
            image: "images/vr-headset.jpg",
            rating: 4.6
        }
    ];

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

    // Initial display of all gadgets
    displayGadgets(gadgets);

    // Filter gadgets by category
    const categoryFilter = document.getElementById("category-filter");
    if (categoryFilter) {
        categoryFilter.addEventListener("change", filterGadgets);
    }

    // Search functionality
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    
    if (searchButton) {
        searchButton.addEventListener("click", filterGadgets);
    }
    
    if (searchInput) {
        searchInput.addEventListener("keyup", function(event) {
            if (event.key === "Enter") {
                filterGadgets();
            }
        });
    }

    function filterGadgets() {
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
