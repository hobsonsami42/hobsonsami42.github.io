let isUsernameAvailable = false;

document.querySelector("#zip").addEventListener("change", displayCity);
document.querySelector("#state").addEventListener("change", displayCounties);
document.querySelector("#username").addEventListener("change", checkUsername);
document.querySelector("#password").addEventListener("click", suggestPassword);
document.querySelector("#signupForm").addEventListener("submit", validateForm);

//rubric hint: Load states directly, no event listener needed

void loadStates();

async function displayCity() {
    const zipCode = document.querySelector("#zip").value.trim();
    const city = document.querySelector("#city");
    const latitude = document.querySelector("#latitude");
    const longitude = document.querySelector("#longitude");
    const zipError = document.querySelector("#zipError");

    city.textContent = "";
    latitude.textContent = "";
    longitude.textContent = "";
    zipError.textContent = "";

    if (zipCode === "") {
        return;
    }

    const url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log("ZIP API data:", data);

        if (!data || data === false) {
            zipError.textContent = "Zip code not found";
            zipError.className = "mt-1 fw-bold text-danger";
            return;
        }

        city.textContent = data.city;
        latitude.textContent = data.latitude;
        longitude.textContent = data.longitude;
    } catch (error) {
        console.error("ZIP API error:", error);
        zipError.textContent = "Unable to fetch zip code info";
        zipError.className = "mt-1 fw-bold text-danger";
    }
}

async function displayCounties() {
    const state = document.querySelector("#state").value;
    const countyList = document.querySelector("#county");

    countyList.innerHTML = '<option value="">Loading counties...</option>';

    if (state === "") {
        countyList.innerHTML = '<option value="">Select a state first</option>';
        return;
    }

    const url = `https://csumb.space/api/countyListAPI.php?state=${state}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        countyList.innerHTML = '<option value="">Select One</option>';

        for (let i = 0; i < data.length; i++) {
            countyList.innerHTML += `<option>${data[i].county}</option>`;
        }
    } catch (error) {
        countyList.innerHTML = '<option value="">Could not load counties</option>';
    }
}

async function checkUsername() {
    const username = document.querySelector("#username").value.trim();
    const usernameError = document.querySelector("#usernameError");

    usernameError.textContent = "";
    isUsernameAvailable = false;

    if (username === "") {
        return;
    }

    const url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data["available"]) {
            usernameError.textContent = "Username is available";
            usernameError.className = "mt-1 fw-bold text-success";
            isUsernameAvailable = true;
        } else {
            usernameError.textContent = "Username is unavailable";
            usernameError.className = "mt-1 fw-bold text-danger";
            isUsernameAvailable = false;
        }
    } catch (error) {
        usernameError.textContent = "Could not check username";
        usernameError.className = "mt-1 fw-bold text-danger";
        isUsernameAvailable = false;
    }
}

async function suggestPassword() {
    const suggestedPwd = document.querySelector("#suggestedPwd");

    try {
        const response = await fetch("https://csumb.space/api/suggestedPassword.php?length=8");
        const data = await response.json();

        suggestedPwd.textContent = `Suggested password: ${data.password}`;
    } catch (error) {
        suggestedPwd.textContent = "Could not get suggested password";
    }
}

async function loadStates() {
    const stateMenu = document.querySelector("#state");

    try {
        const response = await fetch("https://csumb.space/api/allStatesAPI.php");
        const data = await response.json();

        stateMenu.innerHTML = '<option value="">Select One</option>';

        for (let i = 0; i < data.length; i++) {
            stateMenu.innerHTML += `<option value="${data[i]["usps"]}">${data[i].state}</option>`;
        }
    } catch (error) {
        stateMenu.innerHTML = '<option value="">Could not load states</option>';
    }
}

function validateForm(e) {
    let valid = true;
    const password = document.querySelector("#password").value;
    const passwordAgain = document.querySelector("#passwordAgain").value;
    const username = document.querySelector("#username").value.trim();
    const passwordError = document.querySelector("#passwordError");
    const usernameError = document.querySelector("#usernameError");

    passwordError.textContent = "";

    if (username === "") {
        usernameError.textContent = "Username is required";
        usernameError.className = "mt-1 fw-bold text-danger";
        valid = false;
    } else if (!isUsernameAvailable) {
        usernameError.textContent = "Username must be available";
        usernameError.className = "mt-1 fw-bold text-danger";
        valid = false;
    }

    if (password.length < 6) {
        passwordError.textContent = "Password must be at least 6 characters";
        valid = false;
    } else if (password !== passwordAgain) {
        passwordError.textContent = "Passwords do not match";
        valid = false;
    }

    if (!valid) {
        e.preventDefault();
    }
}