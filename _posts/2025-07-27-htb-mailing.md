---
layout: post
title: "Mailing - Hack The Box"
summary: "hMailServer → Local File Inclusion (LFI) → hMailServer config file → MD5 Hash of administrator → Crackstation → SMTP login → CVE-2024-21413 → Microsoft Outlook Capture NTLMv2 Hash → Crack the hash → user shell → LibreOffice 7.4.0.1 → CVE-2023-2255 → Administrator"
---

# Mailing - Hack The Box

## Enumeration
### Nmap
Initial Nmap scan revealed that SMTP, IMAP, POP3 SMTPs, HTTP and SMB ports are open.

<img width="1189" height="857" alt="00 - nmap" src="https://github.com/user-attachments/assets/7e63638e-812d-4063-9d9b-441d3925a3de" />

### WEB Enumeration
I applied directory and vhost brute forcing which did not reveal any useful information. 

Then while checking the website I found that there is a 'download.php' file which downloads any file that is given on file parameter. So this endpoint has file disclosure vulnerability. 

I know that the website is using hMailServer, so I simply searched for hMailServer config file location and tried to access it which revealed MD5 Hash of the administrator.

<img width="1436" height="746" alt="01 - config file" src="https://github.com/user-attachments/assets/c9dccdb0-9a4f-4a2d-a71e-38fd7df7d75f" />

### Crack The Hash
Then using crackstation, I cracked the administrator hash.

<img width="1267" height="376" alt="02 - cracked" src="https://github.com/user-attachments/assets/cbe5e774-c0da-42bb-9dcf-ed378a0bae34" />

## Exploitation
### SMTP 
Using administrator credentials, I tried to login SMTP server and it worked.

<img width="704" height="80" alt="03 - test" src="https://github.com/user-attachments/assets/cb5f7e26-a44b-409e-8407-2d52d5c91fbc" />

<img width="393" height="119" alt="04 - logged in" src="https://github.com/user-attachments/assets/31420a6c-fb8a-4f2e-b8fb-98b6de3eee2d" />

### CVE-2024-21413
Now I know the target is windows and it is using mail server. So I simply searched for Windows Mailing Exploits and found an [RCE exploit](https://github.com/xaitax/CVE-2024-21413-Microsoft-Outlook-Remote-Code-Execution-Vulnerability). 
It is a vulnerability occurs from improper input validation on file protocol.

So we need to craft a mail with malicious file URL and capture the NTLMv2 Hash with responder. Below are the names that are found form website. Instructions.pdf reveals mail format 'maya@mailing.htb'. So using below names we can send each one of them a malicious mail.

<img width="1000" height="469" alt="05 - targets" src="https://github.com/user-attachments/assets/20f96a8d-12c9-4714-b4a1-9cd486b1caae" />

<img width="1892" height="148" alt="06 - send" src="https://github.com/user-attachments/assets/079636af-ced0-43ea-aa62-2b7f4fd84066" />

The maya was the one that opened the mail.

<img width="1876" height="166" alt="07 - hash" src="https://github.com/user-attachments/assets/cdd68d89-7e06-4cdb-bd91-343005940fe8" />

### Crack The Hash
So simply cracked the maya's hash.

<img width="1891" height="170" alt="08 - cracked" src="https://github.com/user-attachments/assets/8c59be27-585e-4df7-a672-bfa07f5b280c" />

### Got The User
Maya had permission to PSRemote so using 'evil-winrm', I got the user flag.

<img width="1332" height="250" alt="09 - user" src="https://github.com/user-attachments/assets/2a7f3231-bd3a-43cd-b59b-a76fe3cfd52b" />

## Privilege Escalation
### Libre Office
Libre office had vulnerable version running.

<img width="1888" height="365" alt="10 - libre version" src="https://github.com/user-attachments/assets/84d3ba52-0fe6-48e5-9975-09a61e835af4" />

So searching through internet reveals that this version can allow users to run commands with a maliciously crafted odt file. I created a file that runs nc64.exe and put it in 'Important Documents' folder, where maya had write permissions over SMB.

<img width="1027" height="43" alt="11 - malicious libre" src="https://github.com/user-attachments/assets/f0a61f23-0267-47c9-8d5e-1a776db2f6c9" />

<img width="871" height="222" alt="12 - put it" src="https://github.com/user-attachments/assets/3adfbe7e-3286-4da3-8e3f-52068e9251ef" />

### Got The Administrator Shell
Then started netcat listener, after a while I got the administrator shell.

<img width="671" height="220" alt="13 - admin shell" src="https://github.com/user-attachments/assets/f2b55353-a0b8-4841-b020-fe0178299406" />

<img width="502" height="70" alt="14 - root flag" src="https://github.com/user-attachments/assets/634191f1-fb9c-4406-8da2-a1e160a8efeb" />

## Pwned
The machine was fully compromised.

<img width="737" height="681" alt="15 - pwned" src="https://github.com/user-attachments/assets/cf3a10d6-221c-4a06-b794-b0bef6316cd4" />
