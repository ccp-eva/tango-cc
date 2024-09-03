# TANGO-CC

![Zenodo Badge](https://zenodo.org/badge/710196381.svg?sanitize=true)

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

### Parameters

- subject ID
- language
- faces
- data saving modes: (1) download to local device; (2) upload to MPI server

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
