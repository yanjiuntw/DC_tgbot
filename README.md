## Install
* You need to install nodejs and install packages by npm

```bash
$ git clone https://github.com/yanjiuntw/DC_tgbot.git
$ cd DC_tgbot.git
$ npm install
```
* You shoud build the runner script for start server

```bash
#! /usr/bin/env sh
# filename: run.sh
#export TELEGRAM_TOKEN="dummy"
#export TELEGRAM_MYID="dummy"
node index.js
```

* After setup your telegram bot token ([How to get your token](https://core.telegram.org/bots))
* The chat ID is optional, you can setup if need

```bash
npm run server
```
