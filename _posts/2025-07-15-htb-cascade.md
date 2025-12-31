---
layout: post
title: "Cascade - Hack The Box"
summary: "Enumerated anonymous LDAP extracting users, validated with Kerbrute, grepped LDAP output for 'passw' and 'pwd' to find legacyPwd attribute with r.thompson credentials, accessed SMB share with thompson user, found HTML revealing deleted TempAdmin had Administrator password, discovered VNC log file with encrypted HEX password, decrypted via VNCDecrypt to get s.smith credentials, gained Evil-WinRM shell, analyzed logon script pointing to Audit$ share, found SQLite database with encrypted ArkSvc password, reverse engineered .NET executable and DLL to find decryption algorithm, decrypted password via CyberChef, used ArkSvc in AD Recycle Bin group to query deleted TempAdmin object and recover administrator password."
---

# Cascade - Hack The Box

## Enumeration
### Nmap
The Nmap scan revealed open ports for SMB, LDAP, and Kerberos, which strongly suggests that the target is a Domain Controller.

<img width="1394" height="731" alt="00 - nmap" src="https://github.com/user-attachments/assets/9098a636-87b7-4fdd-862d-77f6bd949633" />

### LDAP Anonymous
Anonymous LDAP was enabled, so using ldapsearch did anonymous search which revealed list of users. Then using kerbrute validated them.

<img width="1392" height="61" alt="01 - anon ldap userList" src="https://github.com/user-attachments/assets/aabdfeda-b14d-4a9c-ab1c-85dd01b8e35a" />

<img width="1267" height="499" alt="02 - valid users" src="https://github.com/user-attachments/assets/5b2a9cb2-8b12-4538-a5a4-53cb2275f512" />

Did some brute force but got nothing. Then returned to the ldapsearch and tried to grep 'passw', 'pwd' and it returned a legacyPwd option. Then using -A and -B options got the username for that passwords.

<img width="1302" height="695" alt="03 - ldapsearch" src="https://github.com/user-attachments/assets/7a3bfc5e-b37a-4437-9ffa-4a839fee2e63" />

<img width="1498" height="449" alt="03 - ldapsearch 2" src="https://github.com/user-attachments/assets/1fa9003f-62c9-4137-a72f-f0f4e116155e" />

## Exploitation
### SMB Shares
This user did not have PSRemote permissions so I could not get a shell, but it could read some unusual shares.

<img width="1713" height="293" alt="04 - smb shares with thompson" src="https://github.com/user-attachments/assets/276fb135-96c9-4d2c-aa38-f74c112f5f23" />

Inside the Data share I found some log and html files. The one html file revealed that 'TempAdmin' user was deleted but its password was same as Administrator's.

<img width="1374" height="159" alt="05 - TempAdmin" src="https://github.com/user-attachments/assets/51901215-aa45-42e8-b0a4-ad0f8db37524" />

### VNC Decrypt
Then again inside the Data share under the s.smith user's directory, found a VNC log file. It included VNC password as HEX value. So I used [this](https://github.com/billchaison/VNCDecrypt) technique to decrypt VNC password and get cleartext of s.smith.

<img width="1310" height="722" alt="06 - vnc password can be decrypted" src="https://github.com/user-attachments/assets/a3c779f5-41a6-4813-91cb-880a2f6a029c" />

<img width="1792" height="119" alt="07 - decrypted vnc password" src="https://github.com/user-attachments/assets/97ea9c70-d61a-4857-87cb-45440747da33" />

### Evil-WinRM
This user had PSRemote permission. So I got the shell and user flag.

<img width="1328" height="274" alt="08 - got the user" src="https://github.com/user-attachments/assets/48934163-3f59-4839-9b83-f60236143469" />

## Lateral Movement
### Checking User
Using 'net user' command, I found out that the user has logon script.

<img width="874" height="561" alt="09 - logon script" src="https://github.com/user-attachments/assets/98413bc5-7084-43db-9fb2-4947b987a002" />

So by default, logon scripts are stored in NetLogon share. I connected the share, downloaded the script and analyzed it. It revealed new share called 'Audit$'.

<img width="1186" height="537" alt="09 - logon script 2" src="https://github.com/user-attachments/assets/ed82007e-5fdd-4270-aa13-25263d4c34f5" />

### SQLite
The Audit share contained an SQLite DB. I downloaded that DB and analyzed it. It revealed encrypted password for the ArkSvc user.

<img width="1038" height="504" alt="10 - Audit DB" src="https://github.com/user-attachments/assets/0935c756-6116-4c22-9576-a9605e5a7596" />

<img width="661" height="335" alt="11 - ldap encrypted" src="https://github.com/user-attachments/assets/cea5c4a4-b51b-4bc6-a1ad-2e5e62603103" />

### Reverse Engineering
The Audit share also included .NET executable and a DLL file. Using ILSpy, I reverse engineered them. It contained Decryption algorithm for the password that I got from the SQLite DB.

<img width="1918" height="875" alt="12 - reversed" src="https://github.com/user-attachments/assets/d9f86b5b-c729-4045-a0fd-aa93ca3c409e" />

<img width="1915" height="1011" alt="13 - reversed dll" src="https://github.com/user-attachments/assets/c757a5cf-84dd-4e50-9790-f2880f88c9b2" />

So using the same logic, I applied decryption on cyberchef and got the cleartext password.

<img width="1920" height="878" alt="14 - decrypted" src="https://github.com/user-attachments/assets/0e84a1bd-a7d8-4216-88ac-8e2076c21f39" />

## Privilege Escalation
### AD Recycle Bin
The ArkSvc user was in 'AD Recycle Bin' group which has permissions to read properties of deleted objects. (You can checkout [this](https://github.com/ivanversluis/pentest-hacktricks/blob/master/windows/active-directory-methodology/privileged-accounts-and-token-privileges.md) site)

<img width="1839" height="741" alt="15 - adrecyclebin" src="https://github.com/user-attachments/assets/095dd359-a16b-4a58-8a77-8739b0dcca3c" />

So, I ran the command to read the properties of 'TempAdmin' which I know it had same password as Administrator.

<img width="1236" height="58" alt="16 - 0 ad bin" src="https://github.com/user-attachments/assets/39bdc2e0-d6ff-426c-909d-f7d9c41aac96" />

<img width="1345" height="628" alt="16 - Temp Admin" src="https://github.com/user-attachments/assets/975a2c21-f2dc-4cfb-b43e-64ab2ffc8d1f" />

### Got The Root
Then simply logged in as Administrator and got the root flag.

<img width="1327" height="247" alt="17 - gg" src="https://github.com/user-attachments/assets/5616c175-6eed-441a-b9b2-3e7d7e5b17b6" />

## Pwned
The machine was fully compromised.

<img width="754" height="695" alt="pwned" src="https://github.com/user-attachments/assets/c3b04613-d7c6-4a95-a5b4-593a9dcda41d" />




