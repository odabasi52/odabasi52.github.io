---
layout: post
title: "Access - Hack The Box"
summary: "FTP Anonymous → MDB (.mdb) file → strings to read password → encrypted zip → decrypt zip usin 7z → PST (.pst) file → Online PST (Outlook Messages) interpreter or readpst → user password → user shell → stored credentials (cmdkey /list) → runas with nc64.exe → Administrator"
---

# Access - Hack The Box
### Nmap
Initial Nmap scan revealed HTTP, TELNET and FTP ports.

<img width="1025" height="408" alt="00 - nmap" src="https://github.com/user-attachments/assets/ca28911b-30bc-4dae-8c7a-3d389f6835c1" />

### FTP Anonymous
There was an FTP anonymous login. Inside the FTP there was '.mdb' file and an encrypted zip file. 

<img width="917" height="301" alt="01 - anonymous" src="https://github.com/user-attachments/assets/679ae657-4ebd-4ccb-a84a-c8cfa6d9209a" />

### MDB File
'.mdb' is format for legacy Microsoft Access database. I tried to open the file but it did not work, so I did strings and one of the strings seemed like it was a password.

<img width="418" height="92" alt="02 - password" src="https://github.com/user-attachments/assets/e8d28af0-f0b0-4d0f-ae6d-1715d816bd66" />

### Unzip Encrypted Zip
So using '7z' I decrypted and unzipped the zip file.

<img width="749" height="292" alt="03 - extracted" src="https://github.com/user-attachments/assets/43239652-9ad2-457d-abe1-31a42da45e5c" />

### PST File
Inside the zip there was a PST file. The '.pst' files are files that store the copied of Outlook messages. So I used online '.pst' interpreter and got the password.

<img width="1919" height="652" alt="04 - password" src="https://github.com/user-attachments/assets/d2008cf3-ac5e-4e1c-85ff-62f06c1784a4" />

But I could also use 'readpst' command line application to read the pst file.

<img width="599" height="92" alt="04 - password 2" src="https://github.com/user-attachments/assets/e49a5fa4-9e4b-4b80-9ca4-da09b2a03111" />

## Exploitation
So the PST file revealed a username and password. I simply connected to telnet and got the user flag.

<img width="744" height="286" alt="05 - got the user" src="https://github.com/user-attachments/assets/7b40946d-5859-43f1-939b-a4ad04209b4e" />

<img width="830" height="470" alt="06 - got the user" src="https://github.com/user-attachments/assets/29400862-625b-4630-b1a7-9319f065d47b" />

## Privilege Escalation
Then I set up an SMB Share and tried to run winPEAS.exe which did not work. Then tried to copy reverse shell on the website's directory which also did not work. 
Then I opened windows privilege escalation cheatsheet and started to try one by one. The stored credentials worked.
I ran 'cmdkey /list' to check if there are any stored credentials.

<img width="793" height="160" alt="07 - cmdkey stored password" src="https://github.com/user-attachments/assets/9759a038-c43a-4415-95ae-b956f7fffd8f" />

Then using the SMB Share I transfered nc64.exe file.

<img width="761" height="57" alt="08 - smb share" src="https://github.com/user-attachments/assets/a5ef8f86-faf3-459f-928a-8798a76821a0" />

<img width="1326" height="137" alt="09 - copy" src="https://github.com/user-attachments/assets/fffbe1b3-be19-43e5-aac5-944f2cc476f9" />

And then simply used 'runas' application to run nc64 as Administrator and get a reverse shell.

<img width="720" height="334" alt="10 - got it" src="https://github.com/user-attachments/assets/61c4ca27-77cb-4300-a6be-6e146ecf459c" />

## Pwned
The machine was fully compromised.

<img width="811" height="684" alt="pwned" src="https://github.com/user-attachments/assets/11f97bc3-d9d1-4ae7-90cd-9853fba143d5" />
