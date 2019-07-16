# epilogos-client

This is a React application for presenting epilogos datasets. This includes an `epilogos-annotations` Express.js service for genomic annotation autocompletion and lookup, which is backed by a Redis store.

The following steps document how to set up a vanilla Ubuntu EC2 host with this application, using `nginx` to run production and development client servers and the Express.js-backed annotations service.

## Setup

### Nodejs

#### Installation

```
$ cd ~
$ wget -qO- https://nodejs.org/dist/v11.1.0/node-v11.1.0-linux-x64.tar.xz > node-v11.1.0-linux-x64.tar.xz
$ tar xvf node-v11.1.0-linux-x64.tar.xz
...
$ cd node-v11.1.0-linux-x64/bin
$ sudo ln -s ${PWD}/node /usr/bin/node
$ sudo ln -s ${PWD}/npm /usr/bin/npm
$ sudo ln -s ${PWD}/npx /usr/bin/npx
```

#### Modules

Go into the root of the epilogos React project directory and install required client modules:

```
$ npm install
```

### nginx

The `nginx` server is used to serve the production site on tcp port 80, to proxy requests to the development server running on tcp port 3000, and to proxy requests to the Express.js annotations server running on tcp port 8000.

If necessary, use the EC2 console to set up security group policies that open up tcp ports 80, 3000, and 8000 for public (inbound) access.

#### Installation

```
$ sudo apt install nginx -y
```

#### Client

##### Production

Grant permissions to the `ubuntu` user to join the `www-data` group:

```
$ sudo gpasswd -a "$USER" www-data
```

Create a destination folder for hosting the production server files, along with requisite permissions:

```
$ sudo chown -R "$USER":www-data /var/www
$ sudo mkdir /var/www/epilogos
$ sudo chown ubuntu:www-data /var/www/epilogos
$ sudo find /var/www -type f -exec chmod 0660 {} \;
$ sudo find /var/www -type d -exec chmod 2770 {} \;
```

Create a text file called `/etc/nginx/sites-available/epilogos-production` and add the following:

```
server {
  listen 80;
  listen [::]:80;

  server_name epilogos.altius.org;
  server_name 18.218.203.184;

  root /var/www/epilogos;
  index index.html;

  access_log /var/log/nginx/epilogos.access.log;
  error_log /var/log/nginx/epilogos.error.log;

  location / {
    try_files $uri /index.html =404;
  }

  gzip on;
  gzip_comp_level    5;
  gzip_min_length    256;
  gzip_proxied       any;
  gzip_vary          on;

  gzip_types
  application/atom+xml
  application/javascript
  application/json
  application/ld+json
  application/manifest+json
  application/rss+xml
  application/vnd.geo+json
  application/vnd.ms-fontobject
  application/x-font-ttf
  application/x-web-app-manifest+json
  application/xhtml+xml
  application/xml
  font/opentype
  image/bmp
  image/svg+xml
  image/x-icon
  text/cache-manifest
  text/css
  text/plain
  text/vcard
  text/vnd.rim.location.xloc
  text/vtt
  text/x-component
  text/x-cross-domain-policy;
}
```

If different, change the `server_name` value(s) to reflect the public IP address and name of the EC2 host. This is available from the EC2 console, or by running the following command:

```
$ wget -qO- 'http://169.254.169.254/latest/meta-data/public-ipv4'
```

Make the following symlink:

```
$ sudo ln -s /etc/nginx/sites-available/epilogos-production /etc/nginx/sites-enabled/epilogos-production
```

##### Development

Create a text file called `/etc/nginx/sites-available/epilogos-development` and add the following:

```
server {
  listen 3000;
  
  server_name epilogos.altius.org;
  server_name 18.218.203.184;
  
  access_log /var/log/nginx/epilogos-development.access.log;
  error_log /var/log/nginx/epilogos-development.error.log;
  
  location / {
    proxy_pass http://ip-172-31-10-118.us-east-2.compute.internal:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

If necessary, change the `proxy_pass` value to reflect the private IP address of the EC2 host. This is available from the EC2 console, or by running the following command:

```
$ wget -q -O - 'http://169.254.169.254/latest/meta-data/local-ipv4'
```

Make the following symlink:

```
$ sudo ln -s /etc/nginx/sites-available/epilogos-development /etc/nginx/sites-enabled/epilogos-development
```

#### Annotations

Go into the root of the `epilogos-annotations` project directory and install required client modules:

```
$ npm install
```

##### Development

Create a text file called `/etc/nginx/sites-available/epilogos-annotations` and add the following:

```
server {
  listen 8000;
    
  server_name epilogos.altius.org;
  server_name 18.218.203.184;
  
  access_log /var/log/nginx/epilogos-annotations.access.log;
  error_log /var/log/nginx/epilogos-annotations.error.log;

  location / {
    proxy_pass http://ip-172-31-10-118.us-east-2.compute.internal:8081;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

If necessary, change the `proxy_pass` value to reflect the private IP address of the EC2 host. This is available from the EC2 console, or by running the following command:

```
$ wget -qO- 'http://169.254.169.254/latest/meta-data/local-ipv4'
```

Make the following symlink:

```
$ sudo ln -s /etc/nginx/sites-available/epilogos-annotations /etc/nginx/sites-enabled/epilogos-annotations
```

#### Startup

Use the following command to start the `nginx` service:

```
$ sudo service nginx start
```

If you make any changes to the web server’s configuration, such as to these three site configuration files, use the following to restart the service:

```
$ sudo service nginx restart
```

### React + Express.js applications

#### Production

To deploy a production React application, add a `deploy` target to the React application's `package.json` `scripts` property:

```
  ...
  "scripts": {
    ...
    "deploy": "rsync -avzhe --progress ./build/* /var/www/epilogos"
  },
  ...
```

Run the following as needed to build the production React application and deploy it to the production web document root that was set up in the `nginx` section:

```
$ npm run build && npm run deploy
```

If out-of-memory errors result, run the following before building:

```
$ export NODE_OPTIONS=--max_old_space_size=4096
```

Then build and deploy, as usual.

#### Development

##### Environment

Go into the root of the epilogos React project directory and make sure there is a text file called `.env` that contains the following two lines:

```
HOST=0.0.0.0
PORT=8080
```

##### PM2

We will use PM2 to manage the React and Express.js development servers. This ensures the development services continue to run after logging out from the terminal, the server requires rebooting, or if the network connection to the host is interrupted.

###### Installation

```
$ sudo npm install pm2 -g
$ export NODEROOT=/home/ubuntu/node-v11.1.0-linux-x64
$ sudo ln -sf ${NODEROOT}/bin/pm2 /usr/bin/pm2
$ sudo ln -sf ${NODEROOT}/bin/pm2-dev /usr/bin/pm2-dev
$ sudo ln -sf ${NODEROOT}/bin/pm2-docker /usr/bin/pm2-docker
$ sudo ln -sf ${NODEROOT}/bin/pm2-runtime /usr/bin/pm2-runtime
$ sudo pm2 startup systemd
$ sudo pm2 save
$ sudo chown -R ubuntu:ubuntu /home/ubuntu/.pm2
$ sudo chown ubuntu:ubuntu /home/ubuntu/.pm2/rpc.sock /home/ubuntu/.pm2/pub.sock
```

###### Process configuration

Create a text file in the React project directory called `epilogos-client.development.json`:

```
{
  apps : [
    {
      name: "epilogos-client (development)",
      script: "npm run start",
      interpreter: "none",
      watch: false,
      cwd: "/home/ubuntu/epilogos",
      env: {
        "PORT": 8080,
        "NODE_ENV": "development",
        "HOST": "0.0.0.0"
      }
    }
  ]
}
```

Create another text file in the `epilogos-annotations` project directory called `epilogos-annotations.development.json`:

```
{
  apps : [
    {
      name: "epilogos-annotations (development)",
      script: "nodemon --exec npm run dev",
      interpreter: "none",
      watch: false,
      cwd: "/home/ubuntu/epilogos/epilogos-annotations",
      env: {
        "DEBUG": "epilogos-annotations:*",
        "PORT": 8081,
        "NODE_ENV": "development",
        "HOST": "ip-172-31-10-118.us-east-2.compute.internal"
      }
    }
  ]
}
```

And another text file in the `epilogos-annotations` project directory called `epilogos-annotations.production.json`:

```
{
  apps : [
    {
      name: "epilogos-annotations (production)",
      script: "npm run start",
      interpreter: "none",
      watch: false,
      cwd: "/home/ubuntu/epilogos/epilogos-annotations",
      env: {
        "DEBUG": "epilogos-annotations:*",
        "PORT": 8081,
        "NODE_ENV": "production",
        "HOST": "ip-172-31-10-118.us-east-2.compute.internal"
      }
    }
  ]
}
```

###### Startup

In the React project directory, start the development server:

```
$ pm2 start epilogos-client.development.json
```

In the `epilogos-annotations` Express.js project directory, do a global install of the `nodemon` application:

```
$ sudo npm install nodemon -g
```

Then start the development Express.js service:

```
$ pm2 start epilogos-annotations.development.json
```

Use of `nodemon` causes the Express.js service to restart on code changes, to facilitate development.

###### Save configuration

The following persists all changes to the `pm2` configuration, so that the development services start on server reboot.

```
$ pm2 save
```

Run `pm2 list` to ensure that the development server process is up and running, and use `pm2 log <id>` to debug any errors.

### Redis

The Redis database is used to store and cache key-value pairs representing genomic annotations (genes, SNPs, etc.) and annotation prefixes, as well as genomic positions of those annotations. The Express.js service provides standard HTTP methods for uploading and querying the Redis store.

#### Installation

```
$ sudo apt install tcl -y
$ sudo apt install tk8.5 -y
$ sudo apt install build-essential
$ wget http://download.redis.io/redis-stable.tar.gz
$ make
$ make test
$ sudo make install
```

#### Kernel setup

Edit the following file:

```
$ sudo emacs /etc/sysctl.conf
```

Include the following directive:

```
vm.overcommit_memory = 1
```

Edit the following file:

```
$ sudo emacs /etc/rc.local
```

Add the following directive:

```
$ echo never > /sys/kernel/mm/transparent_hugepage/enabled
```

Reboot the server:

```
$ sudo shutdown -r now
```

#### System

Edit the Redis configuration file:

```
$ emacs ~/redis-stable/redis.conf
```

Set the following key-value pairs:

```
maxmemory        1gb
maxmemory-policy allkeys-lru
daemonize        yes
pidfile          /var/run/redis_6379.pid
logfile          /var/log/redis_6379.log
dir              /var/redis/6379
```

Set up Redis to run at boot:

```
$ sudo mkdir /etc/redis
$ sudo cp ~/redis-stable/redis.conf /etc/redis/6379.conf
$ sudo mkdir -p /var/redis/6379
$ sudo cp ~/redis-stable/utils/redis_init_script /etc/init.d/redis_6379
```

Edit the Redis initialization script:

```
$ sudo emacs /etc/init.d/redis_6379
```

Add required keys in the `BEGIN INIT INFO` block:

```
# Required-Start:       $syslog
# Required-Stop:        $syslog
# Should-Start:         $local_fs
# Should-Stop:          $local_fs
```

Update the system-wide defaults:

```
$ sudo update-rc.d redis_6379 defaults
```

Test startup of the Redis instance:

```
$ sudo /etc/init.d/redis_6379 start
```

Test call-response:

```
$ redis-cli
127.0.0.1:6379> ping
PONG
```

Reboot:

```
$ sudo shutdown -r now
```

Test call-response upon restart:

```
$ redis-cli
127.0.0.1:6379> ping
PONG
```

#### Python

Install Python3 Redis dependencies:

```
$ sudo apt install python3-pip -y
$ sudo pip3 install redis
```