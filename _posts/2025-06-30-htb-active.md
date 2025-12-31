---
layout: post
title: "Active - Hack The Box"
summary: "Discovered readable SMB share via null session, found Groups.xml file with encrypted Group Policy Preferences (GPP) credentials, decrypted GPP password using well-known key, accessed Users share to find user flag, enumerated Service Principal Names (SPNs) with GetUserSPN, requested TGS ticket for administrator (Kerberoasting), cracked TGS ticket with Hashcat module 13100."
---

# Active - Hack The Box

## Enumeration
### Nmap
Nmap scan results showed services like LDAP, which are commonly used in Active Directory. This indicates the target is likely a Domain Controller.

![00 - nmap output](https://github.com/user-attachments/assets/69fcfaad-db02-4a65-ba65-b2c6c12796b7)

### SMB
Performed SMB enumeration without credentials (SMB NULL session) and discovered a readable share, which could contain useful information for further access.

![01 - smbmap output](https://github.com/user-attachments/assets/3ce633cf-8370-426a-b67d-c28c2e81f694)

Inside the accessible SMB share, I found a Groups.xml file. It contained a user account name along with an encrypted password—commonly associated with Group Policy Preferences (GPP) in older Windows environments.

![02 - get Groups xml](https://github.com/user-attachments/assets/fe1bbde7-4f3f-4a24-bf3f-2faf260ccee9)

![03 - password](https://github.com/user-attachments/assets/1576a098-26cc-4b2f-bc8f-c9644a425cf6)

## Exploitation

After researching, I learned that Group Policy Preferences (GPP) passwords are encrypted with a well-known key. This makes them easy to decrypt using publicly available tools or simple Python scripts. More details can be found on: https://attack.mitre.org/techniques/T1552/006/

![04 - get GPP Password](https://github.com/user-attachments/assets/da518f50-6c68-4db4-bba4-61cda9fc15d2)

After decrypting the GPP password, I re-ran smbmap using the recovered credentials. This granted read access to the Users share, where I found the user’s desktop folder containing the user flag.

![05 - user flag](https://github.com/user-attachments/assets/a1ebf4ae-2de4-40d2-a6f1-3893ad9312d9)

## Privilege Escalation

To escalate privileges, I used the GetUserSPN script with the discovered user credentials. This allowed me to request a Ticket Granting Service (TGS) ticket for the administrator account, opening the door for offline password cracking. More details on this technique can be found in CrowdStrike’s Kerberoasting overview: https://www.crowdstrike.com/en-us/cybersecurity-101/cyberattacks/kerberoasting/

![06 - SPN](https://github.com/user-attachments/assets/76dbf9c4-53d0-4e6f-82f5-0286c04ca4c7)

I used Hashcat with module 13100 (Kerberos 5 TGS-REP etype 23) to crack the captured TGS ticket and successfully recovered the administrator’s password.

![07 - cracking](https://github.com/user-attachments/assets/7af565e0-957d-4fa2-9959-62561289dd1e)

![08 - cracked](https://github.com/user-attachments/assets/ae7e52e4-4718-455f-9507-b9ca660b2816)

With the administrator credentials in hand, I gained full control over the machine — the target was completely pwned.

![09 - pwned](https://github.com/user-attachments/assets/94d0d248-23e0-4c70-be31-3b8e8205112e)
