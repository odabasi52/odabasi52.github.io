---
layout: post
title: "Plum - Proving Grounds Practice"
summary: "Pluxml → Directory brute force with versioning_metafiles.txt → Pluxml 5.8.7 → Login page /core/admin → Default credentials (admin:admin) → CVE-2022-25018 → RCE as www-data → exim4 binary → check version exim4 -bV (not vulnerable) → /var/spool/mail → read mails → root"
---

# Plum - Proving Grounds Practice

## Enumeration
### Nmap
Initial nmap scan revealed SSH and HTTP ports were open.

<img width="798" height="327" alt="00 - nmap" src="https://github.com/user-attachments/assets/9ca1cd45-51bb-4815-bbb3-573200f5c8c8" />

### Web Enumeration
Website was `Pluxml` website. To understand the version I applied endpoint brute force with `versioning_metafiles.txt` file and found `README.md` file.

<img width="1046" height="415" alt="01 - versionin" src="https://github.com/user-attachments/assets/274939f1-f1ec-4434-892b-34a09b1e4e16" />

It was `Pluxml 5.8.7`

<img width="1182" height="567" alt="02 - version" src="https://github.com/user-attachments/assets/de54f3ce-6265-438a-8489-69aa6bd41d1a" />

Then I searched for login page and found it was at `/core/admin` endpoint.

<img width="1269" height="575" alt="03 - login page" src="https://github.com/user-attachments/assets/53a74f18-a9ee-44b6-b247-b7788351bfc1" />

Then I tried `admin:admin` credentials and it worked.

<img width="1284" height="676" alt="04 - login page" src="https://github.com/user-attachments/assets/04f7d6c3-1ecc-4f5d-b881-fc5d69423536" />

<img width="1284" height="538" alt="05 - logged in" src="https://github.com/user-attachments/assets/a981bdab-c45a-4fc1-9228-0cb7f469c820" />

## Exploitation
### CVE-2022-25018 
Pluxml v5.8.7 was discovered to allow attackers to execute arbitrary code via crafted PHP code inserted into static pages.

Some research revealed we could obtain RCE because this version was vulnerable. Then I found this repo ([MoritzHuppert/CVE-2022-25018](https://github.com/MoritzHuppert/CVE-2022-25018)) 
which explains how we can exploit the vulnerability.

<img width="1812" height="425" alt="06 - exploit" src="https://github.com/user-attachments/assets/575bf6aa-75d2-454e-85b1-b0f943f55c3d" />

So I simply edited a static page and put [pentestmonkey/php-reverse-shell](https://github.com/pentestmonkey/php-reverse-shell) in it by updating IP value.

<img width="1920" height="853" alt="07 - edit" src="https://github.com/user-attachments/assets/0fd1334c-142a-4322-80b7-346401f447d9" />

And visiting the static page got me reverse shell as `www-data`.

<img width="1283" height="767" alt="08 - revshell" src="https://github.com/user-attachments/assets/ab9eacb3-025a-47a2-9ee2-422ab66a6ccc" />

Then I read the local flag inside /var/www folder.

<img width="730" height="389" alt="09 - local flag" src="https://github.com/user-attachments/assets/dce64115-3dea-4e8c-bba5-d52a704c653d" />

## Privilege Escalation
### Mail (/var/spool/mail)
I checked SUID binaries and found `exim4` binary which is a mail client.

<img width="986" height="279" alt="10 - sus exim" src="https://github.com/user-attachments/assets/52b7ff78-52c2-4ed0-a5d3-1745ecfdad77" />

Then I checked its version with `exim4 -bV` and searching the version online revealed it was not vulnerable.

<img width="1089" height="257" alt="11 - exim version" src="https://github.com/user-attachments/assets/2d15bd51-2c61-4ad7-a06a-9e236da6c957" />

Later, I checked `/var/spool/mail` directory and found there was a mail record for `www-data`. So I read it and it included root password.

<img width="1552" height="427" alt="12 - mail" src="https://github.com/user-attachments/assets/8c5379be-9810-46bd-b7a4-78817687b548" />

I simply obtained root shell.

<img width="769" height="522" alt="13 - gg" src="https://github.com/user-attachments/assets/0e374524-1df7-4d28-971f-fd4fcec3ad25" />
