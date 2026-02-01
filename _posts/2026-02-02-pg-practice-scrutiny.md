---
layout: post
title: "Scrutiny - Proving Grounds Practice"
summary: "TeamCity 2023.05.4 → CVE-2024-27198 → debug mode error fix → Remote Code Execution → TeamCity user commits → Found id_rsa → ssh2john to crack id_rsa → /var/mail to read mail and find cleartext password → .~ hidden file to find password → sudo NOPASSWD privileges over systemctl → !sh method → root"
---

# Scrutiny - Proving Grounds Practice

## Enumeration
### Nmap 
Initial nmap scan revealed SSH, HTTP and SMTP were open.

<img width="1463" height="558" alt="image" src="https://github.com/user-attachments/assets/a27e17e6-b650-456a-b0ae-f3d73beed45c" />

### WEB Enumeration
Website was static. However, login page redirected us to `teams.onlyrands.com`. 

<img width="1920" height="980" alt="01 - web" src="https://github.com/user-attachments/assets/3f5b5b52-1578-4277-b916-466f9d66f005" />

So I added `teams.onlyrands.com` to `/etc/hosts` file.

<img width="422" height="113" alt="02 - hosts" src="https://github.com/user-attachments/assets/14724774-631a-4919-a537-121c44108c9c" />

And visiting the page revealed that it was `TeamCity 2023.05.4` site.

<img width="1918" height="811" alt="03 - teams website" src="https://github.com/user-attachments/assets/9739a7eb-b2c3-422d-ac94-4c6b38005794" />

## Exploitation
### CVE-2024-27198
In JetBrains TeamCity before 2023.11.4 authentication bypass allowing to perform admin actions was possible.

So I used `searchsploit` and found an exploit.

<img width="1889" height="286" alt="04 - sus" src="https://github.com/user-attachments/assets/e7dd7d6f-d082-45d4-9261-d54cb2f2cf4a" />

Then executed it and created a new administrator user.

<img width="932" height="641" alt="05 - exploited" src="https://github.com/user-attachments/assets/b26d5aa0-2138-4821-b2c7-76db31e255f5" />

Then simply logged in.

<img width="1920" height="752" alt="06 - logged in" src="https://github.com/user-attachments/assets/f5cdd93c-c7ea-41b1-8f7b-b11db26bc361" />

### Git commits
While checking user commits I found a commit message Oops which seemed suspicious.

<img width="1920" height="839" alt="07 - oops" src="https://github.com/user-attachments/assets/a2a21b3d-4ef7-4882-b8a1-d1bc6c7aa0ea" />

Then checked it and found that marco accidentally pushed his id_rsa file.

<img width="1920" height="839" alt="08 - id_rsa" src="https://github.com/user-attachments/assets/2c1eba95-d955-41e2-91d1-b3a57419f3b2" />

<img width="1920" height="839" alt="09 - id_rsa" src="https://github.com/user-attachments/assets/170b38dd-656c-4ef8-9dbd-e77a62a82513" />

### ssh2john (crack id_rsa)
Then I simply tried to login with it but it asked for a password.

<img width="802" height="146" alt="10 - asked password" src="https://github.com/user-attachments/assets/c19e86ce-4623-4e32-be88-78819458268e" />

So I used `ssh2john` and then john with `rockyou.txt` to crack the id_rsa.

<img width="944" height="322" alt="11 - cracked ssh2john" src="https://github.com/user-attachments/assets/688d94cf-9886-4352-a476-3688b75e8bf2" />

Then simply logged in.

<img width="875" height="682" alt="12 - logged in" src="https://github.com/user-attachments/assets/8fe57efb-48e4-4061-8fa2-afd3c880b839" />

### Local Flag
There were no user flags. Then I used hint and fount out we could obtain webshell with `CVE-2024-27198` exploitation. So I found this exploitation [https://github.com/passwa11/CVE-2024-27198-RCE](https://github.com/passwa11/CVE-2024-27198-RCE)

<img width="1916" height="782" alt="20 - exploit" src="https://github.com/user-attachments/assets/d686d880-1bcf-43a3-b158-ad0a8e085e83" />

Then ran it but it gave error because it was not in debug mode. We could not execute commands.

<img width="1920" height="417" alt="21 - error" src="https://github.com/user-attachments/assets/c8224315-d581-4ce0-a6fc-abfb2a67925f" />

However, we could open debug mode by applying below steps:
```bash
## GET TOKEN
curl -X POST http://teams.onlyrands.com/app/rest/users/id:24/tokens/RPC2 -u mzo3aj43:X8UypsbuXc
export TOKEN=<TOKEN>

curl -X POST 'http://teams.onlyrands.com/admin/dataDir.html?action=edit&fileName=config%2Finternal.properties&content=rest.debug.processes.enable=true' -H "Authorization: Bearer $TOKEN"
curl 'http://teams.onlyrands.com/admin/admin.html?item=diagnostics&tab=dataDir&file=config/internal.properties' -H "Authorization: Bearer $TOKEN"
```

<img width="1920" height="338" alt="22 - error fix" src="https://github.com/user-attachments/assets/6af8e0d9-df61-43bf-bbc5-cf0c24da853b" />

And debug mode was enabled. We could execute commands.

<img width="1143" height="643" alt="24 - rce" src="https://github.com/user-attachments/assets/9ef83050-bfd0-46a8-9cd5-677b5460f34a" />

I simply read local flag.

<img width="413" height="126" alt="25 - local flag" src="https://github.com/user-attachments/assets/166907ff-c938-43e6-8af1-15ef71efd16c" />

## Privilege Escalation
### Mail
Then I executed linpeas and found out there were readable mails on /var/mail folder. So I read it and found a cleartext password.

<img width="1613" height="513" alt="32 - password" src="https://github.com/user-attachments/assets/98a11ef7-852b-4f38-b948-070cc2fe6636" />

### Hidden file
Then with matthewa user I executed `ls -la` on home directory and found a non usual file `.~` which included a password.

<img width="1299" height="324" alt="33 - dach" src="https://github.com/user-attachments/assets/7d07cf6f-c64b-4262-bc51-4cd85dbe4be4" />

However, I did not know Dach user so I checked `/etc/passwd` and found out it was briand.

<img width="724" height="64" alt="34 - 0 dach briand" src="https://github.com/user-attachments/assets/18ecac2c-4b70-4e0e-b148-434773bf112c" />

### sudo systemctl
Brian had NOPASSWD sudo privileges over systemctl.

<img width="1255" height="220" alt="34 - briand" src="https://github.com/user-attachments/assets/b7c807b0-49e3-46ee-80e3-fabd1e42a78f" />

I simply executed it and then used `!sh` method.

<img width="1920" height="666" alt="35 - gg" src="https://github.com/user-attachments/assets/4556d6d8-1117-41a3-bb4d-74ab20ff4347" />

