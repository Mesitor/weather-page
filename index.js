import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/", (req, res) => { // Poner inicio donde poner la localidad
    res.render("index.ejs");
})

app.post("/weather", async (req, res) => { // Cuando me devuelve la localidad
    const ubication = req.body.ubication;

    try {
        const responseUbication = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${ubication}&count=1`); // Localidad que devuelve de una API
        const latitude = responseUbication.data.results[0].latitude;
        const longitude = responseUbication.data.results[0].longitude;

        const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,surface_pressure,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,daylight_duration,sunshine_duration&forecast_days=1`);
        const result = response.data;   // Mando localidad a otra API que devuelva los datos
        res.render("weather.ejs", { ubication: ubication, data: result });  // Mando los datos a el otro ejs para mostrar y enviar ubicacion    
    } catch (error) {
        console.log("Failed to make request: ", error.message);
    }
    // Si quiero mostrar otra ciudad lo mando para aca
}) 

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})