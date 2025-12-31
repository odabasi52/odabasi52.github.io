---
layout: post
title: "Pelican - Proving Grounds Practice"
summary: "SMB null enumeration (no useful shares) → Exhibitor application discovery on port 8080/8081 → Exhibitor RCE vulnerability exploitation → reverse shell access → sudo NOPASSWD gcore privilege discovery → password-store process enumeration via ps aux → gcore process memory dump of password-store → plaintext root password extraction from memory dump → root shell access"
---

# Pelican - Proving Grounds Practice

## Enumeration
### Nmap 
Initial Nmap scan revealed Port 8080, 8081, SMB and SSH ports were open.

<img width="1054" height="700" alt="00 - nmap" src="https://github.com/user-attachments/assets/4333dc02-e80c-4578-b3b7-730679c560ce" />

### SMB NULL
SMB Guest login was enabled, but no useful share was available.

<img width="1291" height="202" alt="01 - smb guest login" src="https://github.com/user-attachments/assets/00b806ce-853b-4046-ad0e-9bb88c209e04" />

### WEB Enumeration
Visited website at port 8081, which forwarded me to port 8080. It was Exhibitor application.

<img width="1915" height="508" alt="02 - 8081 to exhibitor" src="https://github.com/user-attachments/assets/ed19284c-1151-4b5b-a3cd-f664b07b9961" />

I searched the version and found out it had RCE vulnerability.

<img width="1915" height="846" alt="03 - exploit" src="https://github.com/user-attachments/assets/65533faf-2576-4c73-be94-46ea652f85d6" />

## Exploitation
I simply followed the steps and executed the exploit and got a reverse shell.

<img width="1915" height="932" alt="04 - revshell" src="https://github.com/user-attachments/assets/936da48f-c185-427c-a0cb-53a294d451d4" />

<img width="792" height="225" alt="05 - got the shell" src="https://github.com/user-attachments/assets/e1c7d499-93c1-4d2f-8f39-5f23cc7e9ae5" />

Then I read the user flag.

<img width="822" height="324" alt="06 - user flag" src="https://github.com/user-attachments/assets/497f3422-4144-4c6c-a68e-f1f3e71057cf" />

## Privilege Escalation
User had sudo privileges on gcore binary.

<img width="855" height="187" alt="07 - sudo l" src="https://github.com/user-attachments/assets/2d3a2f64-fed7-47b4-8f50-75791a64a0f1" />

### Gcore exploitation
After analyzing the [https://gtfobins.github.io/gtfobins/gcore/](https://gtfobins.github.io/gtfobins/gcore/), I understood that gcore is used to dump process memory. 

So, I analyzed processes with 'ps aux' and found that one process is named password-store.

<img width="855" height="187" alt="08 - suspicious password " src="https://github.com/user-attachments/assets/c43c57ba-9ebb-4d80-bdea-2c08b4ff7118" />

So I used my sudo privileges and dumped that process.

<img width="948" height="279" alt="09 - gcore" src="https://github.com/user-attachments/assets/1d8e3596-39d6-4734-8ff5-82ee67f02ea4" />

Then analyzed the dump and found a plaintext password.

<img width="815" height="515" alt="10 - sus" src="https://github.com/user-attachments/assets/f34c6422-8475-4581-91a9-2c46d72f0e35" />

The password was root password, so I simply got root shell.

<img width="1058" height="768" alt="11 - root" src="https://github.com/user-attachments/assets/b5b2ab9e-340c-4496-80da-f65a4402a908" />
