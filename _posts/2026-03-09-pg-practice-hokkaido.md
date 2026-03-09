---
layout: post
title: "hokkaido - Proving Grounds Practice"
summary: "Kerberos User Enumeration (kerbrute userenum) → Default Credentials → Kerberoasting (impacket-GetUserSPNs) and Crack kerberos ticket → MSSQL Login → MSSQL Impersonation → GenericWrite (Targeted Kerberoasting) → ForceChangePassword → Server Operators Group → Service binPath update (sc qc, PsService.exe) → Administrator"
---

# hokkaido - Proving Grounds Practice

## Enumeration
### Nmap
Initial nmap scan revealed common DC ports were open.

<img width="1271" height="500" alt="00 - nmap" src="https://github.com/user-attachments/assets/c351fda1-99bd-4836-8856-15c179987978" />

## Exploitation
### Kerbrute user enumeration
I tried different methods at first but non of them worked. Then I tried kerberos user enumeration with `kerbrute` and found info user.

<img width="1458" height="319" alt="01 - kerbrute to find info" src="https://github.com/user-attachments/assets/881ee003-0aee-474d-9a97-e9ada8bcc3dd" />

### Default Credentials
Later, I tried `info:info` credentials and it worked. I could access some of the shares.

<img width="1642" height="289" alt="02 - info info share" src="https://github.com/user-attachments/assets/626c1161-d5df-4dc3-aef5-4f1758cbc199" />

I also applied RID brute forcing to create a user list.

<img width="1608" height="751" alt="03 - rid brute" src="https://github.com/user-attachments/assets/ddf681b4-dc41-426f-ba8e-8a9c98046902" />

### Kerberoasting
Later, I applied kerberoasting attack using `impacket-GetUserSPNs` and obtained 2 kerberos tickets.

<img width="1643" height="570" alt="04 - kerberoasting" src="https://github.com/user-attachments/assets/f4ae2d29-a792-4f92-ae7b-5928cdab61eb" />

I was able to crack `discovery` user's hash.

<img width="1644" height="661" alt="05 - hashcat cracked" src="https://github.com/user-attachments/assets/bfbfab6e-5e44-4e99-a7f4-fe4ae188d7af" />

### MSSQL Impersonation
Later, I logged in to MSSQL server.

<img width="1103" height="222" alt="06 - mssql" src="https://github.com/user-attachments/assets/c090f92e-6746-4756-bbaf-31a858f13e12" />

I had no privileges but I could impersonate a service user. So I applied necessary steps and impersonated the user.
```sql
# check who you can impersonate
SELECT distinct b.name FROM sys.server_permissions a INNER JOIN sys.server_principals b ON a.grantor_principal_id = b.principal_id WHERE a.permission_name = 'IMPERSONATE';

# execute as
EXECUTE AS LOGIN '<USER>';
```

<img width="1641" height="380" alt="07 - impersonate" src="https://github.com/user-attachments/assets/bc95d556-8af7-4c14-953d-b74d5a4d2318" />

### GenericWrite - Targeted Kerberoasting
Hrapp-service user had genericWrite permissions over hazel.green user. 

<img width="967" height="275" alt="08 - generic write" src="https://github.com/user-attachments/assets/7b922fe8-f797-461b-9612-4a92cf229948" />

So I applied targeted kerberoasting and cracked her password.

<img width="1642" height="305" alt="09 - targetedkerberoast" src="https://github.com/user-attachments/assets/7ae202bc-66d8-48ab-8f61-d569a1b87ffa" />

<img width="1636" height="631" alt="10 - cracked" src="https://github.com/user-attachments/assets/bf251097-7593-482e-8d60-b8da039a075f" />

### ForceChangePassword
Hazel.green could force change molly.smith's password.

<img width="1167" height="298" alt="11 - force change password" src="https://github.com/user-attachments/assets/78267a44-806d-4e02-963f-4cdcf7f757a0" />

So I updated her password. And found out she had RDP privileges.

<img width="1642" height="362" alt="12 - gg" src="https://github.com/user-attachments/assets/676c9048-f77d-4409-bc2d-1e8da3913b21" />

Then simply logged in to RDP session and read user flag.

<img width="1613" height="879" alt="13 - local flag" src="https://github.com/user-attachments/assets/ea179cd4-96f3-4e65-a056-3b7b49e23305" />

## Privilege Escalation
### Server Operator
molly.smith was Tier 1 admin. So I could execute cmd as administrator. However, she was not in local administrators group.

I opened and administrator cmd and checked groups and privileges. Server Operator group seemed exploitable.

<img width="852" height="493" alt="14 - 0 server operator" src="https://github.com/user-attachments/assets/b40ccd57-4e1a-4384-b0ae-d61dc2dd5565" />

So at first I checked a service that runs with SYSTEM privileges.
```powershell
sc.exe qc AppReadiness
```

<img width="748" height="247" alt="14 - sc qc appreadiness" src="https://github.com/user-attachments/assets/aa628a90-b4d8-4305-84b0-ad04a2678b7f" />

Then checked if Server Operator group had privileges using `PsService.exe` ([https://learn.microsoft.com/en-us/sysinternals/downloads/psservice](https://learn.microsoft.com/en-us/sysinternals/downloads/psservice))

<img width="749" height="505" alt="15 - server operator all" src="https://github.com/user-attachments/assets/7c439086-653b-488e-93b1-aac6e0888346" />

After learning that Server Operator can modify it, I modified AppReadiness service to add molly.smith to local administrators group and started the service.

<img width="971" height="371" alt="16 - admin" src="https://github.com/user-attachments/assets/03e1aa95-ce5a-4aa5-a83f-ae68142d3504" />

I simply obtained administrator flag.

<img width="548" height="223" alt="17 - admin flag" src="https://github.com/user-attachments/assets/2a028d36-025e-4e73-960f-0389c1800f4a" />
