---
layout: post
title: "Phantom - Hack The Box"
summary: "SMB Null → Mail → Base64 encoded pdf → Default password → RID Brute forcing → Password Spraying → SMB Enumeration → Crack .hc file → HashCat rule file to crack → mount VeraCrypt → Password in configuration file → user shell → ForceChangePassword (change password) → AddAllowedToAct over DC → No permission to add computer → Resource Based Contrained Delegation (RBCD on SPN-less users) → Administrator"
---

# Phantom - Hack The Box

## Enumeration
### Nmap
Initial Nmap scan revealed SMB, LDAP, Kerberos and WinRM ports open, which indicates target is Domain Controller.

<img width="1271" height="471" alt="000 - nmap out" src="https://github.com/user-attachments/assets/1067a49a-debf-489f-aa38-b55b094c944d" />

### DNS Enumeration
DNS enumeration against the domain revealed the FQDN of Domain Controller.

<img width="1101" height="396" alt="001 - dc" src="https://github.com/user-attachments/assets/808402c7-14a8-44d9-8e6f-f7740df8d8a2" />

### SMB Enumeration
SMB Enumeration revealed NULL session is available and Public Share is accessible with it. Inside the Public share, there was an email which included base64 encoded pdf file.

<img width="1558" height="665" alt="002 - public share" src="https://github.com/user-attachments/assets/bce3b5d1-e127-4b93-9c5e-e675fcb624ec" />

### Opening The PDF
Used 'echo <base64> | base64 -d > welcome.pdf' and opened the pdf file which revealed the default password.

<img width="1917" height="729" alt="003 - defualt password" src="https://github.com/user-attachments/assets/8bb07940-986a-4b37-9ff0-e5cd82f74cb3" />

### RID Brute
As NULL session was available and we could access IPC$ share with it we can apply RID Brute forcing to get a list of valid users.

<img width="1649" height="739" alt="004 - brute forcing RIDs to get a list of users" src="https://github.com/user-attachments/assets/c2e4af12-7270-418f-bd5e-e43644b8dbed" />

## Exploitation
### Password Spraying
Using the default password and valid user list, I brute forced and obtained valid set of credential.

<img width="1248" height="321" alt="005 - valid creds" src="https://github.com/user-attachments/assets/2d143b32-8e0d-4006-91c9-e0274540381c" />

### SMB Enumeration
Then using the new set of credential, I enumerated SMB Shares again which revealed that the user has access to the Department Share.

<img width="1493" height="522" alt="006 - department shares" src="https://github.com/user-attachments/assets/7caae44d-0914-4a81-b8d0-b1fbd0568069" />

### Encrypted .hc File
Inside the department share there was a .hc file which was a backup file. It could be opened using Veracrypt but we needed a password. So we can use hashcat to brute force and crack the password. 

The lab mentions 'Should you need to crack a hash, use a short custom wordlist based on company name & simple mutation rules commonly seen in real life passwords (e.g. year & a special character).'. So I ran below command to brute force:
```sh
hashcat -m 13721 IT_BACKUP_201123.hc phantom -r rules
```
The rules file was like below:
```
# Basic transformations
:
l
u
c
C

# Add common years at the end (2020-2025)
$2$0$2$5
$2$0$2$4
$2$0$2$3
$2$0$2$2
$2$0$2$1
$2$0$2$0

# Add years with common special characters (2020-2025)
$2$0$2$5$!
$2$0$2$4$!
$2$0$2$3$!
$2$0$2$2$!
$2$0$2$1$!
$2$0$2$0$!
$2$0$2$5$@
$2$0$2$4$@
$2$0$2$3$@
$2$0$2$2$@
$2$0$2$1$@
$2$0$2$0$@
$2$0$2$5$#
$2$0$2$4$#
$2$0$2$3$#
$2$0$2$2$#
$2$0$2$1$#
$2$0$2$0$#
$2$0$2$5$$
$2$0$2$4$$
$2$0$2$3$$
$2$0$2$2$$
$2$0$2$1$$
$2$0$2$0$$

# Capitalize first letter + years + special chars (2020-2025)
c $2$0$2$5$!
c $2$0$2$4$!
c $2$0$2$3$!
c $2$0$2$2$!
c $2$0$2$1$!
c $2$0$2$0$!

# All uppercase + years + special chars (2020-2025)
u $2$0$2$5$!
u $2$0$2$4$!
u $2$0$2$3$!
u $2$0$2$2$!
u $2$0$2$1$!
u $2$0$2$0$!

# Prepend special characters (2020-2025)
^! $2$0$2$5
^@ $2$0$2$5
^# $2$0$2$5
^$ $2$0$2$5

# Common number substitutions (leet speak) (2020-2025)
so0 $2$0$2$5$!
so0 $2$0$2$4$!
so0 $2$0$2$3$!
so0 $2$0$2$2$!
so0 $2$0$2$1$!
so0 $2$0$2$0$!

# Replace 'a' with '@' (2020-2025)
sa@ $2$0$2$5$!
sa@ $2$0$2$4$!
sa@ $2$0$2$3$!
sa@ $2$0$2$2$!

# Replace 'a' with '4' (2020-2025)
sa4 $2$0$2$5$!
sa4 $2$0$2$4$!
sa4 $2$0$2$3$!
sa4 $2$0$2$2$!
sa4 $2$0$2$1$!
sa4 $2$0$2$0$!

# Multiple leet substitutions (a->4, o->0) (2020-2025)
sa4 so0 $2$0$2$5$!
sa4 so0 $2$0$2$4$!
sa4 so0 $2$0$2$3$!
sa4 so0 $2$0$2$2$!
sa4 so0 $2$0$2$1$!
sa4 so0 $2$0$2$0$!

# Capitalize first + leet substitutions (2020-2025)
c sa4 so0 $2$0$2$5$!
c sa4 so0 $2$0$2$4$!
c sa4 so0 $2$0$2$3$!
c sa4 so0 $2$0$2$2$!
c sa4 so0 $2$0$2$1$!
c sa4 so0 $2$0$2$0$!

# Multiple special characters (2020-2025)
$2$0$2$5$!$!
$2$0$2$4$!$!
$2$0$2$3$!$!
$2$0$2$5$@$!
$2$0$2$4$@$!
$2$0$2$3$@$!
$2$0$2$5$#$!
$2$0$2$4$#$!
$2$0$2$3$#$!

# Years in the middle with special chars at end (2020-2025)
$2$0 $2$5 $!
$2$0 $2$4 $!
$2$0 $2$3 $!
$2$0 $2$2 $!
$2$0 $2$1 $!
$2$0 $2$0 $!

# Short years (last two digits) (20-25)
$2$5$!
$2$4$!
$2$3$!
$2$2$!
$2$1$!
$2$0$!

# Combinations with multiple transformations (2020-2025)
c sa@ $2$0$2$5$!
c so0 $2$0$2$5$!
u sa@ $2$0$2$5$!
u so0 $2$0$2$5$!
c sa4 $2$0$2$5$!
c sa4 $2$0$2$4$!
u sa4 so0 $2$0$2$5$!
u sa4 so0 $2$0$2$4$!
```

Then the password was cracked.

<img width="817" height="114" alt="009 - cracked" src="https://github.com/user-attachments/assets/e58b449a-ee50-4c5d-b669-b1bd49669fc7" />

We can now mount this file with Veracrypt.

<img width="786" height="752" alt="010 - veracrypt" src="https://github.com/user-attachments/assets/396372a3-cccb-4e02-976f-bb7a9e814bbc" />

Inside the mount there were backup files, some sql files and some config files. At first I found etc/shadow file and brute forced it but it did not reveal anything. SQL files also did not revealed anything useful. However, one of the config files revealed a password:

<img width="659" height="428" alt="011 - config boot" src="https://github.com/user-attachments/assets/6b0d3f18-eae7-48b2-950d-fd84d2fc3a2c" />

Tested the password but it did not work for the user. So sprayed the password against valid user list and found a set of valid credential.

<img width="1267" height="307" alt="012 - svc account " src="https://github.com/user-attachments/assets/134315f3-e9a1-4a90-a124-c7979697c9e4" />

### User Flag
User flag was obtained.

<img width="1340" height="423" alt="013 - user flag" src="https://github.com/user-attachments/assets/e172495c-dc8d-4468-95f8-2a79fc4ee0ea" />

## Privilege Escalation
### BloodHound
After obtaining the user, ran bloodhound to check for privilege escalation paths.

<img width="1196" height="396" alt="014 -  bloodhound" src="https://github.com/user-attachments/assets/afb3123c-3926-4c15-8a61-da81efc791f7" />

### RBCD on SPN-less users
The path was straight forward. Current user can change passwords of three users which has AddAllowedToAct priviliges over DomainController. So we can change the password of a user then apply RBCD privilege escalation techniques.

<img width="671" height="485" alt="015 - force change passw" src="https://github.com/user-attachments/assets/3612d0e6-6aac-4da4-8425-43fa4298cc11" />

<img width="695" height="479" alt="016 - allowed to act" src="https://github.com/user-attachments/assets/6147fb52-2b79-4c9a-abba-c3bf6b5109f3" />

However, there was a problem. Users did not have permission to add machine account to domain. I tested it with all users after changing their password, and the machine quota was 0.

<img width="1511" height="290" alt="017 - Update password" src="https://github.com/user-attachments/assets/d9ad3246-6faa-4790-a9c4-5e9ddaa3babf" />

So we can not create a machine account. After some research I found a technique that uses SPN-less users to apply RBCD privilege escalation technique. However, this technique breaks the user so normal user will not have access to the account.

For more information about RBCD on SPN-less users you can read [this](https://www.thehacker.recipes/ad/movement/kerberos/delegations/rbcd#rbcd-on-spn-less-users) blog from Hacker Recipes.

<img width="1557" height="791" alt="018 - RBCD on SPN-less users
" src="https://github.com/user-attachments/assets/224e3b3f-33c5-4bbf-b4cc-dee733d152e0" />

### Got the Admin
By applying the steps from the post, we got the domain admin.

<img width="1192" height="351" alt="019 - got it" src="https://github.com/user-attachments/assets/cc5499dd-335f-49b0-9a84-dbe9b5033122" />

We can also apply DCSync.

<img width="1169" height="210" alt="020 - dcsync" src="https://github.com/user-attachments/assets/22e4b98a-2cd3-4bee-8d92-f81e48dbeb3b" />

## Pwned
The machine was compromised.

<img width="728" height="612" alt="021 - pwned" src="https://github.com/user-attachments/assets/1edf09b3-5b21-4271-aa56-5bacb9bf5c88" />
