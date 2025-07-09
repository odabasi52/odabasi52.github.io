# StreamIO - Hack The Box

## Enumeration
### Nmap
The Nmap scan revealed open ports for SMB, LDAP, Kerberos, HTTP, and HTTPS. Additionally, it identified one domain and one subdomain.

![00 - nmap and domains](https://github.com/user-attachments/assets/a4d2e184-1301-4bdf-ab45-bde5d3e4d71d)

![01 - 2 domains](https://github.com/user-attachments/assets/87c6ff42-3a83-4102-b2dc-762050472da5)

### Directory BruteForce
Performed directory brute-forcing on the HTTPS port for both the domain and subdomain, which led to the discovery of additional hidden directories.

![02 - watch dirbuster](https://github.com/user-attachments/assets/4e338767-61a0-4b72-83b1-0b44b64f39b5)

![03 - admin](https://github.com/user-attachments/assets/09b67220-6020-41f1-a1dc-522788b26441)

![04 - admin master](https://github.com/user-attachments/assets/17f7b490-c2ae-484d-ade2-fc77e4c88f3f)

## Exploitation
### SQLi
Discovered search.php under the subdomain, which was vulnerable to SQL injection. Exploiting this vulnerability allowed me to enumerate the database and identify valid user credentials for the website.

![05 - found sqli](https://github.com/user-attachments/assets/207e3c77-59b0-4e8c-aa12-6b43e7579d22)

![06 - sqli string_agg](https://github.com/user-attachments/assets/66304587-9897-4068-888a-fadb4e2d5490)

![07 - sqli password hashes](https://github.com/user-attachments/assets/12c228c4-ddf8-439e-bda4-55fbc904e352)

### Cracking Hashes
The credentials retrieved via SQL injection were hashed. I used hashes.com to crack the hashes and recover the plaintext passwords. Using these, I performed a brute-force attack against the login page and successfully identified valid credentials, which granted access to the admin panel.

![08 - cracked](https://github.com/user-attachments/assets/7fd8a4c5-ac85-41bf-8ce7-8ad94ba2011e)

![09 - got the user](https://github.com/user-attachments/assets/60d687d6-0e77-4ba8-b7d4-476a3dd596bc)

![10 - can login admin panel with yoshihide](https://github.com/user-attachments/assets/2ba6cf12-903f-4e09-96fa-1e6c4312f0fe)

### Parameter Fuzzing
Within the admin panel, I identified a GET parameter responsible for rendering different pages. Using parameter fuzzing, I discovered an additional undocumented parameter vulnerable to PHP file inclusion. This vulnerability also allowed the inclusion of Base64-encoded PHP payloads, enabling further exploitation.

![11 - parameters](https://github.com/user-attachments/assets/084dfc02-8058-44d0-9b4d-ce5a3c5df19c)

![12 - parameter fuzzing](https://github.com/user-attachments/assets/acfe1550-f869-4114-9c20-c0eec36081f5)

![13 - parameter debug](https://github.com/user-attachments/assets/40eca566-08df-440d-b75d-5a6b3130c477)

![14 - base64 pages](https://github.com/user-attachments/assets/7939b3aa-eaf4-405e-a13b-49c8f152e1c9)

### PHP File Inclusion to RCE
I obtained the Base64-encoded source code of index.php and master.php. The index.php file directly includes files using the previously discovered GET parameter, confirming the Local File Inclusion vulnerability. More critically, master.php accepts an include parameter via POST, which it processes using file_get_contents and eval. This allowed me to remotely supply and execute arbitrary PHP code, ultimately resulting in a web shell on the target system.

![15 - index directly includes files](https://github.com/user-attachments/assets/5cb363dc-67bd-4afb-80a1-dd2d3ee7d0f6)

![16 - master executes files](https://github.com/user-attachments/assets/d29a550b-6a14-48f3-9f0d-5cf094ac1c2e)

![17 - send post data](https://github.com/user-attachments/assets/a39ceca2-cf0e-4abf-b2c5-cfc541baab55)

![18 - got the shell](https://github.com/user-attachments/assets/78fca67a-2531-4745-bdea-3ebc47822805)

### Checking MSSQL Databases
From the web shell, I was able to execute the sqlcmd utility and enumerate available databases. I identified a backup database, but initially lacked the necessary permissions to access it. However, upon reviewing the index.php source code, I found a hardcoded database administrator password. Using these credentials, I successfully authenticated and queried the backup database.

![19 - no permission](https://github.com/user-attachments/assets/fbc23dea-dddf-46c0-a772-7c04ef35d68e)

![20 - index php db user](https://github.com/user-attachments/assets/ffa2dcd9-ce7b-4127-a395-62187f86f235)

![21 - got some users](https://github.com/user-attachments/assets/ed7d5701-ead5-4226-af5b-aaa4d12c2848)

Using the database query, I retrieved the user’s password. With these credentials, I accessed a WinRM shell since the user had permission to run PowerShell Remoting (PSRemote).

![22 - got the user](https://github.com/user-attachments/assets/e9fb86fb-531f-47d9-895e-3eadc05832c5)

## Privilege Escalation
### WinPEAS
Running WinPEAS revealed that LAPS (Local Administrator Password Solution) was enabled on the system. Additionally, stored Firefox credentials were discovered.

![23 - winpeas output](https://github.com/user-attachments/assets/5c4a979c-5041-454d-98a0-7d14e9ff79e7)

### BloodHound
I began downloading the stored Firefox credentials for later decryption. While the download was in progress, I ran BloodHound-Python, which revealed that the user JDGodd has privileges that can be leveraged to read the LAPS password.

![24 - ran bloodhound python](https://github.com/user-attachments/assets/c0eec0d9-041f-4d0d-9997-213ecbf1d01e)

![25 - bloodhound](https://github.com/user-attachments/assets/5c11f808-7a74-424f-acc2-b8041c3f28e6)

### Firefox Decrypt
Decrypting the Firefox credentials revealed several usernames and passwords. After brute-forcing, I obtained a valid password for the user JDGodd. However, this user did not have permission to use PowerShell Remoting (PSRemote).

![26 - decrypted](https://github.com/user-attachments/assets/2141c0d5-03da-443a-9bac-0a1039451d37)

![27 - JDGodd](https://github.com/user-attachments/assets/f16af00e-cacd-4351-95ca-677c6331b0c7)

### Exploiting WriteOwner to Add Member to Group
Although JDGodd lacked PSRemote permissions, I discovered that this user had WriteOwner permissions over the Core Staff group. Using my current session, I created a credential object for JDGodd. Then, leveraging these credentials, I added JDGodd to the Core Staff group, which possessed the ReadLapsPassword permission.

![28 - added jdgodd to group](https://github.com/user-attachments/assets/08e8b451-57c1-4119-bc46-c2ecf20af8ae)

### Reading LAPS Password
I then read the LAPS password directly and gained administrative access to the system.

![29 - got the password for admin](https://github.com/user-attachments/assets/91d37923-651f-4724-80c9-4d5c1b22b0cd)

![30 - gg](https://github.com/user-attachments/assets/d2ba27e5-d528-4b0f-b53a-577333a0cfa1)

## Pwned
The machine was fully compromised.

![pwned](https://github.com/user-attachments/assets/163419a5-316c-4c2a-96dc-19474b0d6ab7)
