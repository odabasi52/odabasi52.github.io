---
layout: post
title: "Keeper - Hack The Box"
summary: "Discovered Request Tracker website with default root credentials, logged in and found non-root user in admin panel, extracted user credentials from user settings page, gained SSH access with discovered credentials, found KeePass dump and KDBX file in user home directory, exploited CVE-2023-32784 KeePass memory dump vulnerability with keepass-dump-extractor to create wordlist, cracked KDBX master password with wordlist, used kpcli to parse KDBX (due to non-unicode characters), extracted PuTTy SSH key from database, converted PuTTy key to OpenSSH format with puttygen, gained root shell via SSH."
---

# Keeper - Hack The Box

## Enumeration
### Nmap
Initial NMAP scan revealed  SSH, HTTP ports are open.

<img width="790" height="246" alt="00 - nmap" src="https://github.com/user-attachments/assets/817e091f-5257-416f-bf4a-aeb644f0b178" />

### WEB Enumeration
Visiting the HTTP website revealed a domain, so I added it to hosts file.

<img width="536" height="200" alt="01 - website" src="https://github.com/user-attachments/assets/e1f36ce3-390d-4480-845e-d5b2dc4bb8af" />

Searching "request tracker default credentials" on the internet revealed a root credential and I logged in to the website.

<img width="1463" height="537" alt="02 - root password" src="https://github.com/user-attachments/assets/e1d7ebfd-714a-4441-b3e5-768b5a470ca6" />

## Exploitation
Inside the website under Admin -> Users -> Select, there was a user other than the root.

<img width="1443" height="532" alt="03 Admin-Users-Select" src="https://github.com/user-attachments/assets/016cdb51-96e1-4f58-9c33-ce88c2d14493" />

Clicking to it, and analyzing it revealed default password for that user.

<img width="1316" height="798" alt="04 - password" src="https://github.com/user-attachments/assets/998d0afa-5721-4f3e-b198-ff0b26a555be" />

So I simply logged in using SSH.

<img width="665" height="315" alt="05 - user" src="https://github.com/user-attachments/assets/af1a91ba-47c0-47e8-b55e-4ca9c8d43a93" />

## Privilege Escalation
On the user's home directory, there was a zipped file. Inside of it there was keepass dump and kdbx file.

<img width="670" height="276" alt="06 - rt3000" src="https://github.com/user-attachments/assets/c615b4ec-c0b4-47ae-a22e-7cbf0758a13c" />

So I transfered those files to my computer using scp and started analyzing it.

### CVE-2023-32784
This version of keepass was vulnerable to [CVE-2023-32784](https://www.cve.org/CVERecord?id=CVE-2023-32784) which can be explained as "In KeePass 2.x before 2.54, it is possible to recover the cleartext master password from a memory dump".

So at first I tried to dump password with [this](https://github.com/z-jxy/keepass_dump) tool but could not dump. Then I used [keepass-dump-extractor](https://crates.io/crates/keepass-dump-extractor) to extract a wordlist.

<img width="1384" height="167" alt="07 - create keepass list from dumps" src="https://github.com/user-attachments/assets/3e12c39e-c67c-4c0c-855a-a11be90e5675" />

Then using the wordlist I cracked the kdbx file.

<img width="1737" height="619" alt="08 - cracked" src="https://github.com/user-attachments/assets/613c1f65-c0f2-4dac-b49e-adae351081e0" />

After cracking it I tried to login with keepass2 but it did not work because password had some non-unicode characters. So I used kpcli to login.

<img width="578" height="146" alt="09 - kpcli login" src="https://github.com/user-attachments/assets/1f570a9b-f418-4d3b-8f93-9ab9477bbd8c" />

Inside the kpcli we can use commands like cd, ls. Some enumeration revealed two ticket files. 

I can run show -f <number> to show the record. The first record revealed Putty SSH key inside it.

<img width="780" height="655" alt="10 -ticket file" src="https://github.com/user-attachments/assets/8b27f779-10b5-44be-a5cc-a2e7754619ad" />

So at first I downloaded putty-tools then run the command puttygen to create a openssh key "id_rsa" from the PuTTy key.

<img width="654" height="520" alt="11 - putty to openssh" src="https://github.com/user-attachments/assets/4025e30c-c3a4-4240-9b07-8fdcbc5f6023" />

Then using that key I got the root.

<img width="953" height="307" alt="12 - ssh" src="https://github.com/user-attachments/assets/00317f64-7c87-4546-8b24-5e120ac36e98" />

## Pwned
The machine was pwned.

<img width="723" height="701" alt="13 - pwned" src="https://github.com/user-attachments/assets/00773f0b-8b81-4143-a268-0aa267d0be01" />



