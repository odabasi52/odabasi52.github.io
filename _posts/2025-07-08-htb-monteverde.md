---
layout: post
title: "Monteverde - Hack The Box"
summary: "Enumerated AD users via anonymous LDAP, created custom password list with username variations, brute-forced credentials via Kerbrute, found azure.xml with mhope credentials in SMB share, identified mhope in Azure Admins group, exploited Azure AD Connect to dump ADSync database, decrypted administrator password via mcrypt.dll, escalated to Domain Admin."
---

# Monteverde - Hack The Box

## Enumeration
### Nmap
Nmap scan results showed services like LDAP and Kerberos, which are commonly used in Active Directory. This indicates the target is likely a Domain Controller.

![00 - nmap](https://github.com/user-attachments/assets/955880e4-aafe-4c20-adb4-18e72d172615)

### SMB Shares
Initially, no SMB shares were accessible via a null session.

![01 - No share is available](https://github.com/user-attachments/assets/aa5f25b0-8ac1-4fcd-8a89-7f2cfff7c7ac)

### LDAP Anonymous
LDAP anonymous access was enabled, allowing me to enumerate and dump all available users for potential brute-force or further authentication testing.

![02 - ldap anonyous is allowed](https://github.com/user-attachments/assets/1e252551-3f76-4ec8-bf4c-9cf2199ea51c)

None of the enumerated users were vulnerable to AS-REP roasting.

![03 - no asreproasting](https://github.com/user-attachments/assets/0f583d0e-af47-487d-a331-7a0e3fdf171a)

### Brute Force
To proceed, I created a custom password list using variations such as reversed usernames, direct usernames, and blank passwords.

![04 - created passList nsr](https://github.com/user-attachments/assets/52d0de20-3d59-4b7a-be57-21e5dc7cad17)

I then used Kerbrute with the generated password list to identify valid username-password combinations.

![04 - kerbrute](https://github.com/user-attachments/assets/699e4da6-fd51-43c2-a8d8-b218d516a356)

## Exploitation
Although this user couldn't obtain a shell, they had access to certain SMB shares, one of which contained an azure.xml file revealing the cleartext credentials for the user mhope.

![05 - smb readable](https://github.com/user-attachments/assets/282237a7-af64-4cd0-9880-ed6a034d0df8)

![06 - available users](https://github.com/user-attachments/assets/7b3af78c-ec11-409b-a571-62bf97d348d5)

![07 - azure xml](https://github.com/user-attachments/assets/9c8ec618-3162-482c-8ba2-6154c5e7e054)

Using the credentials from the azure.xml file, I successfully obtained a shell as the user mhope.

![08 - got the user](https://github.com/user-attachments/assets/039253c4-e4eb-4f96-ba81-1404a81e6b08)

## Privilege Escalation
To escalate privileges, I performed Active Directory enumeration using BloodHound.

![09 - bloodhound python](https://github.com/user-attachments/assets/26528998-bb56-456b-bebc-2dedbc7c6173)

The BloodHound analysis revealed that the mhope user was a member of the Azure Admins group.

![10 - sus group](https://github.com/user-attachments/assets/24c8986c-b40e-4f80-99e6-4fe3edd35f0f)

At that point, I was unsure how to proceed, so I researched privilege escalation techniques related to the Azure Admins group. During this process, I came across the following blog post: https://blog.xpnsec.com/azuread-connect-for-redteam/, which provided valuable insights into exploiting Azure AD Connect for privilege escalation.

While reviewing the blog, I learned that the administrator password could be retrieved from the MSSQL ADSync database. I then checked whether I could execute SQL commands using sqlcmd and confirmed that this was possible.

![11 - some sqlcmd](https://github.com/user-attachments/assets/50fbf296-fa9f-46cb-960c-742da21a7efb)

The blog included a script to retrieve keyset_id, instance_id, and entropy from the mms_server_configuration table, as well as private_configuration_xml and encrypted_configuration from the mms_management_agent table. 
These values are then used with functions from C:\Program Files\Microsoft Azure AD Sync\Bin\mcrypt.dll to decrypt the encrypted administrator password.
However, since the SQL connection in the script was configured for a remote database, I modified it to connect locally by changing this part:
```powershell
$client = new-object System.Data.SqlClient.SqlConnection -ArgumentList "Data Source=(localdb)\.\ADSync;Initial Catalog=ADSync"
```

to this:
```powershell
$client = new-object System.Data.SqlClient.SqlConnection -ArgumentList "Server=localhost;Database=ADSync;Trusted_Connection=True;"
```
For more information about ArgumentList you can checkout this site: https://www.connectionstrings.com/sql-server/

![12 - powershell](https://github.com/user-attachments/assets/dbb0b3b7-d1df-4815-b1f5-38d5bda2a8b4)

I then successfully retrieved the decrypted administrator password and used it to log in as the administrator.

![13 - got the root](https://github.com/user-attachments/assets/35a2cdf4-1179-439b-88a1-2d7969bad4ce)

## Pwned
The machine was fully compromised.

![pwned](https://github.com/user-attachments/assets/5fd67eba-f879-4828-adf2-8431cd66bb0e)









