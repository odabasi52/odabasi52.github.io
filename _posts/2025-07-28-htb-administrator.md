# Administrator - Hack The Box

## Enumeration
### Nmap
Initial Nmap scan revealed FTP, SMB, LDAP, Kerberos and WinRM ports open, which indicates target is Domain Controller.

<img width="607" height="302" alt="00 - nmap" src="https://github.com/user-attachments/assets/f9b70c5b-b3a9-4cd3-ba1c-e94b3dae8738" />

After nmap scan I did try many things such as SMB Enumeration, LDAP Search, Rid Brute, AS-REP Roasting and none of them worked. So I ran bloodhound.

## Exploitation
Exploitation phase included many lateral movements. So I am going to explain them step by step.

### Getting Michael
Current user olivia had generic all permissions over michael. So I force-changed michael's password.

<img width="431" height="295" alt="04 - michael" src="https://github.com/user-attachments/assets/5a98ce73-e309-4eec-a2ff-1b9292c77042" />

<img width="466" height="37" alt="05 - force change" src="https://github.com/user-attachments/assets/99f06a7c-028c-4a84-ae5a-4fc9b71a2321" />

### Getting Benjamin
Michael can change benjamin's password forcibly. So I hcanged benjamin's password.

<img width="511" height="237" alt="06 - bejamin" src="https://github.com/user-attachments/assets/68e526ce-1199-4c25-8415-74777f4520a2" />

<img width="465" height="63" alt="07 - update benjamin" src="https://github.com/user-attachments/assets/d39b1ed0-12df-4683-ab35-dc0aabc25675" />

### FTP 
Benjamin had permission to login and read from FTP server.

<img width="619" height="181" alt="08 - benjamin ftp" src="https://github.com/user-attachments/assets/932bc659-34f4-4bc1-8858-0a2a6ad4ba81" />

### PwSafe
The downloaded backup file was encrypted. So using pwsafe2john I decrypted it.

<img width="619" height="155" alt="09 - backup decrypted" src="https://github.com/user-attachments/assets/394d13c2-c1f0-4e32-95ac-9216a7cb396f" />

And using pwsafe I got the emily's password.

<img width="589" height="269" alt="10 - got it" src="https://github.com/user-attachments/assets/f0594295-defa-4637-88dd-e99ceb80bb20" />

### Got The User

<img width="525" height="121" alt="11 - got the user" src="https://github.com/user-attachments/assets/6ba3478b-df65-4a56-8cd4-24b10825b1d9" />

## Privilege Escalation
### Targeted Kerberoasting
Checkin bloodhound again, I found emily had generic write permissions over ethan. So we can apply targeted kerberoasting attack.

<img width="522" height="311" alt="12 - path" src="https://github.com/user-attachments/assets/a5319b41-33f1-4f58-910c-4acf9f5e2982" />

Simply we assign a random SPN to target user then apply kerberoasting.

<img width="514" height="76" alt="13 - assign spn" src="https://github.com/user-attachments/assets/984ed4c6-3ada-48c3-b352-9650a2c28c7c" />

<img width="710" height="203" alt="14 - ticket" src="https://github.com/user-attachments/assets/481fc3bd-15a0-4a5d-a080-d90fa12da903" />

<img width="710" height="140" alt="15 - cracked" src="https://github.com/user-attachments/assets/631ab5d2-7305-4eb4-b7a9-00f1dcb2910a" />

### DCSync
After cracking the ticket I know that ethan can apply DCSync attack. So simply I ran secretsdump and got the administrator shell.

<img width="443" height="101" alt="16 - dcsync" src="https://github.com/user-attachments/assets/fff4c34f-b810-4386-929e-7ba0dfee416b" />

### Got The Admin

<img width="521" height="181" alt="17 - got the root" src="https://github.com/user-attachments/assets/52044dd3-f9e1-45a4-b769-5a144bc05868" />

## Pwned
The machine was pwned.

<img width="358" height="319" alt="18 - pwned" src="https://github.com/user-attachments/assets/cd5faa07-a4ca-4873-ba74-858931ad745e" />
