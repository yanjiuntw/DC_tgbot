const fs = require('fs');
const util = require('util');
const request = require('request');
const log_file =fs.createWriteStream('debug.log', {flags: 'a+'});
function log_str(str) {
    log_file.write(util.format(str) + "\n");
}

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN || 'YOUR_TOKEN';
const bot = new TelegramBot(token, {polling: true});
const myID = process.env.TELEGRAM_MYID || 'YOUR_CHAT_ID';

// template
bot.onText(/\/start$/, (msg, match) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Hello world');
});

// regex template
bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];

    bot.sendMessage(chatId, resp);
});

// console log all get message
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const username = msg.chat.username;
    const date = new Date();
    const time = date.toLocaleString();
    const base_str = time + ' ID:' + chatId + '=> ' + username + ': ';

    if (msg.text) {
        str = base_str + msg.text;
        console.log(str);
        log_str(str);
    }

    if (msg.photo) {
        max_photo = msg.photo.pop();
        file_unique_id = max_photo.file_unique_id;
        file_id = max_photo.file_id;
        file_path = getpath(token, file_id);
        console.log('path:'+file_path);
        getfile(token, file_path, file_unique_id);
        str = base_str + 'Send photo (' + file_unique_id + '.jpg)';

        console.log(str);
        log_str(str);
    }
});

// license
bot.onText(/韋勳|肥|胖|宅/, (msg, match) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '肥宅韋勳');
});

// functions
function getpath(token, fileid) {
    url = 'https://api.telegram.org/bot' + token;
    url += '/getFile?file_id=' + fileid;
    let file_path;
    request(url, { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        file_path = body.result.file_path;
        console.log(file_path);
    });
    console.log('finish');
    return file_path;
}
function download(uri, filename, callback) {
    request.head(uri, function(err, res, body){
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
}
function getfile(token, path, hash) {
    url = 'https://api.telegram.org/file/bot' + token;
    url += '/' + path;
    //re = new RegExp('photos/(.*)$');
    fn = hash + '.jpg';//path.match(re)[1];
    download(url, fn, () => {
        console.log('getfile: Download done');
    });
}
