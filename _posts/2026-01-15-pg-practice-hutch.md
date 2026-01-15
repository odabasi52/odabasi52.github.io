---
layout: post
title: "Hutch - Proving Grounds Practice"
summary: "LDAP Anonymous → Password in Description → Username Anarchy (username-anarchy) to generate username list → SMB Password Spraying → (1st way) Bloodhound-Python (Bloodhound Python) → Read LAPS Password privilege → Read Local Admin Password using bloodyAD → Administrator → (2nd way) → WebDAV → Use cadaver to put files → Reverse Shell as IIS service user → SeImpersonatePrivilege → GodPatato → Administrator"
---

# Hutch - Proving Grounds Practice

## Enumeration
### Nmap 
Initial Nmap scan revealed HTTP and common Domain Controller Ports were open. 

<img width="1474" height="817" alt="00 - nmap and domain" src="https://github.com/user-attachments/assets/2fde7e45-1d38-4718-a03c-86955f87bd81" />

At first I added domain and dc to /etc/hosts file.

<img width="1132" height="206" alt="01 - etc hosts" src="https://github.com/user-attachments/assets/972d2db1-9107-44c3-9d46-074c1f944263" />

### Ldap Anonymous
I could run LDAP anonymously, so I ran it an checked the output and found a password for Freddy.

<img width="936" height="540" alt="02 - password set" src="https://github.com/user-attachments/assets/6280350c-61d9-480a-bffc-36a2e4e60ac6" />

### Username Anarchy
Later I ran `username-anarchy` against Freddy McSorley and used it to brute force SMB using nxc. Thus, I found the valid credential set.

<img width="1716" height="674" alt="03 - username anarchy" src="https://github.com/user-attachments/assets/00af3a1e-0b56-4f90-a112-1825941b64da" />

## Exploitation to Administrator (1st way using Active Directory)
### Bloodhound-Python
At first I ran the `bloodhound-python` using the set of credentials we obtained.
```bash
bloodhound-python -u 'fmcsorley' -p 'CrabSharkJellyfish192' -dc HUTCHDC.hutch.offsec -c all -ns 192.168.198.122 -d hutch.offsec --zip
```

<img width="1517" height="510" alt="05 - bloodhound py" src="https://github.com/user-attachments/assets/4b13db06-f1a8-46a3-b5f8-0edca44bacd3" />

### Read LAPS Password
Checking the output revealed that Freddy could read LAPS password of the DC.

<img width="919" height="446" alt="06 - readlapspassword" src="https://github.com/user-attachments/assets/f82b075e-61ac-495c-bb01-addea9be9dab" />

The “Local Administrator Password Solution” (LAPS) provides management of local account passwords of domain joined computers. Passwords are stored in Active Directory (AD) and protected by ACL, so only eligible users can read it or request its reset.

So we can simply read Local Administrator password. I used `bloodyAD` to read it. (For more information [https://bloodhound.specterops.io/resources/edges/read-laps-password](https://bloodhound.specterops.io/resources/edges/read-laps-password))
```bash
bloodyAD --host $DC_IP -d $DOMAIN -u $USER -p $PASSWORD get search --filter '(ms-mcs-admpwdexpirationtime=*)' --attr ms-mcs-admpwd,ms-mcs-admpwdexpirationtime
```

<img width="1842" height="387" alt="07 - adm password" src="https://github.com/user-attachments/assets/6b7fa305-9ca6-44a2-a6c5-1bb019851bac" />

Then I simply logged in as Administrator using `evil-winrm`.

<img width="1348" height="756" alt="08 - root and local flag" src="https://github.com/user-attachments/assets/fd8e1a68-fe03-4bb7-8db5-0b9e740d9033" />

## Exploitation to Administrator (2nd way using WebDAV and SeImpersonatePrivilege)
### WebDAV
The website had WebDAV as seen in nmap output.

<img width="1342" height="386" alt="10 - webdav" src="https://github.com/user-attachments/assets/53ff9b95-425a-4d7d-9b30-ac78afcdae71" />

So I searched WebDAV pentest and found [hacviser post](https://hackviser.com/tactics/pentesting/services/webdav). It recommended to use `cadaver` so I used it and put [shell.aspx](https://github.com/borjmz/aspx-reverse-shell) in it.

<img width="764" height="314" alt="11 - cadaver webdav " src="https://github.com/user-attachments/assets/c71d68e2-2ae6-429b-b321-feee544894a0" />

### SeImpersonatePrivilege
Then visiting the web page directly gained me reverse shell as IIS service user. Moreover, user had SeImpersonatePrivilege enabled.

<img width="1907" height="818" alt="12 - sus" src="https://github.com/user-attachments/assets/b35f17a5-50bc-43d2-a1fb-06b7adb854eb" />

So I simply transfered [GodPatato](https://github.com/BeichenDream/GodPotato) using WEbDAV.

<img width="844" height="85" alt="13 - patato" src="https://github.com/user-attachments/assets/f5d6c2f5-40f1-42da-baec-4ce1ce9d2be6" />

Then I ran it and read the Administrator flag.

<img width="1068" height="569" alt="14 - gg" src="https://github.com/user-attachments/assets/113afb8d-683b-4397-b2b7-9f7c4c294a7f" />
