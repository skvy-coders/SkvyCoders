document.addEventListener("DOMContentLoaded", function () {
    console.log("jobs.js is running");

    // Prevent duplicate execution
    if (window.hasRun) {
        console.warn("Script already executed. Stopping duplicate run.");
        return;
    }
    window.hasRun = true;

    fetch("jobs.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(jobs => {
            let jobContainer = document.getElementById("jobs-container");
            if (!jobContainer) {
                console.error("jobs-container not found");
                return;
            }

            console.log("Jobs fetched:", jobs);

            // Sort jobs by posting date (newest first)
            jobs.sort((a, b) => new Date(b.postingDate) - new Date(a.postingDate));

            jobContainer.innerHTML = ""; // Clear previous content
            jobs.forEach(job => {
                let jobBox = document.createElement("div");
                jobBox.classList.add("job-box");
                jobBox.innerHTML = `
                    <img src="${job.image}" alt="${job.company}" onerror="this.src='images/fallback.jpg';">
                    <h3>${job.company}</h3>
                    <p>${job.description}</p>
                    <p><strong>Posted On:</strong> ${job.postingDate}</p>
                    <a href="job-description.html?id=${job.id}">Know More</a>
                `;
                jobContainer.appendChild(jobBox);
            });
        })
        .catch(error => console.error("Error fetching jobs:", error));
});