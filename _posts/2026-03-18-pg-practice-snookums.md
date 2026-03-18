---
layout: post
title: "Snookums - Proving Grounds Practice"
summary: "Simple PHP Photo Gallery 0.8 → Local File Inclusion LFI → Remote File Inclusion RFI → config files (db.php) → mysql root password → base64 encoded user password → user shell → writeable passwd file (writeable /etc/passwd) → root"
---

# Snookums - Proving Grounds Practice

## Enumeration
### Nmap
Initial nmap scan revealed SSH and HTTP ports were open.

<img width="819" height="306" alt="00nmap" src="https://github.com/user-attachments/assets/83b138b0-9539-4961-9e39-a00bcd08cb78" />

### Web Enumeration
Website was `Simple PHP Photo Gallery 0.8`.

<img width="1006" height="596" alt="01web" src="https://github.com/user-attachments/assets/c48744ed-3fd4-4bdf-98c8-91b74c496c5d" />

I then searched for some exploits and found there was LFI and RFI vulnerabilities for version `0.7`. Nevertheless, I wanted to try it.
```
site.com/image.php?img= [ PAYLOAD ]
```

At first I applied directory brute forcing to be sure there are `image.php` or other endpoints. 

<img width="1000" height="690" alt="02imagephp" src="https://github.com/user-attachments/assets/bedddc39-a437-409c-943d-482c605fa2ba" />

## Exploitation
### LFI and RFI
Then I tried LFI and it worked. I saw there was a user named `michael`.

<img width="1006" height="338" alt="03LFI" src="https://github.com/user-attachments/assets/76b7784e-fd8e-4007-875c-e848e726af3e" />

Then I tried RFI and it also worked.

<img width="1384" height="756" alt="04RFI" src="https://github.com/user-attachments/assets/46c8fa44-83fc-4c45-b8b9-5f2c2677e6f9" />

So I downloaded [pentestmonkey/php-reverse-shell](https://github.com/pentestmonkey/php-reverse-shell) and updated port and ip values. I also saved it as txt file.

<img width="1483" height="390" alt="05updated" src="https://github.com/user-attachments/assets/a1aa6b04-6cd0-41df-b77d-dfd0909bdc87" />

Then I visited the website and got reverse shell.

<img width="1215" height="689" alt="06revshell" src="https://github.com/user-attachments/assets/b576a53d-e9e2-43db-9918-763a5c39bff7" />

### db.php
There was a file named `db.php` under web root. I checked it and found mysql root password. And I logged in to mysql.

<img width="892" height="574" alt="07mysql" src="https://github.com/user-attachments/assets/db492f0c-c630-43a5-b4d2-2d53e978254f" />

Then I enumerated usernames and found base64 encoded user passwords.

<img width="710" height="660" alt="08db" src="https://github.com/user-attachments/assets/3a54f88e-88d8-4596-993b-a539285a8fdf" />

Then I decoded it and logged in to SSH as michael.

<img width="1059" height="555" alt="09local" src="https://github.com/user-attachments/assets/15ce22da-bc76-4e02-bdaf-9be29c95bc11" />

## Privilege Escalation
### writeable passwd
I executed `linpeas.sh` and found that I could overwrite `/etc/passwd`.

<img width="932" height="214" alt="10passwd" src="https://github.com/user-attachments/assets/45f657a0-11c3-4483-80fd-ee143c15278c" />

So I executed below command to add a user `r00t:password`. And I switched to that user and read root flag.
```bash
pw=$(openssl passwd password); echo "r00t:${pw}:0:0:root:/root:/bin/bash" >> /etc/passwd
```

<img width="903" height="461" alt="11flag" src="https://github.com/user-attachments/assets/5538fc24-b5ba-4eec-bcdb-f8a500bc82f0" />

