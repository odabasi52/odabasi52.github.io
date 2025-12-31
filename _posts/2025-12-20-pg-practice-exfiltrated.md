---
layout: post
title: "Exfiltrated - Proving Grounds Practice"
summary: "Subrion CMS v4.2.1 discovery → default credentials (admin:admin) → Subrion RCE exploitation → restricted webshell bypass via pentest monkey phar file upload → pspy64 process monitoring → cron job running as root with exiftool → CVE-2021-22204 exiftool djvu command injection → malicious image creation and upload → SUID bash privilege escalation"
---

# Exfiltrated - Proving Grounds Practice

## Enumeration
### Nmap 
Initial nmap scan revealed HTTP and SSH ports were open.

<img width="1015" height="454" alt="00 - nmap" src="https://github.com/user-attachments/assets/c3a29770-1380-4875-b516-f81e002594f0" />

### WEB Enumeration
When I visited the website I was forwarded to exfiltrated.offsec domain so I updated /etc/hosts file.

<img width="1345" height="211" alt="01 - domain name" src="https://github.com/user-attachments/assets/0c67e859-841d-406a-909a-e54e9f97a579" />

<img width="999" height="211" alt="02 - etc hosts" src="https://github.com/user-attachments/assets/cc2af388-d9d1-4e09-b584-a7a63997f760" />

Then searched the website and found admin panel which uses Subrion CMS v 4.2.1

<img width="1920" height="920" alt="03 - admin panel" src="https://github.com/user-attachments/assets/19995efd-9d3d-46c9-8815-6c965b18f6cb" />

Then tried credentials admin:admin and it worked.

<img width="1920" height="898" alt="04 - admin admin" src="https://github.com/user-attachments/assets/486381c6-f0f8-4804-9370-b81dc2fbc613" />

## Exploitation (Directly Root)
### Getting Shell as www-data
Then I searched this version and found it was vulnerable to RCE.

<img width="1919" height="917" alt="05 - exploit" src="https://github.com/user-attachments/assets/850e6f77-3620-416a-9717-372bb4b1d37b" />

I simply ran the exploit and got a webshell.

<img width="1140" height="536" alt="06 - revshell" src="https://github.com/user-attachments/assets/422ea929-b36c-483f-a332-9a2ae047ebbf" />

However, webshell was restricted I could not enumerate the host. So I uploaded pentest monkey reverse shell as phar file and changed to that shell.

<img width="772" height="246" alt="07 - pentestmonkey" src="https://github.com/user-attachments/assets/6e61281e-ba51-490b-a9bb-738f8c170fc4" />

<img width="1426" height="137" alt="08 - shell par" src="https://github.com/user-attachments/assets/7cbf775e-b966-417a-aeb9-91816a37f6e8" />

<img width="1192" height="831" alt="09 - updated shell" src="https://github.com/user-attachments/assets/eb2949bb-a086-4a1b-8b22-a3820318841b" />

### pspy64
Then I tried many privilege escalation methods and none of them worked. I later ran pspy64 and found out a cron was running as root.

<img width="869" height="219" alt="10 - pspy64 root" src="https://github.com/user-attachments/assets/a1e2b64f-5b0b-4ec7-8d6e-cef512e145df" />

I then checked that sh file and found that it was using exiftool to read metadata of files.

<img width="863" height="428" alt="11 - exif sh" src="https://github.com/user-attachments/assets/e509514b-6bf4-450e-8e9f-9b05a9aa3277" />

### CVE-2021-22204
Then I searched the internet and found this [INE Post](https://ine.com/blog/exiftool-command-injection-cve-2021-22204-exploitation-and-prevention-strategies) which explains a privilege escalation vector through exiftool.
It was simply command injection because of the improper handling of djvu files.

Then I found [jpg image creator](https://github.com/UNICORDev/exploit-CVE-2021-22204/blob/main/exploit-CVE-2021-22204.py) for this exploit and I executed it to create malicious image file.

<img width="1165" height="416" alt="12 - dejavu img" src="https://github.com/user-attachments/assets/c4a1004e-b293-44f3-8625-84acc6290cdb" />

Then uploaded this file to folder where the cron script reads jpg files from. Waited 1 minute and the cron script got executed. Then I simply exploited SUID bit in bash and got root shell.

<img width="1165" height="683" alt="13 - got the root" src="https://github.com/user-attachments/assets/be740dcc-2efe-47ed-81e0-56f51a6abc49" />
