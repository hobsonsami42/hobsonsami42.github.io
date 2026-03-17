const form = document.getElementById("characterForm");
const nameInput = document.getElementById("name");
const speciesSelect = document.getElementById("species");
const results = document.getElementById("results");
const message = document.getElementById("message");
const clearBtn = document.getElementById("clearBtn");
const searchSummary = document.getElementById("searchSummary");
const featuredCharacter = document.getElementById("featuredCharacter");
const resultsHeading = document.getElementById("resultsHeading");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = nameInput.value.trim();
    const species = speciesSelect.value;

    results.innerHTML = "";
    message.textContent = "";
    featuredCharacter.innerHTML = "";
    resultsHeading.style.display = "none";
    searchSummary.textContent = "";

    if (name === "") {
        message.textContent = "Please enter a name.";
        return;
    }

    if (name.length < 2) {
        message.textContent = "Name must be at least 2 characters.";
        return;
    }

    let url = `https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(name)}`;

    if (species !== "") {
        url += `&species=${encodeURIComponent(species)}`;
    }


    try {
        message.textContent = "Scanning the multiverse...";

        const response = await fetch(url);

        if (!response.ok) {
            message.textContent = "";
            results.innerHTML = '<p class="no-results">No characters found. Try Rick, Morty, Summer, Beth, or Jerry!</p>'
            return;
        }

        const data = await response.json();
        message.textContent = `Found ${data.results.length} result(s)!`;

        searchSummary.textContent = `Search term: ${name} | Filter: ${species || "Any Species"} | ${data.results.length} character(s) found`;

        resultsHeading.style.display = "block";

        const firstCharacter = data.results[0];
        const remainingCharacters = data.results.slice(1);

        const featuredStatusColor =
            firstCharacter.status === "Alive" ? "limegreen" :
                firstCharacter.status === "Dead" ? "red" : "#93c5fd";

        featuredCharacter.innerHTML = `
    <div class="featured-card">
        <img src="${firstCharacter.image}" alt="${firstCharacter.name}">
        <div class="featured-content">
            <p class="featured-label">Featured Character</p>
            <h3>${firstCharacter.name}</h3>
            <p><strong>Status:</strong>
                <span style="color:${featuredStatusColor}; font-weight:600;">${firstCharacter.status}</span>
            </p>
            <p><strong>Species:</strong> ${firstCharacter.species}</p>
            <p><strong>Gender:</strong> ${firstCharacter.gender}</p>
            <p><strong>Origin:</strong> ${firstCharacter.origin.name}</p>
            <p><strong>Location:</strong> ${firstCharacter.location.name}</p>
        </div>
    </div>
`;

        remainingCharacters.forEach(character => {


            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <img src="${character.image}" alt="${character.name}">
                <div class="card-content">
                    <h3>${character.name}</h3>
                    <p><strong>Status:</strong> <span class="status-pill ${character.status.toLowerCase()}">${character.status}</span></p>
                    <p><strong>Species:</strong> ${character.species}</p>
                    <p><strong>Gender:</strong> ${character.gender}</p>
                    <p><strong>Origin:</strong> ${character.origin.name}</p>
                    <p><strong>Location:</strong> ${character.location.name}</p>
                </div>
        `;


            results.appendChild(card);
        });

    } catch (err) {
        message.textContent = "";
        results.innerHTML = `<p class="no-results">${err.message}</p>`;
    }
});

clearBtn.addEventListener("click", function () {
    nameInput.value = "";
    speciesSelect.value = "";
    message.textContent = "";
    results.innerHTML = "";
    searchSummary.textContent = "";
    featuredCharacter.innerHTML = "";
    resultsHeading.style.display = "none";
});