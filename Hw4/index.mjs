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



async function getAdviceData() {
    const response = await fetch("https://api.adviceslip.com/advice");

    if(!response.ok) {
        return {
            advice: "Live API data is temporarily unavailable."
        };
    }

    const data = await response.json();

    return {
        advice: data.slip.advice
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
    try {
        const apiData = await getAdviceData();
        res.render("ai-trends", {
            apiData,
            error: null
        });
    } catch (err) {
        console.error("AI Trends route error:", err);
        res.render("ai-trends", {
            apiData: null,
            error: "Sorry, live API data could not be loaded right now.",
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});