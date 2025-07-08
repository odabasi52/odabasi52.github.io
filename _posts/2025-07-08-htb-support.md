# Support - Hack The Box

## Enumeration
### Nmap
Nmap scan results showed services like LDAP and Kerberos, which are commonly used in Active Directory. This indicates the target is likely a Domain Controller.

![00 - nmap](https://github.com/user-attachments/assets/046948c2-bc09-43e3-bfe1-0c69211dd386)

### SMB Shares
An unusual SMB read access was observed through a null session.

![01 - smb shares](https://github.com/user-attachments/assets/43457bd9-c918-4ed9-b51e-6ac7012c56d5)

Using smbclient, I connected to the share and found numerous Windows executable files; however, one of them appeared unusual.

![02 - smbclient](https://github.com/user-attachments/assets/c32010c1-1a8e-484b-9d9b-d5c568ccd130)

### Reverse Engineering
I downloaded the UserInfo.exe file and reverse engineered it using ILSpy. The analysis revealed a hardcoded username and an encrypted password, along with the decryption algorithm embedded within the binary.

![03 - user and passw](https://github.com/user-attachments/assets/13ec6a92-cf7f-4651-be91-147db623a447)

![04 - encrypted password](https://github.com/user-attachments/assets/c248a5d7-d74a-4756-bf0d-73d208cb94b1)

I re-implemented the decryption algorithm in Python to successfully recover the user's plaintext password.

![05 - decrypted password](https://github.com/user-attachments/assets/b56a3c44-c189-4244-95d7-77b8b703c491)

## Exploitation
### BloodHound
Since obtaining a shell was not possible, I used the recovered credentials to run BloodHound-python for further enumeration.

![06 - bloodhound python](https://github.com/user-attachments/assets/29a7ecfa-5c41-40a8-b79c-e7a39e5e4cf3)

After analyzing the BloodHound data, I discovered that the 'support' user has GenericAll privileges over the Domain Controller computer object.

![07 - generic all](https://github.com/user-attachments/assets/5c207a5b-858b-4b51-ab7a-7de55b53c925)

![08 - found target](https://github.com/user-attachments/assets/0a18510c-e1f4-41ca-83c4-c649e8f59f21)

### LdapSearch
BloodHound did not reveal any further actionable information. I then used ldapsearch with the recovered user credentials to query information related to the 'support' account. Within the info attribute, I identified an unusual string, which I later confirmed to be the password.

![09 - got the user password](https://github.com/user-attachments/assets/87599670-081d-45e5-8cc6-df1197709036)

![10 - user flag](https://github.com/user-attachments/assets/e2708dd5-162b-4244-a36c-41e9700faf95)

## Privilege Escalation
At this point, it was confirmed that the user had PSRemote access and GenericAll privileges over the Domain Controller computer object. I proceeded to exploit this using an administrator delegation attack. By following the necessary steps and leveraging tools such as PowerMad, PowerView, and Rubeus, I was able to obtain a Kerberos TGT for the administrator account.

![11 - privesc part 1](https://github.com/user-attachments/assets/dab832a3-c054-4e8c-9622-0c960c9f1371)

![12 - privesc part2](https://github.com/user-attachments/assets/fa1c74bd-d002-4006-a447-49d80367ae9c)

Using the obtained Kerberos ticket, I authenticated with psexec.py via Kerberos and successfully gained a shell on the Domain Controller, ultimately retrieving the root flag.

![13 - got the admin](https://github.com/user-attachments/assets/387c8fca-49c6-44dd-bc20-f5267b3bd788)

With full administrative access achieved, the machine was effectively compromised.

![pwned](https://github.com/user-attachments/assets/81f16370-fefb-452f-8874-04cb2de9a82d)








