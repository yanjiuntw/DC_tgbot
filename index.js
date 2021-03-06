const fs = require('fs');
const util = require('util');
const request = require('request');
const log_file =fs.createWriteStream('debug.log', {flags: 'a+'});
const CronJob = require('cron').CronJob;

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN || 'YOUR_TOKEN';
const bot = new TelegramBot(token, {polling: true});
var myID = process.env.TELEGRAM_MYID || 'YOUR_CHAT_ID';
var running = 0;

// start main
bot.onText(/\/start$/, (msg, match) => {
    const chatId = msg.chat.id;
    myID = chatId;
    running = 1;
    send_msg(myID, 'Successfully setup your chat ID');
    send_msg(myID, 'Start main job');
});

// stop main
bot.onText(/\/stop$/, (msg, match) => {
    const chatId = msg.chat.id;
    running = 0;
    send_msg(myID, 'Stop main job');
});

// regex template
bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];

    bot.sendMessage(chatId, resp);
});

// console log all get message
bot.on('message', async function (msg) {
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
        file_path = await getpath(token, file_id);
        console.log('path: ' + file_path);
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

bot.onText(/你才|證據|乾 /, (msg, match) => {
    const chatId = msg.chat.id;
    const path = `./AQADea4xG0mj0FZ-.jpg`;
    //const stream = fs.createReadStream(path);
    bot.sendPhoto(chatId, path);
});

// functions
function getpath(token, fileid) {
    url = 'https://api.telegram.org/bot' + token;
    url += '/getFile?file_id=' + fileid;
    let file_path;
    return new Promise(function (resolve, reject) {
        request(url, { json: true }, (err, res, body) => {
            if (!err && res.statusCode == 200) {
                console.log(body);
                resolve(body.result.file_path);
            } else {
                reject(err);
            }
        });
    });
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
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
function send_msg(id, str) {
    const date = new Date();
    const time = date.toLocaleString();
    const base_str = time + ' ID:' + id + '=> ' + 'reply' + ': ';
    bot.sendMessage(id, str);
    console.log(base_str+str);
    log_str(base_str+str);
}
function log_str(str) {
    log_file.write(util.format(str) + "\n");
}

// Cron Job
var job = new CronJob(
    '0 * * * * *',
    function () {
        if (running) {
            send_msg(myID, 'Loop message test');
        }
    }
);
job.start();
//async function main () {
//    while (1) {
//        await sleep(10*1000);
//        if (running) {
//            send_msg(myID, 'Loop message test');
//        }
//    }
//}
//main();
