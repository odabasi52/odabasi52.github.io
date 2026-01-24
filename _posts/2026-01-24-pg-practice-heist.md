---
layout: post
title: "Heist - Proving Grounds Practice"
summary: "Proxy website → SSRF → NTLMv2 Theft via SSRF using responder → enox user → bloodhound-python (bloodhound python) → Read GMSA Password privilege (ReadGMSAPassword) → svc_apache$ user → SeRestore Privilege Enabled → Exploit SeRestore using rdesktop → SYSTEM Shell"
---

# Heist - Proving Grounds Practice

## Enumeration
### Nmap 
Initial Nmap scan revealed port 8080, SMB and some common Active Directory ports were open.

<img width="1395" height="841" alt="00 - nmap" src="https://github.com/user-attachments/assets/2fb7e5e8-e301-4998-bb42-b65465b0c087" />

## Exploitation
### SSRF to NTLMv2 Theft
The website on port 8008 was a simple proxy website. However, it was vulnerable to SSRF. So I started `responder` and obtained user's NTLMv2 hash via SSRF.

<img width="1920" height="856" alt="01 - web" src="https://github.com/user-attachments/assets/70ba27ed-6f6b-4831-aea2-509d088318db" />

<img width="1356" height="695" alt="02 - ntlmv2" src="https://github.com/user-attachments/assets/efe00d4e-de88-4270-b09f-035d6a897bf9" />

Then I simply cracked it.

<img width="1919" height="722" alt="03 - cracked" src="https://github.com/user-attachments/assets/55676248-73cd-4179-b168-3159366e0568" />

And I simply logged in as the enox user and obtained the user flag.

<img width="1405" height="555" alt="05 - user flag" src="https://github.com/user-attachments/assets/9f112037-12ec-4389-9091-9d3fb8fcf3ef" />

## Lateral Movement
### Read GMSA Password
Then I ran bloodhound-python command below:
```bash
bloodhound-python -u 'enox' -p '<PASS>' -dc DC01.heist.offsec -c all -ns 192.168.158.165 -d heist.offsec --zip
```

<img width="1405" height="432" alt="06 - bloodhound python" src="https://github.com/user-attachments/assets/9c998c6f-b44c-436e-9009-010c852e2a3e" />

It revealed that the user had ReadGMSAPassword privilege over svc_apache$ account.

<img width="1405" height="542" alt="07 - readgmsa" src="https://github.com/user-attachments/assets/e0c81503-5c80-4349-80ea-e2ccc7962392" />

So I downloaded [Invoke-GMSAPasswordReader](https://github.com/ricardojba/Invoke-GMSAPasswordReader) and read the svc_apache$ user's password hash.

<img width="1110" height="375" alt="08 - gmsa" src="https://github.com/user-attachments/assets/ee2fc73b-3d00-4b28-84a4-c7c90de76485" />

Then logged in as svc_apache$ user and found out that the user had SeRestore enabled.

<img width="1408" height="465" alt="09 - logged in" src="https://github.com/user-attachments/assets/d40945c3-d522-43cc-aa0b-1c073111cee5" />

## Privilege Escalation
### SeRestore Privilege
The user had SeRestore enabled. So I did some research and found a way to exploit it. (Explanations: [https://github.com/swisskyrepo/InternalAllTheThings/blob/main/docs/redteam/escalation/windows-privilege-escalation.md](https://github.com/swisskyrepo/InternalAllTheThings/blob/main/docs/redteam/escalation/windows-privilege-escalation.md))

We should simply follow below steps:
1. Rename utilman.exe (C:\Windows\System32\utilman.exe) to utilman.old
2. Rename cmd.exe to utilman.exe
3. Open Remote Desktop. On the lock screen press Win+U

<img width="1917" height="932" alt="10 - exploitation" src="https://github.com/user-attachments/assets/d4f33cf3-1ec9-4c25-87dc-b90bc10e4dc5" />

So at first I renamed utilman.exe and cmd.exe as seen below.

<img width="737" height="80" alt="11 - exploited" src="https://github.com/user-attachments/assets/4845e08c-2dd4-4f7e-aaba-784a299b32fb" />

Then I opened `rdesktop` .

<img width="1558" height="184" alt="image" src="https://github.com/user-attachments/assets/2cefdb51-d95a-4c5f-9d2a-4404dc6c9ed7" />

Then on the lock screen I clicked Win+U on my keyboard which gave me SYSTEM shell.

<img width="1022" height="682" alt="12 -Admin flag" src="https://github.com/user-attachments/assets/111139fd-b940-42f6-9a16-9d09e01b4d56" />
