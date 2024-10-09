const userStrings = require('./lang/en/en');
const http = require('http');
const {utils} = require("./modules/utils");


class App {
    constructor(port) {
        this.port = port;
    }

    // Method to handle root URL
    handleRoot(req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(userStrings.messages.defaultRootMessage);
    }


    handlePostData(req, res) {
        if (req.method === 'POST') {
            let body = ''
            req.on('data', (chunk) => {
                body += chunk;
            })
            req.on('end', () => {
                try {
                    const jsonData = JSON.parse(body); // Parse the JSON
                    console.log('Received JSON:', jsonData);
                    const {data} = jsonData
                    console.log('Received JSON:', data)
                    // Send a response
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({message: "Received Data"}))

                } catch (error) {
                    // Handle JSON parsing errors
                    res.writeHead(400, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({message: error.toString()}));
                }
            })
        } else {
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.end(userStrings.messages.badRequest);
        }
    }

    handleExecuteQuery(req, res) {
        if (req.method === 'GET') {
            console.log(req.url);
            const sqlStatement = utils.getParam(req, 'sql')
            if (!sqlStatement) {
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({
                    message: userStrings.messages.sqlStatementEmpty
                }));
            } else {
                try {
                    console.log(sqlStatement)
                } catch (error) {
                    console.log(error)
                    res.writeHead(500, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({
                        message: `Could execute ${sqlStatement} `
                    }));
                }

            }
        } else {
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.end(userStrings.messages.badRequest);
        }
    }

    handleRequests(req, res) {
        console.log(req.headers.origin);
        if (req.headers.origin !== 'https://comp4537lab5frontend.vercel.app') {
            // Allow CORS for all origins
            res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allow specific methods
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers

        }
        if (req.method === 'OPTIONS') {
            res.writeHead(200);  // Respond with HTTP 200 OK status
            res.end();
            return;
        }

        if (req.url === "/") {
            this.handleRoot(req, res);
        } else if (req.url.startsWith("/execute-sql")) {
            this.handleExecuteQuery(req, res)
        } else if (req.url.startsWith("/post-sample-data")) {
            this.handlePostData(req, res);
        } else {
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.end(userStrings.messages.badRequest);
        }

    }

    start() {
        const sever = http.createServer((req, res) => this.handleRequests(req, res))
        sever.listen(this.port, () => {
            console.log(`Listening on port ${this.port}`);
        })
    }
}


// Instantiate and start the server
const PORT = process.env.PORT || 8081;

// if bucket will be used

const myApp = new App(PORT)
myApp
    .start();
