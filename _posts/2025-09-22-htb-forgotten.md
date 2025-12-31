---
layout: post
title: "Forgotten - Hack The Box"
summary: "LimeSurvey discovery via directory brute-force → external MariaDB configuration → remote database setup via firewall rules → LimeSurvey admin account creation → CVE-2021-44967 malicious plugin upload RCE → docker container shell → socat shell upgrade → environment variable password extraction (limesvc credentials) → SSH access to host machine → custom docker mount to host exploitation → privilege escalation via mounted volume"
---

# Forgotten - Hack The Box

## Enumeration
### Nmap 
Initial nmap scan revealed SSH and HTTP ports were open.

<img width="798" height="327" alt="00 - nmap output" src="https://github.com/user-attachments/assets/dde19805-c765-42d1-910c-52e5dc1480a7" />

### WEB Enumeration
Website showed 403 Forbidden error.

<img width="1291" height="294" alt="01 - forbidden" src="https://github.com/user-attachments/assets/cb5a7809-fc20-4961-8342-64aacde696eb" />

Directory brute forcing revealed survey endpoint. It was a limesurvey installation endpoint.

<img width="1057" height="413" alt="02 - dirbuster" src="https://github.com/user-attachments/assets/51edb891-9fbf-4e13-a40c-2dff1518ae19" />

<img width="1466" height="468" alt="03 - limesurvey" src="https://github.com/user-attachments/assets/0e95a5d7-cc88-47fa-baa6-f991a9155be5" />

When I tried to finish the setup, I was stuck at db connection. Then I thought to create my own database and connect to it remotely. 

I used below commands to set the database and the user. The '%' means from anywhere (0.0.0.0):
```mysql
CREATE DATABASE test_limedb;
CREATE USER 'test_limeuser'@'%' IDENTIFIED BY 'Test1234';
GRANT SELECT, CREATE, INSERT, UPDATE, DELETE, ALTER, DROP, INDEX ON test_limedb.* TO 'test_limeuser'@'%';
FLUSH PRIVILEGES;
```

Then restarted the db and set the firewall rules:
```bash
sudo ufw allow in on tun0 to anyport 3306
sudo /etc/init.d/mariadb stop
sudo /etc/init.d/mariadb start
```

<img width="1118" height="631" alt="04 - db creation" src="https://github.com/user-attachments/assets/e589fb29-1149-44fd-a757-056ab7e7e8b8" />

And I set the database configurations on limesurvey installation.

<img width="1673" height="850" alt="05 - db config" src="https://github.com/user-attachments/assets/1157ac60-3230-477f-afe3-a870f005bf28" />

Then populated the database and set administrator username and password.

<img width="1434" height="437" alt="06 - populate" src="https://github.com/user-attachments/assets/4092e312-c41d-44c3-8874-210d6b65df58" />

<img width="1443" height="665" alt="07 - admin" src="https://github.com/user-attachments/assets/43eb0dec-2049-4f03-9576-d68685fc6088" />

Then I simply logged in.

<img width="1919" height="809" alt="08 - login" src="https://github.com/user-attachments/assets/79028f5a-12eb-4ac6-bafa-5060a64d5bac" />

## Exploitation
### CVE-2021-44967
After obtaining admin dashboard, I knew that I could abuse CVE-2021-44967. I could upload malicious plugin and get a reverse shell. [INE post](https://ine.com/blog/cve-2021-44967-limesurvey-rce) explains it in detail.

I could have exploited it manually but I used [this](https://github.com/D3Ext/CVE-2021-44967) tool and got a reverse shell. The reverse shell was in a docker container and there were no flags.

<img width="1647" height="456" alt="09 - cve-2021-44967" src="https://github.com/user-attachments/assets/c835f0d4-6964-4157-81c7-62938a84fdfa" />

<img width="926" height="285" alt="10 - shell" src="https://github.com/user-attachments/assets/4a8f3c0b-4dae-43d3-99ba-20e69dd6ae5b" />

At first I used socat the get an upgraded shell.

<img width="721" height="62" alt="11 - socat" src="https://github.com/user-attachments/assets/55c7b8c3-f5c7-4ad9-ac5b-6f689c07b23b" />

<img width="730" height="321" alt="12 - socat shell" src="https://github.com/user-attachments/assets/1918d084-9d7e-4b4f-9f4c-4cea7fb23f3d" />

Then I run linpeas and found an environment variable which includes limesvc's password.

<img width="1437" height="453" alt="14 - env" src="https://github.com/user-attachments/assets/5d8bdf5e-b0d5-49b0-b945-8f90214d6956" />

I was the root inside the container but there were still no flags. Then I tried the SSH login and it worked. I got the user flag on the host machine.

<img width="594" height="298" alt="15 - root" src="https://github.com/user-attachments/assets/f54ab849-e419-4fc8-bc40-5edc8a1cd7e1" />

<img width="769" height="769" alt="15 - got the user" src="https://github.com/user-attachments/assets/2e868cf6-04b2-4c23-a7bb-4ef7d36a2ca4" />

## Privilege Escalation
After some research I found out that, if there was a custom mount on the container I could write to it as container root and execute it as user on the host machine if I host user has access.

So using 'findmnt' I checked available mounts. One of them was a custom mount.

<img width="1132" height="464" alt="16 - read write" src="https://github.com/user-attachments/assets/ebbd1212-34f5-485e-8045-dcd2236cd024" />

On the host machine, I had access to the mounted directory. 

So as a root on the container, I copied a bash binary to the mount and gave it a SUID privileges. 

<img width="524" height="60" alt="17 - copy" src="https://github.com/user-attachments/assets/5fbccf6a-a2fc-4e30-ad57-093e1f9164b8" />

Then on the host machine I executed it and got the root shell and flag.

<img width="1194" height="149" alt="18 - root" src="https://github.com/user-attachments/assets/c14c2549-0007-43ca-af5c-c64f84cf2d99" />

## Pwned
The machine was fully compromised.

<img width="729" height="689" alt="pwned" src="https://github.com/user-attachments/assets/7247bc8a-fb35-4223-80d4-c153cb21a372" />
