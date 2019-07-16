# epilogos-web

This is a React application for presenting epilogos datasets using a HiGlass visualization component, which pulls data from "tilesets" hosted on a separate HiGlass server (at this time, https://explore.altius.org).

Setting up a HiGlass server is outside the scope of this document. HiGlass server and aggregation tools are available via GitHub: https://github.com/higlass

The following steps document how to set up a vanilla Ubuntu EC2 host with this client application, using `nginx` to run production and development client servers.

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

The `nginx` server is used to serve the production site on tcp port 443, to redirect requests from tcp port 80 to port 443, and to proxy requests to the development server running on tcp port 3000.

If necessary, use the EC2 console to set up security group policies that open up tcp ports 80, 443, and 3000 for public (inbound) access.

#### Installation

```
$ sudo apt install nginx -y
```

#### Client

##### SSL

Get the SSL wildcard certificate and private key information for the Altius domain via the Informatics or IT group. 

The certificate and key should be copied to the destinations `/etc/ssl/certs/altius-bundle.crt` and `/etc/ssl/private/altius.org.key`, respectively. 

Set appropriate permissions on the private key:

```
# chmod 600 /etc/ssl/private/altius.org.key
```

Generate a Diffie-Hellman key exchange file that improves session security:

```
# openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
```

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

Create a text file called `/etc/nginx/sites-available/epilogos-ssl` and add the following:

```
server {
  listen 443 ssl;
  listen [::]:443 ssl;

  server_name epilogos.altius.org;
  server_name 18.218.203.184;
  
  ssl_certificate /etc/ssl/certs/altius-bundle.crt;
  ssl_certificate_key /etc/ssl/private/altius.org.key;
  ssl_protocols TLSv1.2;
  ssl_prefer_server_ciphers on;
  ssl_dhparam /etc/ssl/certs/dhparam.pem;
  ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
  ssl_ecdh_curve secp384r1; # Requires nginx >= 1.1.0
  ssl_session_timeout  10m;
  ssl_session_cache shared:SSL:10m;
  ssl_session_tickets off; # Requires nginx >= 1.5.9
  ssl_stapling on; # Requires nginx >= 1.3.7
  ssl_stapling_verify on; # Requires nginx => 1.3.7
  resolver 8.8.8.8 8.8.4.4 valid=300s;
  resolver_timeout 5s;
  add_header X-Frame-Options DENY;
  add_header X-Content-Type-Options nosniff;
  add_header X-XSS-Protection "1; mode=block";

  root /var/www/epilogos;
  index index.html;

  access_log /var/log/nginx/epilogos.access.log;
  error_log /var/log/nginx/epilogos.error.log;

  location / {
    try_files $uri /index.html =404;
  }

  gzip on;
  gzip_comp_level    6;
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
$ sudo ln -s /etc/nginx/sites-available/epilogos-ssl /etc/nginx/sites-enabled/epilogos-ssl
```

Create a text file called `/etc/nginx/sites-available/epilogos` and add the following:

```
server {
  listen 80;
  listen [::]:80;

  server_name epilogos.altius.org;
  server_name 18.218.203.184;

  return 301 https://$server_name$request_uri;
}
```

Make the following symlink:

```
$ sudo ln -s /etc/nginx/sites-available/epilogos /etc/nginx/sites-enabled/epilogos
```

Requests to port 80 will be permanently redirected to port 443.

##### Development

Create a text file called `/etc/nginx/sites-available/epilogos-development-ssl` and add the following:

```
server {
  listen 3000 ssl;
  listen [::]:3000 ssl;
  
  server_name epilogos.altius.org;
  server_name 18.218.203.184;
  
  ssl_certificate /etc/ssl/certs/altius-bundle.crt;
  ssl_certificate_key /etc/ssl/private/altius.org.key;
  ssl_protocols TLSv1.2;
  ssl_prefer_server_ciphers on;
  ssl_dhparam /etc/ssl/certs/dhparam.pem;
  ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
  ssl_ecdh_curve secp384r1; # Requires nginx >= 1.1.0
  ssl_session_timeout  10m;
  ssl_session_cache shared:SSL:10m;
  ssl_session_tickets off; # Requires nginx >= 1.5.9
  ssl_stapling on; # Requires nginx >= 1.3.7
  ssl_stapling_verify on; # Requires nginx => 1.3.7
  resolver 8.8.8.8 8.8.4.4 valid=300s;
  resolver_timeout 5s;
  add_header X-Frame-Options DENY;
  add_header X-Content-Type-Options nosniff;
  add_header X-XSS-Protection "1; mode=block";
  
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
$ sudo ln -s /etc/nginx/sites-available/epilogos-development-ssl /etc/nginx/sites-enabled/epilogos-development-ssl
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
