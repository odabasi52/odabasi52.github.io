---
layout: post
title: "Blackfield - Hack The Box"
summary: "SMB Null → User list → kerbrute → AS-REP Roasting → Hashcat to crack AS-REP Ticket → ForceChangePassword on a user → SMB Share → lsass.dmp → NTLM Hash of a user → user shell → SeBackupPrivilege → Administrator"
---

# Blackfield - Hack The Box

## Enumeration
### Nmap
The Nmap scan revealed open ports for SMB, LDAP, and Kerberos, which likely indicates that the target is a Domain Controller.

<img width="1315" height="590" alt="00 - nmap" src="https://github.com/user-attachments/assets/c0d252ff-1969-48d8-997b-e86f977b28b0" />

### SMB
There was an anonymous SMB session to the profiles$ share, which revealed multiple usernames.

<img width="1093" height="549" alt="01 - smb shares" src="https://github.com/user-attachments/assets/9adbe6a1-b3f9-4db0-8e29-f61906e16107" />

<img width="806" height="560" alt="02 - profiles" src="https://github.com/user-attachments/assets/64ca2ea5-7623-4800-a1bc-dcccc288b32e" />

### Kerbrute and AS-REP Roasting
Using the extracted usernames, I performed Kerberos user enumeration with Kerbrute. Only three users were valid, and one of them had Kerberos pre-authentication disabled, allowing me to perform an AS-REP Roasting attack and obtain the user's ticket.

<img width="1771" height="451" alt="03 - valid creds" src="https://github.com/user-attachments/assets/2bb7c1d6-3510-4735-ad15-a9634284b8fa" />

I then used Hashcat to crack the AS-REP ticket and successfully retrieved the user's plaintext password.

<img width="649" height="54" alt="04 - cracking" src="https://github.com/user-attachments/assets/83c45207-00e3-4216-bd97-f69a030e5490" />

<img width="1882" height="151" alt="05 - cracked" src="https://github.com/user-attachments/assets/d93cae6e-77c0-4b40-80c3-a134b336f33e" />

## Exploitation
### ForceChangePassword
Using the obtained credentials, I ran BloodHound-python since a remote session could not be established. Analysis in BloodHound revealed that the user had the ForceChangePassword permission over the audit2020 account, which allowed me to change its password without knowing the original one.

<img width="971" height="167" alt="06 - force change" src="https://github.com/user-attachments/assets/4d0e35f7-c7d5-404a-bb55-c01db36f0e8f" />

<img width="1122" height="69" alt="07 - update password" src="https://github.com/user-attachments/assets/89260100-7dc6-45b8-9d55-e7be17843395" />

### SMB Again
The audit2020 user had access to another share containing an lsass.dmp file. I extracted it and retrieved the NTLM hash of a user with PSRemoting privileges.

<img width="1654" height="277" alt="08 - SMB Share" src="https://github.com/user-attachments/assets/f57b79da-303c-4eee-8109-9326da842832" />

<img width="829" height="487" alt="09 - got the hash" src="https://github.com/user-attachments/assets/835bdfb4-5e8d-4263-a4e6-f2fd1b89da4e" />

### Got The User
Using the extracted hash, I established a WinRM session and obtained the user flag.

<img width="1317" height="650" alt="10 - user" src="https://github.com/user-attachments/assets/da357344-6b72-408a-9d04-ab8736909d33" />

## Privilege Escalation
### First Way
The compromised user had the SeBackupPrivilege right, so I followed the technique outlined in [k4sth4/SeBackupPrivilege](https://github.com/k4sth4/SeBackupPrivilege) to dump the ntds.dit and SYSTEM hive files.

<img width="1266" height="631" alt="11 - backup" src="https://github.com/user-attachments/assets/9ffe304e-cfe9-4c10-b228-aced033a32df" />

I then used secretsdump.py to extract NTLM hashes from the dumped ntds.dit and SYSTEM files.

<img width="1194" height="310" alt="12 - ntds dit" src="https://github.com/user-attachments/assets/3ffc9712-87e3-43ea-8803-470dfd988f60" />

### Second Way
As an alternative method, I applied the same SeBackupPrivilege technique to obtain the SECURITY, SYSTEM, and SAM hive files, and used secretsdump.py again to extract local account hashes.

<img width="1885" height="557" alt="13 - sec sam system" src="https://github.com/user-attachments/assets/8e6c6f4b-cd87-4767-ab4e-2f170c217579" />

## Pwned
At this point, the machine was fully compromised.

<img width="773" height="668" alt="pwned" src="https://github.com/user-attachments/assets/5a25b8f5-bb90-4589-a8c8-d65e159cf64e" />






