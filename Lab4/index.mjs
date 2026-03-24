import express from 'express';
import fetch from 'node-fetch';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const planets = require('npm-solarsystem');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

const planetNames = [
    'Mercury',
    'Venus',
    'Earth',
    'Mars',
    'Jupiter',
    'Saturn',
    'Uranus',
    'Neptune'
];

const backgrounds = [
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa'
];

app.get('/', (req, res) => {
    const randomImage = backgrounds[Math.floor(Math.random() * backgrounds.length)];

    res.render('index', {
        title: 'Home',
        planetNames,
        backgroundImage: randomImage
    });
});

app.get('/planet', (req, res) => {
    const planetName = req.query.planetName;

    if (!planetName || !planetNames.includes(planetName)) {
        return res.status(404).send('Planet not found');
    }

    const functionName = `get${planetName}`;
    let planetInfo = planets[functionName]();

    if (planetName === 'Mars') {
        planetInfo.image = 'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg';
    }

    if (planetName === 'Jupiter') {
        planetInfo.image = 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg';
    }

    if (planetName === 'Uranus') {
        planetInfo.image = 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg';
    }

    res.render('planet', {
        title: planetName,
        planetNames,
        planetName,
        planetInfo,
        backgroundImage: null
    });
});


app.get('/nasa', async (req, res) => {
    try {
        const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=mrchcBLcyiVkPEjeOq4BM1GLIMNwMGSb7OL9NsFa&thumbs=true');        const data = await response.json();

        console.log('NASA API response:', data);

        // Handle NASA error responses cleanly
        if (!response.ok || data.error || data.code || data.msg) {
            return res.render('nasa', {
                title: 'NASA Picture of the Day',
                planetNames,
                podTitle: 'NASA APOD temporarily unavailable',
                podExplanation: data.msg || data.error?.message || 'The NASA API did not return today’s APOD data.',
                podImage: null,
                podVideo: null,
                podIframe: null,
                backgroundImage: null
            });
        }

        const mediaType = data.media_type || '';
        const thumbnailUrl = data.thumbnail_url || null;
        const explanation = data.explanation || '';
        const podTitle = data.title || '';
        const url = data.url || '';

        let podImage = null;
        let podVideo = null;
        let podIframe = null;

        if (mediaType === 'image') {
            podImage = url;
        } else if (mediaType === 'video') {
            if (url.endsWith('.mp4') || url.endsWith('.webm')) {
                podVideo = url;
            } else {
                podIframe = url;
            }

            if (thumbnailUrl) {
                podImage = thumbnailUrl;
            }
        }

        res.render('nasa', {
            title: 'NASA Picture of the Day',
            planetNames,
            podTitle,
            podExplanation: explanation,
            podImage,
            podVideo,
            podIframe,
            backgroundImage: null
        });
    } catch (error) {
        console.log('NASA route error:', error);
        res.render('nasa', {
            title: 'NASA Picture of the Day',
            planetNames,
            podTitle: 'NASA APOD temporarily unavailable',
            podExplanation: 'There was a problem connecting to the NASA API.',
            podImage: null,
            podVideo: null,
            podIframe: null,
            backgroundImage: null
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});