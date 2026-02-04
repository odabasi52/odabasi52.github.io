---
layout: post
title: "Busqueda - Hack The Box"
summary: "add domain to /etc/hosts → Searchor 2.4.0 → CVE-2023-43364 → Remote Code Execution (RCE) → User shell → sudo -l → Python script → Gitea username and password → Gitea Administrator → Access repositories and read code → using relative path → create malicious sh file → root"
---

# Busqueda - Hack The Box

## Enumeration
### Nmap
Initial Nmap scan revealed SSH and HTTP ports open.

<img width="1007" height="298" alt="000 - nmap output" src="https://github.com/user-attachments/assets/212537e2-9237-4428-98a9-217bf0d0c957" />

### Hosts Update
The HTTP requests were forwarded to searcher.htb so I added it to /etc/hosts file.

<img width="536" height="280" alt="001 - etc host" src="https://github.com/user-attachments/assets/a6460808-6409-486f-9004-9c2558a715d4" />

## Exploitation
### Searchor Version
The searchor version in use was vulnerable to remote code execution. I used the exploit in [this](https://github.com/nikn0laty/Exploit-for-Searchor-2.4.0-Arbitrary-CMD-Injection) github link.

<img width="1583" height="285" alt="002 - version" src="https://github.com/user-attachments/assets/3335fbab-79eb-4102-a545-01ed3a4ede27" />

<img width="1614" height="564" alt="003 - exploit" src="https://github.com/user-attachments/assets/17d8efa5-28ef-42d9-94ba-092050d8c56c" />

<img width="786" height="124" alt="004 - exploit sh" src="https://github.com/user-attachments/assets/f91b10e3-1879-4d31-b2ed-9083dd7105bf" />

<img width="829" height="265" alt="005 - got the shell" src="https://github.com/user-attachments/assets/2155eff7-3502-4b5c-ba6a-07f158ca95eb" />

### Got The User
User was compromised.

<img width="365" height="84" alt="006 - got the user" src="https://github.com/user-attachments/assets/fe87e499-dae5-4475-8fd7-0a98738f3a22" />

## Privilege Escalation
I tried some privilege escalation methods, tried some known exploits against this version but none of them worked. Then I ran linpeas and checked its output which revealed new subdomain gitea.

<img width="748" height="181" alt="007 - linpeas output gitea" src="https://github.com/user-attachments/assets/b065dee7-24e7-499b-8be6-4d2d45386180" />

Then inside the web root, I found a .git directory and config file inside it. It included clear text password of a user named cody. Cody was not available in the current linux, so I tested the password against the current svc user and got the SSH shell.

<img width="974" height="285" alt="008 - config file" src="https://github.com/user-attachments/assets/def6acd7-58b3-42e7-a88f-3c8abe0b4a7c" />

### sudo -l
Inside the SSH shell I ran sudo -l and found out I can run python3 with a specific script.

<img width="1409" height="148" alt="009 - sudo -l" src="https://github.com/user-attachments/assets/6583ae05-1133-41b5-8b1e-0e6b280f95a1" />

The script included 3 options. I used one of the options to check configurations for gitea.

<img width="1051" height="184" alt="010 - command" src="https://github.com/user-attachments/assets/a3f455ac-93a5-4bf7-b518-653321d32e76" />

<img width="731" height="245" alt="011 - gitea" src="https://github.com/user-attachments/assets/e4a87229-db77-47a2-b608-6c5f0f772fdf" />

### Gitea
The output included gitea user and password. I used this password with administrator user to login to gitea page.

<img width="1920" height="937" alt="012 - login" src="https://github.com/user-attachments/assets/ffe66410-44c4-4079-91f9-9ac7d6f69bf6" />

Now, I got access to the administrator repositories. The scripts repo included the file I can run as sudo. At first I tried to update the file but it was disallowed. Then I checked the file and found out the full-checkup option on the script run ./full-checkup.sh, this can be exploited because it is not using full path.

<img width="569" height="240" alt="013 - update" src="https://github.com/user-attachments/assets/a278f92c-9580-409b-ae56-0bb783d34567" />

I created a full-checkup.sh script which creates reverse shell.

<img width="1116" height="95" alt="014 - full checkup" src="https://github.com/user-attachments/assets/151d5d53-6cd6-4f7b-8ed8-68363fc3493c" />

Then running the full-checkup option as sudo I got the netcat shell.

<img width="748" height="269" alt="015 - root" src="https://github.com/user-attachments/assets/d0fb4c38-4bfd-4e6e-8ae3-7d6c0b8e5da8" />

## Pwned
The machine was fully pwned.

<img width="755" height="628" alt="016 - pwned" src="https://github.com/user-attachments/assets/02a9fe74-2756-4de7-834f-afbd6b94ee54" />
