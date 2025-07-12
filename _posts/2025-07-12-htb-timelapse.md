# Timelapse - Hack The Box

## Enumeration
### Nmap
The Nmap scan revealed open ports for SMB, LDAP, and Kerberos, which likely indicates that the target is a Domain Controller.

<img width="1397" height="856" alt="00 - nmap" src="https://github.com/user-attachments/assets/85a71988-4812-41fe-98d8-546668161880" />

### SMB
Enumerating SMB shares revealed that a null session login was permitted. Among the accessible shares was a ZIP file, which appeared to be encrypted.

<img width="1623" height="251" alt="01 - smb shares" src="https://github.com/user-attachments/assets/3ac4d9e7-7519-479a-85a7-bb5f6fc2ae22" />

### Cracking with John
Using zip2john followed by john with the rockyou.txt wordlist, the password for the ZIP file was successfully cracked, revealing a .pfx file. Then, by applying pfx2john and cracking it again with john, the password for the PFX file was recovered. 

<img width="981" height="186" alt="02 - cracked zip" src="https://github.com/user-attachments/assets/a6d5d10a-c172-40c2-8280-ff31f6d6ae0a" />

<img width="1028" height="265" alt="03 - cracked pfx" src="https://github.com/user-attachments/assets/f24d1d1a-8d17-40f1-bc28-655cc9d22460" />

This allowed the extraction of the certificate and the associated private key.

<img width="758" height="571" alt="04 - certificate" src="https://github.com/user-attachments/assets/210374a8-c0b1-4120-abed-dfabba0bcc8a" />

<img width="781" height="286" alt="05 - key" src="https://github.com/user-attachments/assets/289dc021-cbef-42f3-a543-c8f7dc97a39e" />

## Exploitation
Next, I reviewed the available options for Evil-WinRM. Since the service was running over HTTPS on port 5986, I used the -S flag. To authenticate using the previously extracted credentials, I supplied the private key and certificate with the -k (private key) and -c (certificate) options respectively.

<img width="1330" height="529" alt="06 - options" src="https://github.com/user-attachments/assets/851deec0-b872-49a5-85fc-2b41f2fe497a" />

By running Evil-WinRM with the extracted certificate and private key over HTTPS (-S), access was successfully obtained to the remote system, resulting in a shell as the user.

<img width="756" height="306" alt="07 - user" src="https://github.com/user-attachments/assets/300a9b2a-0acb-4932-9e59-d0c0a5e769d3" />

## Privilege Escalation
Initially, I was unable to run WinPEAS on the target system due to execution restrictions. However, by leveraging one of the techniques described in [this article](https://g3tsyst3m.github.io/privilege%20escalation/Creative-UAC-Bypass-Methods-for-the-Modern-Era/) on creative UAC bypass methods, I successfully executed WinPEAS. The tool revealed the presence of a PowerShell history file, which could potentially contain sensitive commands or credentials.

<img width="1618" height="182" alt="08 - uac" src="https://github.com/user-attachments/assets/964b2d44-b3bf-476b-988f-07b8956bff9d" />

The PowerShell history file contained credentials for a service account, which were stored in plaintext. These credentials provided an opportunity to further escalate privileges or access additional resources within the environment.

<img width="1190" height="191" alt="09 - history" src="https://github.com/user-attachments/assets/e6a337e9-4212-4562-9830-c2b70d7fff5b" />

<img width="1190" height="207" alt="10 - svc" src="https://github.com/user-attachments/assets/cd8ebd93-2659-46af-9d8c-3740a6ad28f2" />

After obtaining the service account credentials, I ran BloodHound to analyze Active Directory permissions. The analysis revealed that the service account had the ability to read LAPS (Local Administrator Password Solution) passwords, which could be leveraged to obtain local administrator credentials on domain-joined machines.

<img width="1045" height="415" alt="10 - svc group" src="https://github.com/user-attachments/assets/c0922b9e-9b7c-439f-872e-150101339dc9" />

### 1st Way: Windows
At this point, I had two potential paths for privilege escalation. However, due to Windows Defender actively blocking PowerView, I opted for a simpler and stealthier method. Using the service account credentials, I executed the following command to retrieve the LAPS-managed local administrator password for the domain controller (DC01):
```powershell
Get-ADComputer DC01 -Properties ms-Mcs-AdmPwd
```
This successfully returned the plaintext local administrator password, enabling full access to the domain controller.

<img width="975" height="296" alt="12 - windows way" src="https://github.com/user-attachments/assets/521e5698-55d6-4cc5-93b1-4c247b57910c" />

### 2nd Way: Linux
As an alternative method, I could use the pylaps.py script on my Linux machine to retrieve the LAPS password. By supplying the service account credentials, the script can query Active Directory for LAPS-managed local admin passwords.

<img width="1003" height="226" alt="11 - linux way" src="https://github.com/user-attachments/assets/f1c22ddd-096d-428a-b2e9-9c2659f2800e" />

Using the retrieved LAPS password, I was able to log in as the local administrator on the domain controller, effectively gaining full administrative access to the system.

<img width="1399" height="365" alt="13 - root" src="https://github.com/user-attachments/assets/a1c379b3-5a51-4516-9106-3d2271b4ec76" />

## Pwned
The machine was fully compromised.

<img width="805" height="663" alt="pwned" src="https://github.com/user-attachments/assets/637a45af-bff6-4730-8177-613a8693c251" />
