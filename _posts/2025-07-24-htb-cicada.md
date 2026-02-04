---
layout: post
title: "Cicada - Hack The Box"
summary: "SMB Null → HR Share → Default Password → RID Brute Force → Password Spraying → LDAP Search (ldapsearch) → Password on description → SMB Enumeration → Dev share backup script → credentials → user shell → SeBackupPrivilege → Administrator"
---

# Cicada - Hack The Box

## Enumeration
### Nmap
Initial Nmap scan revealed SMB, LDAP, Kerberos and WinRM Ports.

<img width="554" height="361" alt="00 - nmap" src="https://github.com/user-attachments/assets/ccf80355-4f85-4a88-bc46-c61ac4e5ae9a" />

### SMB Null
SMB Null Session was enabled for HR Share which included default password for newcomers.

<img width="669" height="211" alt="01 - share" src="https://github.com/user-attachments/assets/73e29a46-3e6f-4832-bf84-5125e15ff0a5" />

<img width="767" height="196" alt="02 - default password" src="https://github.com/user-attachments/assets/67046bdd-ebc6-4a59-8a65-90daa08068b1" />

### Rid Brute
Because SMB Null session was enabled for IPC$ we could apply rid brute forcing then create a user list.

<img width="660" height="287" alt="03 - userList" src="https://github.com/user-attachments/assets/79cb8b9b-f13b-499f-b846-a7138dc92cab" />

## Exploitation
### Brute Force
Using the user list and default password, I applied a brute force for SMB login and got a valid user.

<img width="640" height="47" alt="04 - found user" src="https://github.com/user-attachments/assets/a4cff6b9-7960-4c91-bf3f-11c288b0f737" />

### LDAP Search
Then using the found credentials, I ran an ldapsearch and found a password on description field.

<img width="548" height="194" alt="05 - ldapsearch1" src="https://github.com/user-attachments/assets/863a970d-8e7f-4b05-833a-f7ab7de2be57" />

<img width="286" height="238" alt="05 - ldapsearch2" src="https://github.com/user-attachments/assets/4539dba7-5dfa-4490-83a3-9810c3629ca4" />

### SMB Enumeration
The new user had access to Dev shares which included a backup script. Inside the backup script there was a credentials.

<img width="639" height="111" alt="06 - got the user and hsares" src="https://github.com/user-attachments/assets/b14ff7b7-84c0-4ce7-b033-b3c53c04e5b7" />

<img width="479" height="233" alt="07 - got the emily" src="https://github.com/user-attachments/assets/80f6edca-1ce1-4aa4-9f19-0111a49c6391" />

### WinRM
This user had PSRemote privileges so I simply used evil-winrm and got a shell.

<img width="520" height="111" alt="08 - user flag" src="https://github.com/user-attachments/assets/428d63f8-2dfe-4098-bdf4-2307ad6215aa" />

## Privilege Escalation
### SeBackupPrivilege
The user had SeBackupPrivilege enabled.

<img width="553" height="314" alt="09 - SeBackupPrivilege" src="https://github.com/user-attachments/assets/01179596-b19e-40fd-aac0-9924af3e0b4e" />

So I simply followed [this](https://github.com/k4sth4/SeBackupPrivilege) steps and got the Administrator hash.

<img width="548" height="355" alt="10 - got it" src="https://github.com/user-attachments/assets/b1790cfe-e2d3-4706-841f-28910d9ac3dd" />

And then using the psexec I simply got the shell.

<img width="561" height="146" alt="11 - got the root" src="https://github.com/user-attachments/assets/edc25fb8-52ed-4935-86fc-769bb8b776eb" />

## Pwned
The machine was fully pwned.

<img width="362" height="316" alt="12 - pwned" src="https://github.com/user-attachments/assets/9210ab8a-5e14-4ac9-b564-afd286c301fd" />
