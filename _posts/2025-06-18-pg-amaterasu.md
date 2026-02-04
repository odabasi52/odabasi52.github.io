---
layout: post
title: "Amaterasu - OffSec Proving Grounds"
summary: "FTP Anonymous → web help page revealed api endpoints → Upload file endpoint → upload id_rsa.pub as authorized_keys using curl → SSH user shell → /etc/crontab cron job as root → PATH Abuse → root"
--- 

# Amaterasu - OffSec Proving Grounds

## Objective
Employ enumeration and web enumeration methods to uncover system weaknesses. Apply privilege escalation techniques and capitalize on abusing crontabs for elevated access. This lab enhances your ability to identify and exploit misconfigurations effectively.

## Enumeration
### Nmap
During the initial Nmap scan, I discovered that the FTP port was open and allowed anonymous login, but attempts to interact with the service resulted in timeouts. The scan also revealed three unusual open ports, including one running SSH and two hosting HTTP-based services.

![00 - nmap](https://github.com/user-attachments/assets/79ba8521-20fe-4d23-9b73-8a5e92290a97)

### WEB Enumeration
One of the HTTP services hosted a help page that revealed a command endpoint designed to be used in a REST API style, providing insight into how the backend could be interacted with programmatically.

![01 - commands](https://github.com/user-attachments/assets/07f9fa58-23c0-4422-bad1-62b6f6acabd7)

One of the commands exposed via the help page allowed directory listing, which led to the discovery of a user named alfredo.

![02 - user alfredo](https://github.com/user-attachments/assets/ec79329f-8754-4b0a-b69f-5f79a608671c)

Another command allowed file uploads, which by default placed files in the /tmp directory. However, I discovered a path traversal vulnerability that enabled uploading files to any location where we had write permissions.

## Exploitation
Using this knowledge, I generated an id_rsa and id_rsa.pub key pair. Since the upload functionality did not allow files with a .pub extension, I renamed id_rsa.pub to id_rsa.txt. Then, leveraging the path traversal vulnerability, I uploaded the file to /home/alfredo/.ssh/authorized_keys.

As you may know, the authorized_keys file contains a list of public keys authorized to access the SSH service for that user. By adding my public key to this file, I was able to authenticate and gain SSH access as the user alfredo.

![03 - created a ssh key](https://github.com/user-attachments/assets/3172d9f2-e9c4-4bb8-b7ac-693f2d8421dd)

![04 - uploaded id_rsa pub as authorized_keys](https://github.com/user-attachments/assets/58b9bc6f-b5da-40ac-aed6-ecc40687af7c)

After successfully adding my key, I was able to SSH into the system as the alfredo user and retrieve the user flag.

![05 - user flag](https://github.com/user-attachments/assets/d2d54009-1aca-4608-8e07-72c05649a672)

## Privilege Escalation
Once inside the SSH shell as alfredo, I checked the /etc/crontab and noticed that a backup script was being executed every minute by the root user.

The script executed by the root user's cron job was quite simple. It first exported a custom PATH environment variable, placing /home/alfredo/restapi at the beginning. Then, it used standard commands like cd and tar to create a backup archive.

![06 - crontab](https://github.com/user-attachments/assets/118067ff-85ec-4ceb-999e-d995430a675a)

Since the script relied on tar and cd without specifying their full paths, and prioritized /home/alfredo/restapi in the PATH, I was able to abuse this by placing a malicious script named tar (or cd) in that directory. My custom tar script executed chmod +s /bin/bash, effectively giving the system’s bash binary the SUID bit and allowing root shell access.

After placing the malicious tar script in /home/alfredo/restapi, I waited for one minute for the cron job to execute. Once the script ran and set the SUID bit on /bin/bash, I simply ran /bin/bash -p to spawn a root shell. From there, I was able to read the root flag.

![07 - root](https://github.com/user-attachments/assets/43ccabf4-f664-465a-bb45-70d6a5ab3353)
