# ServMon - Hack The Box

## Enumeration
### Nmap
An Nmap scan identified several open ports, including FTP, HTTP, SSH, and HTTPS running on port 8443.

![00 - nmap output](https://github.com/user-attachments/assets/374be302-e5be-4343-b0d9-008dc45f68f8)

### FTP Anonymous
Upon inspecting the FTP service, anonymous login was enabled, which provided access to two usernames and a confidential file containing the location of a passwords.txt file.

![01 - ftp anon](https://github.com/user-attachments/assets/0960ecb4-2a0f-46a5-adcc-12c833e378a5)

![01 - ftp anon 2](https://github.com/user-attachments/assets/6721a33d-b2c3-4c12-8481-9c4cd3e8b9f7)

## Exploit
### WEB - Local File Inclusion
The web application identified was NVMS, which is known to be vulnerable to a Local File Inclusion (LFI) vulnerability. Leveraging this flaw, and using the file path obtained from the confidential file on the FTP server, the passwords.txt file could be read. This allowed for a password brute-force attack against identified usernames.

![02 - NVMS1000 path traversal](https://github.com/user-attachments/assets/63a02746-2a6e-47ac-bf30-08f1d6a60933)

### Brute Force
Using the extracted passwords.txt file, a successful brute-force attack was performed, resulting in valid login credentials for the user account 'nadine'.

![03 - got it](https://github.com/user-attachments/assets/1534159d-65d3-4f3e-b58e-cf08c8b3bc0a)

![04 - got the user](https://github.com/user-attachments/assets/55292d1a-8430-4386-8903-0996a30bf048)

## Privilege Escalation
Upon examining the application directories, several SQLite database files were discovered; however, their contents did not contain any useful or sensitive information.

### NSClient++
Further inspection of the Program Files directory revealed that NSClient++ was installed and actively running, with its web interface accessible on port 8443."
The installed NSClient++ was identified as version 0.5.2.35, which is known to contain a privilege escalation vulnerability that can be exploited to gain higher-level access on the system.

Upon further examination, the nsclient.ini configuration file was found to contain the NSClient++ admin password. Additionally, the configuration restricted admin access to 127.0.0.1. To bypass this restriction, port forwarding was utilized to access the web interface locally with administrative privileges.

![05 - nsclient++](https://github.com/user-attachments/assets/f5476703-459b-42fa-82c0-5726c1e82980)

![06 - port forwarding ](https://github.com/user-attachments/assets/851b664f-c343-4726-9f44-25c59ca4a0b2)

From this point, privilege escalation was straightforward. By leveraging the identified NSClient++ version and administrative access, the steps outlined in https://www.exploit-db.com/exploits/46802 were followed to successfully escalate privileges.

"Due to the complexity of the NSClient++ web interface, an automated exploit script was utilized to streamline the process. Executing the script successfully exploited the vulnerability and resulted in a SYSTEM-level shell.

![07 - exploit script](https://github.com/user-attachments/assets/d42ef742-66bd-45f9-b598-9ddf46def670)

![08 - exploit](https://github.com/user-attachments/assets/fdf3063e-f958-4057-9cdd-4b5233a2fd36)

![09 - gg](https://github.com/user-attachments/assets/96552286-c679-4242-8c4e-0c196592962d)

Consequently, the machine was fully compromised, granting complete control at the SYSTEM level.

![pwned](https://github.com/user-attachments/assets/98c88a83-d95e-459d-947e-862ba2899b4a)




