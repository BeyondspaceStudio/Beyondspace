// Listen on a specific host via the HOST environment variable
var host = process.env.HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
var port = process.env.PORT || 3000;

const { exec } = require('child_process')
const express = require('express')
const fetch = require('node-fetch')
var cors = require('cors')
const app = express()

app.use(cors())

app.get('/npm/:package', async (req, res) => {
    const { package } = req.params;
    let result = null;
    try {
      result = await runCommand(`npm view ${package} versions --json`);
    } catch(err) {
      result = err;
    }
    
    res.send(result);
})

app.get('/npm/:scoped/:package', async (req, res) => {
    const { scoped, package } = req.params;
      let result = null;
      try {
        result = await runCommand(`npm view ${scoped}/${package} versions --json`);
      } catch(err) {
        result = err;
      }
      
      res.send(result);
})

app.get('/npm', async (req, res) => {
    res.send(`Add the package name in the correct format to get all package version in JSON /npm/:packageName or /npm/:scoped/:packageName`)
})

app.get('/youtube/playlist/:playlistId', async (req, res) => {
  const { playlistId } = req.params;
  const { nextPageToken } = req.query;
  let endpoint = `https://storage.elfsight.com/api/youtube?q=%2FplaylistItems%3FplaylistId%3D${playlistId}%26part%3DcontentDetails%252Csnippet%26maxResults%3D50&public_key=RWxmc2lnaHQuIEFsbCByaWdodHMgcmVzZXJ2ZWQu&_=1632989332243`;

  if ( nextPageToken ) {
    endpoint = `https://storage.elfsight.com/api/youtube?q=%2FplaylistItems%3FplaylistId%3D${playlistId}%26part%3DcontentDetails%252Csnippet%26maxResults%3D50%26pageToken%3D${nextPageToken}&public_key=RWxmc2lnaHQuIEFsbCByaWdodHMgcmVzZXJ2ZWQu&_=1632990261177`
  }

  const response = await fetch(endpoint);
  const data = await response.text()
  res.send(data);
})

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
    res.status(404).send(`Add the package name in the correct format to get all package version in JSON /npm/:packageName or /npm/:scoped/:packageName`)
});

app.listen(port, host, function() {
  console.log('Running Beyondspace Packge Info on ' + host + ':' + port);
});

/*app.listen(port, () => {
  console.log(`Get any npm package version`)
})*/

function runCommand(cmd) {
    return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) return reject(error)
        if (stderr) return reject(stderr)
        resolve(stdout)
      })
    })
  }