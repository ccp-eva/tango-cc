# TANGO-CC

![Zenodo Badge](https://zenodo.org/badge/710196381.svg?sanitize=true)

**Reference:**

Prein, J. C., Bednarski, F. M., Dzabatou, A., Frank, M. C., Henderson, A. M. E., Kalbitz, J., Kanngiesser, P., Keşşafoğlu, D., Köymen, B., Manrique-Hernandez, M. V., Magazi, S., Mújica-Manrique, L., Ohlendorf, J., Olaoba, D., Pieters, W. R., Pope-Caldwell, S., Sen, U., Slocombe, K., Sparks, R. Z., … Bohn, M. (2025). Measuring Variation in Gaze Following Across Communities, Ages, and Individuals: A Showcase of TANGO-CC (Task for Assessing iNdividual differences in Gaze understanding-Open-Cross-Cultural). _Advances in Methods and Practices in Psychological Science, 8_(1), 25152459241308170. https://doi.org/10.1177/25152459241308170

**Description:**

The TANGO–CC captures individual- and community-level variation in gaze following. Minimal language demands and the web-app implementation allow fast and easy contextual adaptations to each community. Psychometric properties were asssessed by analyzing a data set from 2.5- to 11-year-old children from 17 diverse communities. We found good internal consistency across all ages and communities. Three different trial types familiarize participants with the task to locate a balloon and use an agent's gaze as a cue.

![TANGO-CC Trials](/src/images/tango-cc-procedure.png)

### Usage

Link to task: [tango-cc](https://ccp-odc.eva.mpg.de/tango-cc)

### Structure

```
.
├── dist                        <-- folder to put on tablet for (offline) data collection
├── public
    ├── data                    <-- folder with php scripts, where participant data will be saved
    ├── logos
    ├── landing pages
├── src                         <-- folder containing all CSS and JavaScript for functionality
    ├── css
    ├── images                  <-- pic on intro slide + study svg
    ├── js                      <-- all javascript functions
    ├── sounds                  <-- all audio prompts
    ├── study html & js
└── ...some more config files

```

### URL Parameters

- language "lang": bem, chi, eng-in, eng-nz, eng-ni, eng-uk, eng-us, ger, hai, khw, lin, mar, sho, spa-ar, spa-me, swa, tur, bay, custom
- number of trials per type "touch", fam", "test": number
- background "bg": 01 - 04 (white_house, clay_house, brick_house, wood_house)
- agents "agents": f01 - f25 and m01 - m25, selection of chosen faces
- subject ID "ID": alphanumeric code
- webcam "webcam": true/false

### Development

Development requires [Node.js](https://nodejs.org/en/)

#### Local Development

1. `git clone git@github.com:ccp-eva/tango-cc.git`
1. `npm install`
1. `npm start`

#### Deploy Application To A Server

1. `git clone git@github.com:ccp-eva/tango-cc.git`
1. `npm install`
1. `npm run build`
1. Upload the contents within the `dist` folder to your web hoster.
