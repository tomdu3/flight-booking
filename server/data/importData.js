const fs = require('fs');
const csv = require('csv-parser');
const connectDB = require('../db/db');
const Country = require('../models/Country');
const Airport = require('../models/Airport');
require('dotenv').config();

// Connect to MongoDB
connectDB();

// Function to import countries
const importCountries = () => {
  const countries = [];
  
  fs.createReadStream('./data/countries.csv')
    .pipe(csv())
    .on('data', (row) => {
      countries.push({
        id: row.id,
        code: row.code,
        name: row.name,
        continent: row.continent,
        wikipedia_link: row.wikipedia_link,
        keywords: row.keywords
      });
    })
    .on('end', async () => {
      try {
        await Country.deleteMany({});
        const inserted = await Country.insertMany(countries);
        console.log(`Inserted ${inserted.length} countries`);
        importAirports(); // Start importing airports after countries are done
      } catch (err) {
        console.error('Error importing countries:', err);
      }
    });
};

// Function to import airports
const importAirports = async () => {
  const airports = [];
  
  // First get all countries to map country codes to IDs
  const countryMap = {};
  const countries = await Country.find({});
  countries.forEach(country => {
    countryMap[country.code] = country._id;
  });

  fs.createReadStream('./data/airports.csv')
    .pipe(csv())
    .on('data', (row) => {
      airports.push({
        id: row.id,
        ident: row.ident,
        type: row.type,
        name: row.name,
        latitude_deg: parseFloat(row.latitude_deg),
        longitude_deg: parseFloat(row.longitude_deg),
        elevation_ft: row.elevation_ft ? parseInt(row.elevation_ft) : null,
        continent: row.continent,
        iso_country: row.iso_country,
        iso_region: row.iso_region,
        municipality: row.municipality,
        scheduled_service: row.scheduled_service,
        icao_code: row.icao_code,
        iata_code: row.iata_code,
        gps_code: row.gps_code,
        local_code: row.local_code,
        home_link: row.home_link,
        wikipedia_link: row.wikipedia_link,
        keywords: row.keywords,
        country: countryMap[row.iso_country] || null
      });
    })
    .on('end', async () => {
      try {
        await Airport.deleteMany({});
        const inserted = await Airport.insertMany(airports);
        console.log(`Inserted ${inserted.length} airports`);
        process.exit(0);
      } catch (err) {
        console.error('Error importing airports:', err);
        process.exit(1);
      }
    });
};

// Start the import process
importCountries();