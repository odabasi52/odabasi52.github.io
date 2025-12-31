---
layout: post
title: "CozyHosting - Hack The Box"
summary: "Spring Boot actuator endpoint discovery → actuator/sessions enumeration for valid JSESSIONID → kanderson user session hijacking → executessh command injection (tab encoding via \\t or ${IFS} bypass) → reverse shell as app user → JAR file extraction and analysis → application.properties database credentials → PostgreSQL access and users table enumeration → password hash cracking (admin credentials) → SSH access → sudo ssh via GTFOBins"
---

# CozyHosting - Hack The Box

## Enumeration
### Nmap 
Initial nmap scan revealed HTTP and SSH ports were open.

<img width="783" height="348" alt="00 - nmap" src="https://github.com/user-attachments/assets/6b76f3fa-6a4d-4507-9720-7b14bbcb8cfd" />

### Web Enumeration
The web request was forwarded to cozyhosting.htb, so I added it to /etc/hosts file.

<img width="998" height="393" alt="01 - website" src="https://github.com/user-attachments/assets/37ed7cc5-9931-47e4-bcd2-c24bf84201a1" />

Then I applied standard directory brute forcing and found an error page.

<img width="1250" height="312" alt="02 - spring boot error page" src="https://github.com/user-attachments/assets/6665ba5a-32b5-40c6-b318-d74fe03100cf" />

Searching this page revealed that this was a spring boot application.

<img width="1677" height="829" alt="03 - spring boot" src="https://github.com/user-attachments/assets/f820148e-8b02-4111-b6f3-efc0fa206971" />

Then I applied directory brute forcing with the spring boot specific wordlists and found a valid endpoint named actuator.

<img width="1267" height="808" alt="04 - dirbuster" src="https://github.com/user-attachments/assets/44b609f9-7756-4118-99d4-f2052b234789" />

This endpoint included some URLs.

<img width="1263" height="649" alt="05 - urls" src="https://github.com/user-attachments/assets/04272818-f6fe-4f52-974a-67fa815b57bd" />

The actuator/sessions path contained some valid session cookies.

<img width="1181" height="231" alt="06 - sessions" src="https://github.com/user-attachments/assets/ff38bbe8-fbb6-475c-abb5-682768fa37ef" />

Then I passed the session cookie and logged in as the kanderson user.

<img width="1920" height="881" alt="07 - cookie update and login" src="https://github.com/user-attachments/assets/b0e312af-4f8c-4674-8f1a-d6545eb03b46" />

## Exploit
### Command Injection
The wabsite included executessh functionality. At first I tried some command injection methods and it did not work. Later I understood that it was avoiding whitespaces. So I encoded a tab (\t) and it worked. The ${IFS} also works to avoid whitespaces.

<img width="1920" height="853" alt="08 - command injection" src="https://github.com/user-attachments/assets/0459195e-3b6f-4ad3-8c9b-42b00602753d" />

Then I created a reverse shell payload and got a reverse shell.

<img width="1810" height="720" alt="09 - revshell" src="https://github.com/user-attachments/assets/15e8c3ed-c907-46ec-8368-e72a3b39a044" />

After the initial connection, I was in app directory which included a JAR file. I transfered that file to my machine, and unzipped it.

The file was spring boot application's JAR file. Later, I did some research and found that application.properties file includes some configurations related to the web app. So I checked that file and found a database and its password.

<img width="650" height="232" alt="10 - psql infos" src="https://github.com/user-attachments/assets/ad901d0d-47ac-40e3-8e31-bc1221ab5fb7" />

Then using 'psql' command with the necessary parameteres, I got an interactive PostgreSQL shell. Checking the tables revealed the users table.

<img width="756" height="344" alt="11 - sql" src="https://github.com/user-attachments/assets/a5dffbf9-d968-4c6f-8d6c-201e958f3bc6" />

And the users table included hashed passwords of users.

<img width="699" height="192" alt="12 - passwords" src="https://github.com/user-attachments/assets/b60b68ee-f002-4871-87bc-b0a1170b7494" />

Then I cracked admin hash with hashcat and rockyou.txt wordlist.

<img width="662" height="105" alt="13 - cracked" src="https://github.com/user-attachments/assets/fb0c237f-5c20-400f-9cbe-cdfae467927d" />

Then used this password to login with SSH and got the user flag.

<img width="721" height="618" alt="14 - user flag" src="https://github.com/user-attachments/assets/a39b380e-e845-440d-a084-401bc535a5e5" />

## Privilege Escalation
The user could run SSH with sudo privileges. The [GTFOBins](https://gtfobins.github.io/gtfobins/ssh/) included sudo ssh privilege escalation. I simply applied the necessary steps and got the root.

<img width="1041" height="206" alt="15 - root" src="https://github.com/user-attachments/assets/6b29e5cf-edb4-4334-98b3-e5fb603828d9" />

## Pwned
The machine was pwned.

<img width="727" height="701" alt="pwned" src="https://github.com/user-attachments/assets/66ff550d-1089-4c30-babe-3dd82e4e516f" />
