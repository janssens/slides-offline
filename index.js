const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const https = require('https');

function loadTemplate() {
    return new Promise((resolve, reject) => {
        const fileName = path.join(__dirname, 'template.html');
        fs.readFile(fileName, 'utf8', (err, content) => {
            return resolve(content);
        });
    })
}

function cleanUrl(url) {
    const URL = require('url');
    const myURL = URL.parse(url);
    myURL.search = '';
    myURL.hash = '';
    return myURL.protocol + '//' + myURL.host + myURL.pathname;
}

function downloadPage( url ) {
    return new Promise((resolve, reject) => {
        https.request(url + '/fullscreen', function(res) {
                console.log('STATUS: ' + res.statusCode);
                console.log('HEADERS: ' + JSON.stringify(res.headers));
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    console.log('BODY: ' + chunk);
                    // if (!error && response.statusCode == 200) {
                    //     const $ = cheerio.load(html);
                    //     $('body').find('script').remove();
                    //     return $('body').html();
                    // }
                    return 'hello world!';
                });
            })
        }

    );
}

function downloadImage(fileName, url) {
    return new Promise((resolve, reject) => {
        https.request(url).on('response', function (res) {
            const fws = fs.createWriteStream(fileName);
            res.pipe(fws);
            res.on('end', resolve);
            res.on('error', console.error);
            fws.on('error', console.error);
        }).on('error', reject);
    })
}

function main(slidesURL, folderName) {
    slidesURL = cleanUrl(slidesURL);
    if (!folderName) {
        const lastIndex = slidesURL.lastIndexOf('/');
        folderName = process.cwd();
        folderName = path.join(folderName, 'download');
        folderName = path.join(folderName, slidesURL.substr(lastIndex + 1));
    }

    const imgFolder = path.join(folderName, 'img');
    fs.mkdirSync(imgFolder, { recursive: true });

    Promise.all([
        loadTemplate(),
        downloadPage(slidesURL)
    ]).then(([template, slides]) => {
        console.log(slides);
        const $ = cheerio.load(template);

        $('.slides').after(slides);
        $('title').text('my title');

        $('img[data-src]').map((a, b) => {
            console.log(a);
            console.log(b);
            console.log('---');
            const img = $(b).attr('data-src');
            if (img.startsWith('https://s3.amazonaws.com')) {
                const lastIndex = img.lastIndexOf('/');
                const name = img.substr(lastIndex + 1);

                const imgPath = path.join(imgFolder, name);

                downloadImage(imgPath, img)

                $(b).attr('data-src', path.join('img', name));
            }
        });

        fs.writeFileSync(path.join(folderName, 'index.html'), $.html());
    })

}

module.exports = main;