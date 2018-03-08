#!/bin/bash
raspi-config
# Locale german....
# Tastatur German
# Audio force auf 3,5mm jack
# Expand Filesystem
# Passwort ändern
apt-get update && apt-get upgrade
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
apt-get install -y git libttspico* nginx nodejs espeak libasound2-dev omxplayer
sync
adduser timo
echo omit | passwd timo --stdin
adduser timo sudo
usermod -a -G video timo
usermod -a -G audio timo
echo "chmod 777 /dev/ttyUSB0" >> /etc/rc.local
mkdir /opt/timo
mkdir /var/timo
mkdir /var/log/timo
chown timo:timo timo
chown timo:timo /var/log/timo
chown timo:timo /var/timo
echo "[]" >  /var/timo/database.json
npm install -g pm2 node-gyp
su - timo
pm2
pm2 list
sudo env PATH="$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2" startup systemd -u timo --hp /home/timo
cd /opt/timo || exit
git clone https://github.com/teamtimo/timo-data
cd timo-data || exit
npm install
echo "{\"port\": 50210,\"dbfilelocation\": \"/var/timo/database.json\"}" > config.json
pm2 start app.js --name="50210_timo-data"
cd /opt/timo || exit
git clone https://github.com/teamtimo/timo-io
cd timo-io || exit
npm install
echo "{\"port\": 50218,\"serialport\": \"/dev/ttyUSB0\"}" > config.json
pm2 start app.js --name="50218_timo-io"
cd /opt/timo || exit
git clone https://github.com/teamtimo/timo-player
cd timo-player || exit
npm install
echo "{\"port\": 50215,\"ioservice\": \"http://localhost:50218\", \"dataservice\":\"http://localhost:50210\"}" > config.json
pm2 start app.js --name="50215_timo-player"
pm2 save