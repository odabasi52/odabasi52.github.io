---
layout: post
title: "Jeeves - Hack The Box"
summary: "Discovered Jenkins instance via directory brute force, wrote Groovy reverse shell in Jenkins script console for RCE, found SeImpersonatePrivilege but JuicyPotato didn't work, set up SMB file share server, transferred and executed WinPEAS finding CEH.kdbx KeePass file, cracked KDBX master password via keepass2john and John the Ripper, extracted passwords from KDBX, used NTLM hash from 'Backup Stuff' entry with psexec.py pass-the-hash for Administrator access, discovered root flag in alternate data streams (ADS) of hm.txt file."
---

# Jeeves - Hack The Box

## Enumeration
### Nmap
Initial Nmap enumeration revealed open HTTP, SMB and Jetty (50000) Port.

<img width="1068" height="702" alt="00 - nmap" src="https://github.com/user-attachments/assets/970b5477-c8c4-4379-b670-788438e63b8b" />

### Directory Brute Force
Applied directory brute force which revealed Jenkins application.

<img width="1617" height="367" alt="01 - brute" src="https://github.com/user-attachments/assets/a371ba00-0d6b-4672-8c59-5663124d50e5" />

## Exploitation
I could run Jenkins scripts without logging in. So I wrote a groovy reverse shell and got the shell.

<img width="1906" height="898" alt="02 - jenkins script console" src="https://github.com/user-attachments/assets/6b4b9e1b-462e-45c9-b455-1b2a775749a1" />

<img width="703" height="222" alt="03 - got a shell" src="https://github.com/user-attachments/assets/64a5a89f-f54a-409b-8a5e-93ef9f241eb3" />

Then simply got the user flag.

<img width="541" height="88" alt="04 - got the user" src="https://github.com/user-attachments/assets/8b9946e8-13be-4ec4-ae37-7466b54d954b" />

## Privilege Escalation
Initially I checked current user's privileges. It had SeImpersonatePrivilege, so I thought I could run JuicyPatato. But it did not work.

<img width="853" height="312" alt="05 - privilege" src="https://github.com/user-attachments/assets/f35c7926-e042-43d5-867a-c8dbcd814fd1" />

### Setting Up File Share Server
So I set up an SMB File Share server to share files from windows to linux or vice versa.

<img width="1605" height="287" alt="06 - File Transfer" src="https://github.com/user-attachments/assets/7a5123ed-2ba8-4030-9744-fd9943d2cbea" />

<img width="1065" height="111" alt="06 - File Transfer2" src="https://github.com/user-attachments/assets/741a584a-2781-4572-b5b6-e895a74038db" />

### winPEAS
Then transfered winPEAS and ran it. It revealed 'CEH.kdbx' file was available.

<img width="865" height="73" alt="07 - winPEAS" src="https://github.com/user-attachments/assets/c002d715-b78b-4ce3-a81d-f692b996c5b7" />

### Cracking KDBX
So using 'keepass2john' and then 'john' with 'rockyou.txt' wordlist, I was able to crack the master password.

<img width="1896" height="440" alt="08 - kdbx" src="https://github.com/user-attachments/assets/8370d55b-5733-487d-9a11-084ee12b8f9b" />

### Opening KDBX
Then using 'keepass2', I opened the KDBX and got some passwords.

<img width="936" height="44" alt="09 - 0 got some passwords" src="https://github.com/user-attachments/assets/bb0da8fc-90a5-4931-8d8f-c10ad8d81f3e" />

<img width="1148" height="597" alt="09 - got some passwords" src="https://github.com/user-attachments/assets/86d2000a-f1a5-4c30-82c0-9f60167375f4" />

### Getting Shell
All of them instead of Backup Stuff was cleartext passwords. I tried all of them against Administrator user and none of them worked. 
Backup Stuff password was NTLM hash so I though maybe it is Administrator's hash. I ran 'psexec.py' with hashes and got the shell.

<img width="1640" height="283" alt="10 - got user" src="https://github.com/user-attachments/assets/e75b735f-4853-4665-9fa4-105e38ef4a0b" />

### Getting Flag
Initially there was no flag to read. But there was an 'hm.txt' file that says "Look Deeper".

<img width="494" height="52" alt="11 - trying" src="https://github.com/user-attachments/assets/666bd5f6-63a6-43ad-ab92-441b5d49c87d" />

After some research, I learned about alternate data streams. [This](https://blog.netwrix.com/2022/12/16/alternate_data_stream/) post and [this](https://gist.github.com/chriselgee/bf41951d0b51d0ef9d2504a36921cd13) github page explains what is it and how can it be used. So using these informations, I read the alternate stream and got the root flag.

<img width="954" height="559" alt="12 - altrenate flag" src="https://github.com/user-attachments/assets/09921563-1ac9-4f45-b21e-964fff341520" />

## Pwned
The machine was fully compromised.

<img width="740" height="701" alt="pwned" src="https://github.com/user-attachments/assets/bc6261c2-51e7-4161-811c-5ad1a6a23c0c" />
