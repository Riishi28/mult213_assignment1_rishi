const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");

// search function (endpoint 1)
searchBtn.addEventListener("click", async () => {
    const query = searchInput.value.trim();
    if (!query) return;

    resultsDiv.innerHTML = "Loading...";

    try {
        const response = await fetch(
            `https://api.discogs.com/database/search?q=${query}&token=${DISCOGS_TOKEN}`
        );
        const data = await response.json();

        resultsDiv.innerHTML = "";

        data.results.forEach(item => {
            //"View Details" for artists
            const isArtist = item.type === "artist";

            const div = document.createElement("div");
            div.className = "result-item";

            div.innerHTML = `
                <img src="${item.thumb || ''}" alt="">
                <div>
                    <strong>${item.title}</strong><br>
                    Type: ${item.type || "Unknown"}<br>
                    Year: ${item.year || "N/A"}<br>
                    ${
                        isArtist
                            ? `<button class="detailsBtn" data-id="${item.id}">View Artist Details</button>`
                            : ""
                    }
                </div>
            `;

            resultsDiv.appendChild(div);
        });

         
        document.querySelectorAll(".detailsBtn").forEach(btn => {
            btn.addEventListener("click", () => loadDetails(btn.dataset.id));
        });

    } catch (error) {
        resultsDiv.innerHTML = "Error fetching data.";
    }
});


// detail finction (endpoint 2)
async function loadDetails(artistId) {
    if (!artistId) {
        alert("No details available.");
        return;
    }

    resultsDiv.innerHTML = "Loading details...";

    try {
        const response = await fetch(
            `https://api.discogs.com/artists/${artistId}?token=${DISCOGS_TOKEN}`
        );
        const data = await response.json();

        resultsDiv.innerHTML = `
            <div class="details-box">
                <h2>${data.name}</h2>

                <p><strong>Description:</strong><br>
                ${data.profile || "No description available."}</p>

                <p><strong>Aliases:</strong> 
                ${
                    data.aliases
                        ? data.aliases.map(a => a.name).join(", ")
                        : "None"
                }</p>

                <p><strong>URLs:</strong><br>
                ${
                    data.urls
                        ? data.urls.map(url => `<a href="${url}" target="_blank">${url}</a>`).join("<br>")
                        : "N/A"
                }</p>

                <button id="backBtn">Back to results</button>
            </div>
        `;

        document.getElementById("backBtn").addEventListener("click", () => {
            searchBtn.click();
        });

    } catch (error) {
        resultsDiv.innerHTML = "Unable to load details.";
    }
}
