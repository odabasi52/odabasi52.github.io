---
layout: post
title: "Manager - Hack The Box"
summary: "Leveraged SMB IPC$ null session read access for RID brute-forcing to enumerate domain users, created custom password list with username variations, brute-forced SMB credentials to find valid login, authenticated to MSSQL with found credentials, used xp_dirtree to enumerate inetpub folder discovering website backup ZIP file, extracted backup and found plaintext password for raven user in hidden files, established Evil-WinRM shell, ran Certipy enumeration discovering ESC7 vulnerability, exploited ESC7 following official Certipy wiki steps to extract Administrator NTLM hash, escalated to admin via psexec.py pass-the-hash."
---

# Manager - Hack The Box

## Enumeration
### Nmap
Initial Nmap scan revealed HTTP, SMB, LDAP, Kerberos, MSSQL and WinRM Ports.

<img width="1061" height="868" alt="00 - nmap" src="https://github.com/user-attachments/assets/51cdad66-4051-4ccb-9c1c-f33bbce68b88" />

### RID Brute Forcing
I tried anonymous ldapsearch and SMB null session which did not reveal anything. Then I did vhost and directory enumeration for HTTP site and it also did not reveal anything.

Then after some search, I found that it is possible to brute force RIDs if the SMB Null session has read access to IPC$. So I did that and created a userList

<img width="1661" height="731" alt="01 - rid brute" src="https://github.com/user-attachments/assets/6aff763b-bc19-4517-a740-9ade3b86cfca" />

## Exploitation
### Brute Force 
Then using the userList, I created an password list that includes reverse and direct usernames.

Then using this credentials I applied a brute force attack for SMB. (At first I tried it with kerbrute which did not reveal anything useful)

<img width="1570" height="833" alt="02 - brute force" src="https://github.com/user-attachments/assets/cc104a9d-2c37-4dc0-8ec0-a4891a6a3dfa" />

### MSSQL Client
After finding the valid password I checked SMB Shares but non of the shares were usefull. So then I tried to login MSSQL with 'mssqlclient.py' using windows-auth option and got inside. 

<img width="1472" height="260" alt="03 - mssql" src="https://github.com/user-attachments/assets/6bc2658e-70ff-460a-95f8-ef15f4761abe" />

I then tried xp_cmdshell which was blocked. Used xp_dirtree to capture hash with responder but it was a machine account so I could not do anything useful. 

Then again using xp_dirtree I simply enumerated the files. I got access to the inetpub folder and enumerating it I found website backup zip file. 

<img width="720" height="413" alt="04 - backup?" src="https://github.com/user-attachments/assets/6768e73d-ee85-4747-b60a-e466f0140eae" />

### Got The User
So simply downloaded it and checked all files including hidden files. One of them revealed the password for the user raven.

<img width="921" height="720" alt="05 - got it" src="https://github.com/user-attachments/assets/f9dac184-134f-438f-9fcb-77a459a2fa7f" />

And using evil-winrm I got the user flag.

<img width="1161" height="275" alt="06 - user flag" src="https://github.com/user-attachments/assets/9c90f084-83fb-4143-92d2-8eb02a3a3d46" />

## Privilege Escalation
I then used bloodhound and winPEAS but could not find anything useful. Only useful information was network listening service certsrv. 

So I thought maybe the machine is about AD certifications. I then ran certipy.

<img width="1055" height="285" alt="07 - certipy-ad" src="https://github.com/user-attachments/assets/f9d20b3d-1646-4e6f-90aa-deda5c45d9db" />

The machine was vulnerable to ESC7 vulnerability.

<img width="1120" height="751" alt="08 - ESC7" src="https://github.com/user-attachments/assets/bfe9a835-588e-4966-abc9-30d9464e087a" />

So by following the [official wiki](https://github.com/ly4k/Certipy/wiki/06-%E2%80%90-Privilege-Escalation) I was able to get administrator hash. And logged in using psexec.py

<img width="1656" height="665" alt="09 - got the admin" src="https://github.com/user-attachments/assets/aa12c938-6ee3-4035-a42d-cb42b3ac3f0b" />

## Pwned
The machine was pwned.

<img width="796" height="712" alt="pwned" src="https://github.com/user-attachments/assets/878184be-5e7f-4ed4-b819-0b9c9bb369a3" />

