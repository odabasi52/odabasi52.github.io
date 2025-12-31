---
layout: post
title: "AuthBy - Proving Grounds Practice"
summary: "FTP anonymous enumeration → user discovery from .uac files → admin:admin credentials via brute-force → .htpasswd and .htaccess file access → Apache Basic Authentication hash cracking via hashcat → web portal login → reverse PHP shell upload via FTP put → SeImpersonatePrivilege check (Windows Server 2008 not vulnerable) → MS11-046 kernel vulnerability → kernel exploit execution via windows-kernel-exploits repository → SYSTEM shell"
---

# AuthBy - Proving Grounds Practice

## Enumeration
### Nmap 
Initial Nmap scan revealed uncommon ports and an FTP port were open.

<img width="1288" height="862" alt="00 - nmap" src="https://github.com/user-attachments/assets/40d4080f-2f63-4ee5-9ac6-1fabcbd88fba" />

### FTP Enumearation
FTP has anonymous session available but user had no read or write permissions.

<img width="1114" height="573" alt="01 - ftp anon" src="https://github.com/user-attachments/assets/b8c8ba3a-c67b-4a52-a6fc-4d235b741591" />

However, I found uac files which revealed ftp usernames.

<img width="796" height="304" alt="01 - ftp anon available users" src="https://github.com/user-attachments/assets/8fc7cb43-7a0b-432d-9e47-dd30a0b4c14c" />

Then brute forced with ftp wordlist and found out admin:admin is also a valid credential.

<img width="1917" height="627" alt="02 - admin admin is also allowed" src="https://github.com/user-attachments/assets/4a3c6f88-9d61-4147-8a07-2b19e1fcfb7d" />

## Exploitation
### .htpasswd cracking
Logged in as admin and found that 3 files were readable ('index.php', '.htpasswd', '.htaccess'). Then I did some research and found out .htaccess file is used to restrict website by setting basic auth and .httpasswd file is used to store username and hashed password.

<img width="1508" height="845" alt="03 - limiting and has" src="https://github.com/user-attachments/assets/1c4f2b5f-e916-4006-97e4-7c9a2ebedabf" />

Then I simply cracked the hash using hashcat.

<img width="1608" height="324" alt="04 - cracked" src="https://github.com/user-attachments/assets/f0e095d2-0675-4cc4-95b8-d729dcb34a09" />

<img width="715" height="245" alt="05 - cracked real" src="https://github.com/user-attachments/assets/0eba4ed4-9c26-4e1f-ad74-6ec6ad3304d7" />

### WEB Login
Then logged in to the website running on port 242 which only showed index.php file.

<img width="1761" height="304" alt="06 - logged in to web" src="https://github.com/user-attachments/assets/6e3b99f7-d969-4ec3-8e0d-dd86fd8a5d41" />

I then tested ftp to put files and it worked. I simply uploaded reverse php shell via ftp put and got a reverse shell.

<img width="1031" height="580" alt="07 - revshell" src="https://github.com/user-attachments/assets/41e7f72a-b1bd-445c-b79a-7fe53e243558" />

<img width="1100" height="448" alt="08 - got it" src="https://github.com/user-attachments/assets/543a27e1-2df7-4dc3-8940-95e1eedc58b9" />

### User Flag
Then obtained user flag.

<img width="751" height="303" alt="09 - local flag" src="https://github.com/user-attachments/assets/f818d999-8056-48dc-a9dd-3000f1b3bdf4" />

## Privilege Escalation
### SeImpersonatePrivilege
The SeImpersonatePrivilege was enabled for apache user.

<img width="1420" height="702" alt="10 - privilege" src="https://github.com/user-attachments/assets/812d0be5-3f56-4ce6-9769-9f6073f7a9bb" />

I tried to exploit it with many methods and it did not work. I later found out that on older Windows versions (such as Windows 7 or Server 2008 R2), the combase.dll library does not exist and vulnerability occurs because of that dll.
So below are vulnerable:
- Windows Server 2012 - Windows Server 2022 
- Windows8 - Windows 11

But, current machine is not vulnerable because it is Windows Server 2008.

### MS11-046
Then I checked system version. Found out that the version has kernel-level privilege escalation vulnerability.

<img width="1420" height="702" alt="11 - version" src="https://github.com/user-attachments/assets/cb19b7ec-f0a4-42ba-9f71-91b63a666c04" />

<img width="1313" height="843" alt="12 - exploit" src="https://github.com/user-attachments/assets/7acb9912-7762-44d1-939b-868c99bc5e8e" />

While searching to find exploit I found [windows-kernel-exploits repo](https://github.com/SecWiki/windows-kernel-exploits/) which included many executable exploit files for kernel exploits.

<img width="1920" height="843" alt="13 - github" src="https://github.com/user-attachments/assets/39831efb-4265-4559-98c2-b913f722e339" />

So I simply uplaoded it and ran it and got the SYSTEM shell.

<img width="701" height="309" alt="14 - priv esc" src="https://github.com/user-attachments/assets/bc746038-dd2a-42d7-938f-ce0e5d2011a4" />

Then read the root flag.

<img width="469" height="65" alt="16 - got it" src="https://github.com/user-attachments/assets/f6a80140-5ab0-4001-a85e-864267ccc989" />
