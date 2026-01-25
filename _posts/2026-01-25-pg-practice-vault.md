---
layout: post
title: "Vault - Proving Grounds Practice"
summary: "SMB Null Session → NTLM Theft with .lnk file → NTLMv2 Hash cracked → User Shell → (1st way) WriteDACL over GPO → impacket dacledit to obtain GenericAll privileges → pyGPOAbuse to add user named john as administrator → gpupdate to apply changes → Administrator shell → (2nd way) SeRestore Privilege → replace C:\\Windows\\System32\\utilman.exe with cmd.exe → rdesktop → Windows+U → SYSTEM Shell"
---

# Vault - Proving Grounds Practice

## Enumeration
### Nmap 
Initial Nmap scan revealed SMB and some common Active Directory ports were open.

<img width="1019" height="513" alt="00 - nmap" src="https://github.com/user-attachments/assets/ddb68a0a-b88e-4de7-a226-7eb461ce18f9" />

### SMB Null
SMB Null session was available. Moreover, there was a share where we could both read and write.

<img width="1625" height="296" alt="01 - smb null" src="https://github.com/user-attachments/assets/1c11fffc-4bda-4425-87cf-c8908ecd1830" />

The share was empty as seen below.

<img width="829" height="148" alt="02 - empty share" src="https://github.com/user-attachments/assets/b68f737b-1bf7-41fb-afff-52141c90bcac" />

## Exploitation
### NTLM Theft
Because the share was empty and I had a write permission, I decided to put some files created by `ntlm_theft` while listening with `responder`.

<img width="977" height="503" alt="03 - ntlm_theft" src="https://github.com/user-attachments/assets/bb18671b-bad7-409e-863c-eada3d74132b" />

The .lnk file worked and I obtained user's NTLMv2 hash.

<img width="991" height="220" alt="04 -  lnk file" src="https://github.com/user-attachments/assets/8357b0d2-0438-4630-bb31-5fd9f0d1e9a6" />

<img width="1882" height="139" alt="05 - hash" src="https://github.com/user-attachments/assets/344c37f0-97ec-4096-aa81-9d45c2c36e4f" />

Then I simply cracked it using hashcat.

<img width="1885" height="596" alt="06 - cracked" src="https://github.com/user-attachments/assets/43d31b97-6acd-46da-a489-45dd91af5a0e" />

And obtained the user flag.

<img width="1421" height="287" alt="07 - user flag" src="https://github.com/user-attachments/assets/8bae4b66-7a27-48e2-85a6-5d06493e26f6" />

## Privilege Escalation (1st way - GPO Abuse)
### Bloodhound Python
After obtaining user credentials I executed bloodhount python.

<img width="1254" height="381" alt="12 - bloodhound python" src="https://github.com/user-attachments/assets/fe8d81d9-2730-467c-a9d2-19b82b8bfc9c" />

Then I found out that the user had WriteDACL permissions over Default GPO.

<img width="1254" height="600" alt="13 - gpo writedacl" src="https://github.com/user-attachments/assets/a6ace583-fde0-43c5-809b-3a721f93c410" />

### GPO Abuse
At first I used `impacket-dacledit` to give myself GenericAll privileges over GPO.
```bash
impacket-dacledit -action 'write' -rights 'FullControl' -principal 'ANIRUDH' -target-dn 'CN={31B2F340-016D-11D2-945F-00C04FB984F9},CN=POLICIES,CN=SYSTEM,DC=VAULT,DC=OFFSEC' 'vault.offsec'/'anirudh':'<PASSWORD>' 
```

<img width="1889" height="165" alt="14 - dacledit" src="https://github.com/user-attachments/assets/16e0a15d-6731-42a6-a68f-6ff8be3a04e2" />

Then using [pyGPOAbuse](https://github.com/Hackndo/pyGPOAbuse) tool, I abused the default GPO which creates a scheduled task to add user named `John` with password `H4x00r123..`.

<img width="1035" height="88" alt="15 - pygpoabuse" src="https://github.com/user-attachments/assets/2485d81c-5d38-407a-88fe-0019c48f277e" />

And on user winrm shell, I used `gpupdate /force` command to update the GPO.

<img width="614" height="200" alt="16 - gpupdate" src="https://github.com/user-attachments/assets/588b2a04-94e5-40b6-ba4b-9c9e035e88f4" />

Then I simply logged in as John and read Admin flag.

<img width="1307" height="292" alt="17 - gg" src="https://github.com/user-attachments/assets/e5db06f0-5d54-4211-b1c5-712c0a3112f9" />

## Privilege Escalation (2nd way - SeRestore Privilege)
User had SeRestore Privilege and RDP port was open. So I could simply overwrite `C:\Windows\System32\utilman.exe` with `cmd.exe`. 

<img width="901" height="413" alt="18 - restore priv" src="https://github.com/user-attachments/assets/255290f5-4284-46a0-974a-76f47ea56a60" />

Then I used `rdektop` to open lock screen.

<img width="920" height="521" alt="19 - rdesktop" src="https://github.com/user-attachments/assets/afb1faff-2b01-4803-b9e9-98a38fbc8376" />

And I simply clicked Windows+U on my keyboard and got SYSTEM Shell.

<img width="1029" height="647" alt="20 - gg" src="https://github.com/user-attachments/assets/2cb40494-3de2-45c3-b973-ff5c507b9459" />

## Privilege Escalation (Failed way - SeBackup Privilege)
### Trying to dump Admin Hash
SeBackupPrivilege was enabled. We could simply copy SYSTEM and SAM and dump Administrator credentials.

<img width="1007" height="327" alt="08 - sebackupprivilege" src="https://github.com/user-attachments/assets/59704f3d-0b55-43dc-846a-ed18a23137b8" />

I used below commands to copy SYSTEM and SAM.
```powershell
cd c:\ProgramData
reg save hklm\sam sam_bak
reg save hklm\system system_bak
```

<img width="745" height="365" alt="09 - download files" src="https://github.com/user-attachments/assets/db078439-8b28-4be1-b3b1-359227b78e7f" />

We could either use `pypykatz` or `impacket-secretsdump` to dump Administrator hash.

```bash
impacket-secretsdump -system system_bak -sam sam_bak LOCAL
pypykatz registry --sam sam_bak system_bak
```

<img width="1035" height="288" alt="10 - admin hash" src="https://github.com/user-attachments/assets/02c5b439-5e1c-43f9-9a95-a18161cb7a57" />

<img width="893" height="222" alt="10 - admin hash 2" src="https://github.com/user-attachments/assets/235a2b63-884e-4560-88dd-0332673f6e3a" />

However, we could not login as Administrator. Because only user that is allowed to have remote connections is anirudh user.

### Trying Diskshadow and Robocopy
I then tried different method found in [k4sth4/SeBackupPrivilege](https://github.com/k4sth4/SeBackupPrivilege), which tries to create copy disk of disk C.

<img width="1920" height="823" alt="image" src="https://github.com/user-attachments/assets/4b1d97b0-c797-4466-8231-65861445d686" />

However, it also did not work.

<img width="843" height="253" alt="image" src="https://github.com/user-attachments/assets/20deaad3-a9b7-47ba-a04c-e401535ceff1" />


