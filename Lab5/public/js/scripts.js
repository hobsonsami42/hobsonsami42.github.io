let links = document.querySelectorAll(".author-link");

for (let link of links) {
    link.addEventListener("click", getAuthorInfo);
}

async function getAuthorInfo(e) {
    e.preventDefault();

    let myModal = new bootstrap.Modal(document.getElementById("authorModal"));
    myModal.show();

    let url = `/api/author/${this.id}`;
    let response = await fetch(url);
    let data = await response.json();

    let author = data[0];

    document.querySelector("#authorInfo").innerHTML = `
    <div class="text-center">
      <h2>${author.firstName} ${author.lastName}</h2>
      <img src="${author.portrait}" alt="Author portrait" width="200" class="img-fluid rounded mb-3">
    </div>

    <p><strong>Profession:</strong> ${author.profession}</p>
    <p><strong>Country:</strong> ${author.country}</p>
    <p><strong>Sex:</strong> ${author.sex}</p>
    <p><strong>Date of Birth:</strong> ${formatDate(author.dob)}</p>
    <p><strong>Date of Death:</strong> ${formatDate(author.dod)}</p>
    <p><strong>Biography:</strong> ${author.biography}</p>
  `;
}

function formatDate(dateString) {
    if (!dateString) return "N/A";
    let d = new Date(dateString);
    return d.toLocaleDateString();
}