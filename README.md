#### ISAG Secure First #7 | Registration System

repo นี้เป็นระบบที่ใช้สำหรับกดใบสมัครในการเข้าร่วมงาน secure first

#### Authors

1. Kook [eXitGuy](https://github.com/eXitHere)
2. Jark [DiFve](https://github.com/DiFve)

---

#### Tech Stack

- Frontend: Vue.js + Tailwindcss + HCaptcha
- Backend: Express.js
- Database: sqlite (3)

---

#### HCaptcha

เอาไว้กัน request flooding

https://www.hcaptcha.com/ (สมัครให้เรียบร้อย)

เอา sitekey มาใส่แทนที่ [App.vue#L133](https://github.com/ISAG-Lab/secure1st_register/blob/main/front_register/src/App.vue#L133)

ส่วน secret ให้ใส่ใน .env ของ backend `HCAPTCHA_SECRET`

---

#### Discord Widget

เปิดใช้งาน widget ของ server ให้เรียบร้อยแล้วเอา id มาใส่แทนที่ [App.vue#L191](https://github.com/ISAG-Lab/secure1st_register/blob/main/front_register/src/App.vue#L191)

---

#### Folder Structures

```
--| backend/
----| .env.template  # ให้ copy อันนี้ -> .env
----| src/
------| database.db  # file นี้คือฐานข้อมูลจะถูกสร้างอัตโนมัติ (ถ้าไม่มี)
--| front_dashboard/ # ระบบสแกน QRCode เข้างาน + Admin
--| front_register/  # ระบบกดรับใบสมัคร
```

---

#### การตั้งค่า

1. ปีนี้ปล่อยใบสมัคร `60` ใบ ถ้าต้องการเพิ่ม

backend/src/database.js #line 121

```
121: return 60 - rowNum.get().student_id;
```

---

#### How to Clone Private repo

1. ไปที่ repo
2. Settings
3. Deploy keys
4. มาที่ terminal ของ Server
5. `ssh-keygen -t rsa` ใส่ข้อมูลให้เรียบร้อย
6. `cat ~/.ssh/id_rsa_xxxxx.pub` cat public file แล้ว copy ไว้
7. เอามาเพิ่มใน Deploy keys ของ github ในข้อ 3
8. ไม่ต้องให้ Allow write access !!

---

#### Router

`ใช้ Thunder Client (vscode extension) เปิดไฟล์ thunder-collection_Secure_First.json`

```
# public
POST /api/v341/register
POST /api/v341/ticket-left
POST /api/v341/timestamp

# private
POST /api/kanokporn_swha/list
POST /api/kanokporn_swha/create
POST /api/kanokporn_swha/check-in
POST /api/kanokporn_swha/get
POST /api/kanokporn_swha/auth
```

---

#### Deployment

- ubuntu (recommend)
- nodejs 16.x
- yarn
- pm2
- nginx

##### nginx for front_dashboard

1. create nginx config file

`sudo nano /etc/nginx/sites-available/secure_dashboard`

```
server {
    listen 80;

    client_max_body_size 100M;
    server_tokens off;
    charset utf-8;

    server_name subdomain.domain.tld; # <---- edit ด้วยยยย

     # Frontend
    location / {
        root /home/isag/workspace/secure1st_register/front_dashboard/dist;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    location = /robots.txt {
        add_header Content-Type text/plain;
        return 200 "User-agent: *\nDisallow: /\n";
    }

     # Api
    location /api {
        proxy_pass http://localhost:5500;
        proxy_pass_header Server;
        proxy_set_header Host $http_host;
        proxy_redirect off;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Scheme $scheme;
    }
}
```

2. สร้าง link

   `sudo ln -s /etc/nginx/sites-available/secure_dashboard /etc/nginx/sites-enabled`

3. ทดสอบ
   `nginx -t`

4. reload
   `sudo systemctl restart nginx`

---

##### nginx for front_register

1. create nginx config file

`sudo nano /etc/nginx/sites-available/secure_register`

```
server {
    listen 80;

    client_max_body_size 100M;
    server_tokens off;
    charset utf-8;

    server_name subdomain.domain.tld; # <---- edit ด้วยยยย

     # Frontend
    location / {
        root /home/isag/workspace/secure1st_register/front_register/dist;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    location = /robots.txt {
        add_header Content-Type text/plain;
        return 200 "User-agent: *\nDisallow: /\n";
    }

     # Api
    location /api {
        proxy_pass http://localhost:5500;
        proxy_pass_header Server;
        proxy_set_header Host $http_host;
        proxy_redirect off;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Scheme $scheme;
    }
}
```

2. สร้าง link

   `sudo ln -s /etc/nginx/sites-available/secure_register /etc/nginx/sites-enabled`

3. ทดสอบ
   `nginx -t`

4. reload
   `sudo systemctl restart nginx`

---

##### script for auto deploy

1. `nano ./deploy.sh` (root ของ folder)

```
git reset HEAD --hard
git pull origin main

# build front_register
cd front_register
yarn
yarn build
yarn run obfuscate
rm -rf node_modules

cd ..

# build front_dashboard
cd front_dashboard
yarn
yarn build
yarn run obfuscate
rm -rf node_modules

cd ..

# build backend
cd backend
npm install
pm2 stop regis-api ; pm2 delete regis-api ; pm2 start src/index.js --name regis-api
echo "Update Done!"

```

2. ให้สิทธิ์

   `chmod +x ./deploy.sh`

3. `./deploy.sh`
