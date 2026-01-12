---
layout: post
title: "Image - Proving Grounds Practice"
summary: "ImageMagick 6.9.6-4 → CVE-2023-34152 → Remote Code Execution → Strace SUID → root"
---

# Image - Proving Grounds Practice

## Enumeration
### Nmap 
Initial Nmap scan revealed SSH, HTTP ports were open.

<img width="968" height="408" alt="image" src="https://github.com/user-attachments/assets/6c6d6cf7-b13b-4161-a854-ea80b665652c" />

### Web Enumeration
Visiting the website revealed ImageMagick application.

<img width="1919" height="351" alt="01 - web" src="https://github.com/user-attachments/assets/2df9e47e-5920-4465-8bfb-dd6c8ebe8782" />

And I uploaded a random image file, which revealed the version of ImageMagick, 6.9.6-4

<img width="1919" height="442" alt="02 - version" src="https://github.com/user-attachments/assets/5213261d-287b-4eaa-b919-84a0365e75fd" />

## Exploitation
### CVE-2023-34152
A vulnerability was found in ImageMagick. This security flaw cause a remote code execution vulnerability in OpenBlob with --enable-pipes configured.

Searching this version revealed this CVE number. Further searching showed that there was an [exploit](https://github.com/SudoIndividual/CVE-2023-34152) available.

<img width="1919" height="744" alt="03 - exploit" src="https://github.com/user-attachments/assets/e541ba90-6052-4689-8f15-035a172ee191" />

I simply run the exploit. It created a malicious PNG file.

<img width="1270" height="258" alt="04 - exploiting" src="https://github.com/user-attachments/assets/e286c609-0764-48a4-a678-138833a05a5b" />

And uploading it gave us www-data shell.

<img width="1577" height="742" alt="05 - shell" src="https://github.com/user-attachments/assets/62d9f7a1-05c4-45fd-ba8f-ff28bebac817" />

And I simply got the local flag in /var/www 

<img width="695" height="266" alt="06 - local flag" src="https://github.com/user-attachments/assets/14e00e83-43ba-4b20-a077-3e4a0e214cb8" />

## Privilege Escalation
### Strace SUID
Running SUID checks with the below command revealed strace had SUID privileges.
```bash
find / -user root -perm -4000 -exec ls -ldb {} \; 2>/dev/null
```

<img width="1033" height="284" alt="07 - strace suid" src="https://github.com/user-attachments/assets/8f9d27e0-79b3-4e36-ae5d-eb11694042cd" />

So I simply followed the steps given in [gtfobins](https://gtfobins.github.io/gtfobins/strace/) and got the root.

<img width="683" height="137" alt="08 - root flag" src="https://github.com/user-attachments/assets/9c348681-3510-42db-81be-1ab37a2674c6" />
