---
layout: post
title: "Press - Proving Grounds Practice"
summary: "FirePress 1.2.1 → admin:password default login → CVE-2022-40048 → Upload PHP shell with GIF magic bytes → fp-content/attachs endpoint → www-data shell → sudo NOPASSWD apt-get → root"
---

# Press - Proving Grounds Practice

## Enumeration
### Nmap 
Initial nmap scan revealed SSH, HTTP and port 8089 were open. Moreover, it also showed that `FirePress 1.2.1` application was running on port 8089.

<img width="961" height="447" alt="00 - nmap" src="https://github.com/user-attachments/assets/ece47507-e07c-4144-82b5-e7a22e64940d" />

### Web Enumeration
I visited the FirePress page and found a login page.

<img width="1920" height="907" alt="01 - flatpress" src="https://github.com/user-attachments/assets/c40f364e-9b10-4c6b-81a7-c035449f13a6" />

After some reaserach I found out that the default credentials for FirePress 1.2.1 was `admin:password`, so I tried it and it worked.

<img width="1920" height="980" alt="02 - admin:password default" src="https://github.com/user-attachments/assets/232996b6-10cf-4fa1-bc05-279b99c240a9" />

## Exploitation
### CVE-2022-40048
Flatpress v1.2.1 was discovered to contain a remote code execution (RCE) vulnerability in the Upload File function. 

There was an upload function on administrator dashboard. It checks file magic bytes but it does not check extensions. So I could simply update [pentestmonkey/php-reverse-shell](https://github.com/pentestmonkey/php-reverse-shell) and add GIF magic bytes (`GIF89a;`) at the beginning. Also, I updated the IP address to my tun0 IP address.

<img width="1404" height="837" alt="10 - php revshell" src="https://github.com/user-attachments/assets/94d1775c-b522-450e-859e-d68a6d8adb1d" />

Then I simply uploaded the file.

<img width="1821" height="837" alt="11 - uploading" src="https://github.com/user-attachments/assets/6c5b2d60-0a72-4191-815c-d717dd73bd24" />

<img width="1821" height="837" alt="12 - uploaded" src="https://github.com/user-attachments/assets/f6d85228-e378-4c6f-a9e9-e536d5ad67af" />

And then visited the `fp-content/attachs` endpoint which includes uploaded files.

<img width="1920" height="837" alt="13 - fp-content" src="https://github.com/user-attachments/assets/3c26ab60-f850-4c99-8aac-987573accabf" />

Then simply clicked and got reverse shell.

<img width="917" height="413" alt="06 - sudo l" src="https://github.com/user-attachments/assets/acfcc2b5-d755-4788-9bed-d93d1ffeef6b" />

## Privilege Escalation
### sudo apt-get
As it can be seen on the above netcat image, user had sudo NOPASSWD privileges over apt-get binary. 
So I simply checked [gtfobins/apt-get/](https://gtfobins.org/gtfobins/apt-get/) and applied the necessary step.

```bash
apt-get update -o APT::Update::Pre-Invoke::=/bin/sh
```

And I simply got root.

<img width="927" height="529" alt="07 - root" src="https://github.com/user-attachments/assets/7321ccf0-ed2b-4c3d-8709-a81245822522" />

