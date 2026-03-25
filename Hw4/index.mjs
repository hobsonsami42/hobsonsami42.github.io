import express from "express";
import { faker } from "@faker-js/faker";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

const cityData = {
    "Los Angeles": { latitude: 34.0522, longitude: -118.2437 },
    "San Francisco": { latitude: 37.7749, longitude: -122.4194 },
    "San Diego": { latitude: 32.7157, longitude: -117.1611 },
    "Sacramento": { latitude: 38.5816, longitude: -121.4944 },
    "Fresno": { latitude: 36.7378, longitude: -119.7871 }
};

const roleOptions = [
    "AI Engineer",
    "Machine Learning Engineer",
    "Data Scientist",
    "Software Developer",
    "AI Research Assistant",
    "Prompt Engineer",
    "Cloud AI Developer"
];

function getFakeProfessionals(role, count) {
    return Array.from({ length: count }, () => ({
        name: faker.person.fullName(),
        role: role === "Any" ? faker.helpers.arrayElement(roleOptions) : role,
        email: faker.internet.email(),
        city: faker.location.city(),
        company: faker.company.name()
    }));
}

async function getWeatherData(cityName) {
    const selectedCity = cityData[cityName] || cityData["Los Angeles"];

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.latitude}&longitude=${selectedCity.longitude}&current=temperature_2m,wind_speed_10m`;

    const response = await fetch(url);
    const data = await response.json();

    return {
        city: cityName in cityData ? cityName : "Los Angeles",
        temperature: data.current.temperature_2m,
        windSpeed: data.current.wind_speed_10m
    };
}

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/machine-learning", (req, res) => {
    res.render("machine-learning");
});

app.get("/neural-networks", (req, res) => {
    res.render("neural-networks");
});

app.get("/ai-ethics", (req, res) => {
    res.render("ai-ethics");
});

app.get("/ai-careers", (req, res) => {
    const selectedRole = req.query.role || "Any";
    const selectedCount = parseInt(req.query.count) || 1;

    const safeCount = Math.min(Math.max(selectedCount, 1), 10);
    const professionals = getFakeProfessionals(selectedRole, safeCount);

    res.render("ai-careers", {
        professionals,
        roleOptions,
        selectedRole,
        selectedCount: safeCount
    });
});

app.get("/ai-trends", async (req, res) => {
    const selectedCity = req.query.city || "Los Angeles";

    try {
        const weather = await getWeatherData(selectedCity);
        res.render("ai-trends", {
            weather,
            error: null,
            cities: Object.keys(cityData),
            selectedCity: weather.city
        });
    } catch (err) {
        res.render("ai-trends", {
            weather: null,
            error: "Sorry, live API data could not be loaded right now.",
            cities: Object.keys(cityData),
            selectedCity
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});