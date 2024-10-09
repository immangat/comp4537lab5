const fs = require('fs');

class Utils {
    static getParam(req, paramName) {
        try {
            const url = new URL(req.url, `https://${req.headers.host}`);
            const params = url.searchParams;
            return params.get(paramName);

        } catch (error) {
            console.error(error, `Error while reading ${paramName} `);
        }

    }

}


exports.utils = Utils;
