# WildWatch

# Description
WildWatch is a web application designed to help users document and explore plant and animal sightings. Users can upload an image, input basic details about the sighting (such as species, location, and date), and the system uses an AI validator (Dragoneye API) to confirm the species before saving it to the database. The platform also includes interactive features like species filtering, migration pattern visualizations, and a searchable species guide.

# Installation
If accessing the deployed version of the website, no installation is necessary. However, to run the application locally, follow the steps below:
1. Install required packages using npm:
   - npm install dragoneye-node
   - npm install mysql2
2. Start the server:
   - node server.js

The database schema is included in a separate file for setup purposes. Only the animalsandplants table is shared. The usersubmission table is excluded for privacy reasons.

# Usage
Once the server is running and the site is open in your browser, you can explore the following features:

Report Sightings: Submit a new sighting by filling in type, name, location (auto-filled but editable), date (also editable), and uploading an image. The AI will validate your input. If matched, you'll receive a confirmation. If not, the system will display the predicted species instead.

Explore Sightings: View existing reports on a map. Use the Choose a Species filter to display specific sightings. Clicking on a marker shows detailed sighting info.

Migration Patterns: Select a bird species and view its monthly frequency distribution based on collected reports.

Species Guide: Browse all cataloged species with photos and descriptions. Search by species name or keyword. Filters are available to show only animals or only plants.

Contact Page: Send questions, suggestions, or requests directly to our team.

# Support
For questions or issues regarding the code or website, please reach out to us through the Contact Us page.

# Contributing
We welcome improvements and suggestions. Please reach out via the Contact Us page if you'd like to contribute to WildWatch.

# Authors and Acknowledgements
Frontend Development: Avery Cone, Mary Anne Onyedinma
Backend Development: Ethan Singer, Lauren Fagley, Aayat Alsweiti

Acknowledgement: Special thanks to Dragoneye for their dragoneye-node API, which powers our species identification feature.