const form = document.getElementById("characterForm");
const nameInput = document.getElementById("name");
const speciesSelect = document.getElementById("species");
const results = document.getElementById("results");
const message = document.getElementById("message");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = nameInput.value.trim();
    const species = speciesSelect.value;

    results.innerHTML = "";
    message.textContent = "";

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
        message.textContent = "Loading...";

        const response = await fetch(url);

        if (!response.ok) {
            message.textContent = "";
            results.innerHTML = '<p class="no-results">No characters found.</p>'
            return;
        }

        const data = await response.json();
        message.textContent = `Found ${data.results.length} result(s)!`;

        data.results.forEach(character => {

            const statusColor =
                character.status === "Alive" ? "limegreen" :
                    character.status === "Dead" ? "red" : "#93c5fd";

            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
        <img src="${character.image}" alt="${character.name}">
        <div class="card-content">
          <h3>${character.name}</h3>
          <p><strong>Status:</strong> 
          <span style="color:${statusColor}">${character.status}</span>
          </p>
          <p><strong>Species:</strong> ${character.species}</p>
          <p><strong>Origin:</strong> ${character.origin.name}</p>
          </div>
          `;

            results.appendChild(card);
        });

    } catch (err) {
        message.textContent = "";
        results.innerHTML = `<p class="no-results">${err.message}</p>`;
    }
});
