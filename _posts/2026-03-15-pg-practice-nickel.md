---
layout: post
title: "Nickel - Proving Grounds Practice"
summary: "List Processes forwarded to internal IP → Change IP → HTTP Verb Tampering (GET to POST) → base64 encoded password on command line process → SSH user shell → FTP encrypted pdf file → pdf2john → internal website → ligolo-ng → nc64.exe → Administrator"
---

# Nickel - Proving Grounds Practice

## Enumeration
### Nmap
Initial nmap scan revealed FTP, SSH and 8089 HTTP ports were open.

<img width="736" height="584" alt="Image" src="https://github.com/user-attachments/assets/9e3656ea-52db-4582-9daf-8a7a9d9caaad" />

### Website
Website at port 8089 had 3 different buttons which forward user to different endpoint on windows private IP (169..).

<img width="1115" height="741" alt="Image" src="https://github.com/user-attachments/assets/1044c113-ff84-442a-b193-31e6054f3ec6" />

So what I did is, I changed that IP to target IP and was able to access to endpoints. However there was an error `Cannot GET`.

<img width="613" height="111" alt="Image" src="https://github.com/user-attachments/assets/b8fb5455-a2a7-4131-91c9-6437ba44c0c4" />

## Exploitation
### HTTP Verb Tampering
I captured the request using Burp then I changed it to POST and I was able to access to endpoint. It showed different proccesses on target machine.

<img width="922" height="417" alt="Image" src="https://github.com/user-attachments/assets/7189499d-1c05-4925-a255-8ca1b19b444f" />

### ClearText Password on Command Line
While checking processes I found a username and a password. Password was base64 encoded so I decoded it.

<img width="921" height="317" alt="Image" src="https://github.com/user-attachments/assets/85b59a6d-b2ba-46de-bcf5-ba0fce036ee1" />

<img width="439" height="70" alt="Image" src="https://github.com/user-attachments/assets/e4456420-896d-4c56-b139-adf9501441d8" />

And then I was able to access SSH shell as user.

<img width="842" height="564" alt="Image" src="https://github.com/user-attachments/assets/138a770c-725d-4a00-9de4-fbf46b36ee8b" />

## Privilege Escalation
### FTP Encrypted PDF file (pdf2john)
There was an encrypted PDF file under FTP share.

<img width="1169" height="452" alt="Image" src="https://github.com/user-attachments/assets/00d9dcbd-3a70-4ffa-a51a-bcab5f231a25" />

So I cracked it using `pdf2john`.

<img width="1159" height="345" alt="Image" src="https://github.com/user-attachments/assets/8dbe0e1f-ac36-45f7-8c35-f5461ee7ccd7" />

It showed 3 different endpoints but first one seemed suspicious. It was a command endoint.

<img width="327" height="175" alt="Image" src="https://github.com/user-attachments/assets/ae332588-cc25-4756-b7a9-6c96de1008cd" />

### internal website
Then I executed `netstat -ano` and found internal website.

<img width="682" height="349" alt="Image" src="https://github.com/user-attachments/assets/d4e0b5fc-d491-4381-a137-a77f6234aa5f" />

### ligolo-ng
Then I used ligolo-ng agent and proxy to pivot to that internal website using special subnet `240.0.0.0/4`

<img width="847" height="113" alt="Image" src="https://github.com/user-attachments/assets/bd7cd3c9-c64a-4249-afd2-498a2900ad20" />

<img width="1165" height="403" alt="Image" src="https://github.com/user-attachments/assets/eb4aad3a-e0f2-4d1a-926a-5d180416190c" />

Then I visited the endpoint and I tried appending command to parameter `?` as we have seen on encrypted pdf file. Well it worked, I got command execution as SYSTEM.

<img width="472" height="140" alt="Image" src="https://github.com/user-attachments/assets/4cce4a50-c86d-485d-9f75-66d37aa561dc" />

### nc64.exe
So I downloaded and transfered nc64.exe and executed it to obtain SYSTEM shell and read Admin flag.

<img width="746" height="307" alt="Image" src="https://github.com/user-attachments/assets/a761fb3a-2722-4e2f-877b-0f696ab97174" />

<img width="1124" height="642" alt="Image" src="https://github.com/user-attachments/assets/f26349db-5768-48af-ad0e-dd22d21853f8" />
