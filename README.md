# TANGO-CC

### Usage

Link to task: [tango-cc-demo](https://ccp-odc.eva.mpg.de/tango-cc-demo)

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

1. `git clone git@github.com:ccp-eva/tango-cc-demo.git`
1. `npm install`
1. `npm start`

#### Deploy Application To A Server

1. `git clone git@github.com:ccp-eva/tango-cc-demo.git`
1. `npm install`
1. `npm run build`
1. Upload the contents within the `dist` folder to your web hoster.
