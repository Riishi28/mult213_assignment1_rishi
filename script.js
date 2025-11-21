const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");

searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (!query) return;

    resultsDiv.innerHTML = "Loading...";

    fetch(`https://api.discogs.com/database/search?q=${query}&token=${DISCOGS_TOKEN}`)
        .then(response => response.json())
        .then(data => {
            resultsDiv.innerHTML = "";

            data.results.forEach(item => {
                const div = document.createElement("div");
                div.className = "result-item";

                div.innerHTML = `
                    <img src="${item.thumb || ''}" alt="">
                    <div>
                        <strong>${item.title}</strong><br>
                        Type: ${item.type || "Unknown"}<br>
                        Year: ${item.year || "N/A"}
                    </div>
                `;

                resultsDiv.appendChild(div);
            });
        })
        .catch(() => {
            resultsDiv.innerHTML = "Error fetching data.";
        });
});