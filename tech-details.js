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

    // Load gadget data from JSON file
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
            
            // Display the gadget details
            displayGadgetDetails(gadget);
            
            // Display related gadgets (same category but not the current one)
            const relatedGadgets = gadgets.filter(g => 
                g.category === gadget.category && g.id !== gadget.id
            ).slice(0, 3); // Get up to 3 related gadgets
            
            displayRelatedGadgets(relatedGadgets);
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
                        <p>${generateExtendedDescription(gadget)}</p>
                    </div>
                    <div class="specifications">
                        <h3>Key Specifications</h3>
                        ${generateSpecifications(gadget)}
                    </div>
                    <div class="buttons">
                        <a href="#" class="btn buy-btn"><i class="fas fa-shopping-cart"></i> Buy Now</a>
                        <a href="#" class="btn wishlist-btn"><i class="fas fa-heart"></i> Add to Wishlist</a>
                    </div>
                </div>
            </div>
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

    // Generate extended description with more details about the gadget
    function generateExtendedDescription(gadget) {
        // This would ideally come from the JSON data, but for now we'll generate based on category
        const categoryDescriptions = {
            smartphones: `The ${gadget.name} represents the pinnacle of mobile technology from ${gadget.brand}. With cutting-edge processing power and an extraordinary camera system, it redefines what's possible in smartphone photography and performance. The device features a stunning display with vibrant colors and deep blacks, providing an immersive viewing experience whether you're streaming content, gaming, or browsing. Advanced AI capabilities enhance everything from battery optimization to photo processing, ensuring you get the most out of every interaction.`,
            
            laptops: `Designed for both productivity and creativity, the ${gadget.name} by ${gadget.brand} delivers exceptional performance for professionals and enthusiasts alike. Its stunning display offers true-to-life colors, making it perfect for creative work and content consumption. The keyboard provides a comfortable typing experience with precise key travel, while the trackpad offers smooth and accurate navigation. With its premium build quality and attention to detail, this laptop represents the best of what ${gadget.brand} has to offer in portable computing.`,
            
            wearables: `The ${gadget.name} from ${gadget.brand} is designed to seamlessly integrate into your active lifestyle. Beyond just tracking steps and workouts, it provides comprehensive health monitoring with features like heart rate variability, sleep analysis, and stress tracking. The device connects effortlessly with your smartphone to deliver notifications and app functionality right on your wrist. With an impressive battery life and water-resistant design, it's built to keep up with you through all your daily activities.`,
            
            audio: `Experience sound like never before with the ${gadget.name}. ${gadget.brand}'s signature audio engineering delivers crystal clear highs, rich mids, and deep, punchy bass that brings your music to life. The advanced noise cancellation technology creates a bubble of silence even in the noisiest environments, while the ambient sound mode lets you stay aware of your surroundings when needed. Comfortable to wear for extended periods and featuring intuitive controls, these are designed for the true audio enthusiast.`,
            
            gaming: `The ${gadget.name} is ${gadget.brand}'s latest innovation in gaming technology. Designed for serious gamers, it delivers breathtaking graphics capabilities and lightning-fast performance that can handle even the most demanding titles. The system features advanced cooling technology to maintain peak performance during intense gaming sessions, while the thoughtful design includes customizable elements to fit your personal gaming style. With support for the latest gaming standards and technologies, this system provides a truly next-generation experience.`,
            
            accessories: `The ${gadget.name} by ${gadget.brand} is designed to enhance your tech experience with thoughtful features and premium build quality. Seamlessly integrating with your existing devices, it adds convenience and functionality to your daily tech interactions. Made from high-quality materials, it combines durability with elegant design, making it both practical and aesthetically pleasing. ${gadget.brand}'s attention to detail ensures this accessory meets the high standards you expect from premium tech products.`
        };
        
        return categoryDescriptions[gadget.category] || 
               `The ${gadget.name} by ${gadget.brand} represents the best in ${gadget.category} technology, offering exceptional performance and value.`;
    }

    // Generate specifications based on gadget category
    function generateSpecifications(gadget) {
        // This would ideally come from the JSON data, but for now we'll generate based on category
        const categorySpecs = {
            smartphones: `
                <ul>
                    <li><strong>Display:</strong> 6.8" Dynamic AMOLED 2X, 120Hz</li>
                    <li><strong>Processor:</strong> Snapdragon 8 Gen 3</li>
                    <li><strong>RAM:</strong> 12GB</li>
                    <li><strong>Storage:</strong> 256GB/512GB/1TB</li>
                    <li><strong>Camera:</strong> 200MP main + 12MP ultrawide + 50MP telephoto</li>
                    <li><strong>Battery:</strong> 5000mAh with fast charging</li>
                    <li><strong>OS:</strong> Android 15</li>
                    <li><strong>Water Resistance:</strong> IP68</li>
                </ul>
            `,
            laptops: `
                <ul>
                    <li><strong>Display:</strong> 16" Liquid Retina XDR, 120Hz</li>
                    <li><strong>Processor:</strong> M4 Pro chip</li>
                    <li><strong>RAM:</strong> 32GB unified memory</li>
                    <li><strong>Storage:</strong> 1TB/2TB SSD</li>
                    <li><strong>Graphics:</strong> 20-core GPU</li>
                    <li><strong>Battery:</strong> Up to 20 hours</li>
                    <li><strong>Ports:</strong> Thunderbolt 4, HDMI, SD card slot</li>
                    <li><strong>Weight:</strong> 4.7 lbs (2.1 kg)</li>
                </ul>
            `,
            wearables: `
                <ul>
                    <li><strong>Display:</strong> 1.4" AMOLED, always-on</li>
                    <li><strong>Battery:</strong> Up to 7 days</li>
                    <li><strong>Sensors:</strong> Heart rate, SpO2, accelerometer, gyroscope</li>
                    <li><strong>Water Resistance:</strong> 5ATM</li>
                    <li><strong>Connectivity:</strong> Bluetooth 5.2, Wi-Fi</li>
                    <li><strong>Compatibility:</strong> iOS 14+, Android 10+</li>
                    <li><strong>GPS:</strong> Built-in with GLONASS</li>
                    <li><strong>Features:</strong> Sleep tracking, stress monitoring, 30+ sport modes</li>
                </ul>
            `,
            audio: `
                <ul>
                    <li><strong>Driver Size:</strong> 40mm dynamic</li>
                    <li><strong>Frequency Response:</strong> 20Hz-20kHz</li>
                    <li><strong>Noise Cancellation:</strong> Adaptive ANC</li>
                    <li><strong>Battery Life:</strong> Up to 30 hours with ANC</li>
                    <li><strong>Charging:</strong> USB-C with quick charge</li>
                    <li><strong>Connectivity:</strong> Bluetooth 5.2, 3.5mm jack</li>
                    <li><strong>Codecs:</strong> SBC, AAC, LDAC, aptX HD</li>
                    <li><strong>Weight:</strong> 254g</li>
                </ul>
            `,
            gaming: `
                <ul>
                    <li><strong>Processor:</strong> AMD Ryzen 9 / Intel Core i9</li>
                    <li><strong>Graphics:</strong> NVIDIA RTX 4090 / AMD RX 7900 XT</li>
                    <li><strong>RAM:</strong> 32GB DDR5</li>
                    <li><strong>Storage:</strong> 2TB NVMe SSD</li>
                    <li><strong>Display Support:</strong> 8K gaming, 4K at 120Hz</li>
                    <li><strong>Cooling:</strong> Liquid cooling system</li>
                    <li><strong>Ports:</strong> HDMI 2.1, DisplayPort 2.0, USB 3.2</li>
                    <li><strong>Power Supply:</strong> 850W 80+ Platinum</li>
                </ul>
            `,
            accessories: `
                <ul>
                    <li><strong>Compatibility:</strong> Universal with all modern devices</li>
                    <li><strong>Connectivity:</strong> Bluetooth 5.2 / Wi-Fi 6E</li>
                    <li><strong>Power Output:</strong> 15W charging</li>
                    <li><strong>Materials:</strong> Aluminum and tempered glass</li>
                    <li><strong>Dimensions:</strong> 4.7 × 4.7 × 0.3 inches</li>
                    <li><strong>Weight:</strong> 180g</li>
                    <li><strong>Certification:</strong> Qi-certified</li>
                    <li><strong>Features:</strong> LED indicators, foreign object detection</li>
                </ul>
            `
        };
        
        return categorySpecs[gadget.category] || `
            <ul>
                <li><strong>Brand:</strong> ${gadget.brand}</li>
                <li><strong>Category:</strong> ${gadget.category}</li>
                <li><strong>Rating:</strong> ${gadget.rating} out of 5</li>
            </ul>
        `;
    }
});
