document.addEventListener("DOMContentLoaded", function () {
    // Get job ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get("id");

    if (!jobId) {
        document.getElementById("job-content").innerHTML = "<p>Job not found.</p>";
        return;
    }

    // Fetch job data
    fetch("jobs.json")
        .then(response => response.json())
        .then(jobs => {
            const job = jobs.find(j => j.id == jobId);
            if (job) {
                document.getElementById("job-content").innerHTML = `
                    <h1>Job Title</h1>
                    <h3>${job.title}</h3>

                    <h1>Company</h1>
                    <h3>${job.company}</h3>

                    <img src="${job.image}" alt="${job.company}" onerror="this.src='images/fallback.jpg';">

                    <h1>Job Description</h1>
                    <p>${job.fullDescription.replace(/\n/g, '<br>')}</p>

                    <a href="${job.applyLink}" class="apply-button" target="_blank">Apply Now</a>
                `;
            } else {
                document.getElementById("job-content").innerHTML = "<p>Job not found.</p>";
            }
        })
        .catch(error => {
            console.error("Error loading job details:", error);
            document.getElementById("job-content").innerHTML = "<p>Error loading job details. Try again later.</p>";
        });
});
