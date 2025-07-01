# Forest - Hack The Box

## Enumeration
### Nmap
Nmap scan results showed services like LDAP and Kerberos, which are commonly used in Active Directory. This indicates the target is likely a Domain Controller.

![00 - nmap](https://github.com/user-attachments/assets/35492d8a-2359-4e57-9362-3f03ffc8286c)

### User Enumeration
I used Kerbrute to enumerate valid user accounts on the target system.

![02 - kerbrute](https://github.com/user-attachments/assets/f9397f0a-e259-4199-b53b-da95738872d2)

However, since Kerbrute returned a limited number of users, I performed an anonymous LDAP search to enumerate all objects by querying for entries with a broad objectClass=* filter. This allowed me to identify additional accounts, including service accounts, that were not initially discovered.

![03 - getting all users](https://github.com/user-attachments/assets/1783c98a-a716-419e-9c60-a516a44b3779)

## Exploitation
### AS-REP Roasting
Using the list of usernames obtained from the LDAP enumeration, I identified accounts with Kerberos pre-authentication disabled by leveraging the GetNPUsers script. This enabled me to perform an AS-REP Roasting attack to request and capture AS-REP hashes for offline cracking.

![04 - ASREP](https://github.com/user-attachments/assets/7bf84f25-828a-4966-be1e-83af1b022acb)

As a result, I successfully obtained the AS-REP hash for the svc-alfresco service account. For more details on the AS-REP Roasting technique, refer to the MITRE ATT&CK entry: https://attack.mitre.org/techniques/T1558/004/

![05 - got the asrep](https://github.com/user-attachments/assets/42537169-2fa9-4cde-a52e-84b139a4717f)

### Cracking with Hashcat
I then used Hashcat to perform offline cracking of the captured AS-REP hash and successfully recovered the plaintext password for the svc-alfresco service account.

![06 - cracked](https://github.com/user-attachments/assets/9cadf358-fbe1-4e72-9aae-fdcb29e52c1e)

Based on the Nmap scan results, the WinRM service was found to be accessible. Using the recovered credentials, I established a remote shell as the svc-alfresco user via Evil-WinRM.

![07 - user](https://github.com/user-attachments/assets/0f0e05c5-23ab-4fb4-9084-5af64a66b084)

## Privilege Escalation
Once inside the remote shell, I executed SharpHound to collect Active Directory enumeration data. The output was then transferred to my local machine and analyzed using BloodHound to identify potential attack paths and privilege escalation opportunities.

### WriteDACL
During the analysis in BloodHound, I discovered that the Exchange Windows Permissions group has WriteDACL permissions over the domain object. This indicates a potential privilege escalation path by modifying the domain’s access control list (ACL).

![08 - writedacl](https://github.com/user-attachments/assets/f0a32dfe-723f-4584-be31-ee3504de18a6)

Additionally, I found that the svc-alfresco service account is a member of the Account Operators group, which has GenericAll permissions over the Exchange Windows Permissions group. This grants full control over the group, enabling further privilege escalation.

![09 - exchange](https://github.com/user-attachments/assets/9ce5240d-f380-42d8-a2e1-dfffcef4e28d)

To exploit this privilege escalation path, I created a new user account named mto and added it to the Exchange Windows Permissions group. Then, using PowerView, I granted the user the necessary DCSync permissions by modifying the domain object’s ACL. You can checkout this link for more information: https://bloodhound.specterops.io/resources/edges/write-dacl

![10 - added](https://github.com/user-attachments/assets/2ed5bbe8-b331-4bec-8951-103bbed8c7d1)

With the DCSync permissions in place, I used secretsdump.py from the Impacket toolkit to perform a DCSync attack and successfully retrieved the NTLM hash of the Administrator account.

![11 - secretsdump](https://github.com/user-attachments/assets/6736f831-f73d-47ab-b858-5960a0ef8a6c)

Finally, I used a pass-the-hash technique with the retrieved Administrator NTLM hash to gain a privileged shell, effectively achieving full domain compromise.

![13 - got the root](https://github.com/user-attachments/assets/c3fe6b05-3bab-4cb7-9f54-e62f56442abc)

With that, the machine was fully compromised.

![pwned](https://github.com/user-attachments/assets/7968e45d-fe83-4f73-b5fd-bca4f7da5037)






