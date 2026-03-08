---
layout: post
title: "SPX - Proving Grounds Practice"
summary: "phpinfo.php SPX entry → SPX 0.4.15 → CVE-2024-42007 path traversal → read index.php of tinyfilemanager (Tiny FileManager) to find hashes passwords → crack password with hashcat using rockyou.txt → reverse shell via tinyfilemanager upload → cracked password was user password → sudo make install → update Makefile to execute shell command → root"
---

# SPX - Proving Grounds Practice

## Enumeration
### Nmap
Initial nmap scan revealed SSH and HTTP ports were open.

<img width="829" height="374" alt="00 - nmap" src="https://github.com/user-attachments/assets/0e8a3f80-8ae6-49e1-97bc-44b47ece3535" />

### Web Enumeration
The website was Tiny File Manager site. I tried default credentials but they did not work.

<img width="1270" height="725" alt="01 - web" src="https://github.com/user-attachments/assets/771fdbdf-46d7-4019-b1bd-2588c81986ad" />

I then executed `nuclei` and found `phpinfo.php` file was available in site.

<img width="1625" height="824" alt="00 - nuclei" src="https://github.com/user-attachments/assets/0039a023-f8c1-4b57-a542-2374de74c3c5" />

Then visiting the endpoint revealed `SPX 0.4.15` was in use.

<img width="1261" height="552" alt="02 - spx" src="https://github.com/user-attachments/assets/260c519f-6605-4691-aa06-16b83bc27060" />

## Exploit
### CVE-2024-42007
SPX (aka php-spx) through 0.4.15 allows SPX_UI_URI Directory Traversal to read arbitrary files.

At first I searched for exploits and found one on github. But it was using hardcoded `SPX_KEY` value as seen in the image.

<img width="1920" height="723" alt="03 - found an exploit" src="https://github.com/user-attachments/assets/aaf0edbf-c565-4fc5-8e0f-072ff7e4114b" />

So as seen in phpinfo.php endpoint our SPX_KEY was `a2a90ca2f9f0ea04d267b16fb8e63800` and all I need to do is add SPX_UI_URI with it to apply path traversal.

<img width="1581" height="714" alt="04 - directory traversal" src="https://github.com/user-attachments/assets/83071725-d94c-4ec9-840a-242354b0705d" />

At first I read `/etc/passwd`. Then I read `index.php` file and found 2 hashed password.

<img width="1039" height="547" alt="05 - passwords" src="https://github.com/user-attachments/assets/15978f1e-2873-48a4-9a0e-6324f8bd408e" />

Then simply cracked them using `hashcat` with `rockyou.txt`.

<img width="1259" height="550" alt="06 - cracked" src="https://github.com/user-attachments/assets/9c16de66-aefa-402b-996e-8bb232ee43cf" />

And logged in as admin.

<img width="1200" height="452" alt="07 - admin login" src="https://github.com/user-attachments/assets/c45e948b-a919-4103-ab07-968e9a95c44e" />

Later, I uploaded a reverse shell and visiting the endpoint got me www-data shell.

<img width="1204" height="392" alt="08 - revshell" src="https://github.com/user-attachments/assets/9e894804-1f63-4a38-8f27-a8e764f6223b" />

<img width="834" height="457" alt="09 - revshell" src="https://github.com/user-attachments/assets/2a3c6d32-fb9c-4835-acc1-c2263489fbe4" />

### Cracked Password
After obtaining www-data shell I tried to switch to `profiler` user by trying two cracked passwords. `lowprofile` worked and I got user flag.

<img width="569" height="408" alt="10 - local" src="https://github.com/user-attachments/assets/749b77eb-3878-42cf-99af-b2d702401b8d" />

## Privilege Escalation
### sudo make install 
I could run make install inside php-spx directory as `sudo`.

<img width="818" height="201" alt="11 - sudo l" src="https://github.com/user-attachments/assets/be74a40b-5bb0-4c59-b430-aa753aba1e49" />

So at first I checked Makefile and found out it was executing shell commands.

<img width="599" height="586" alt="12 - makefile" src="https://github.com/user-attachments/assets/517297f1-2b8b-4d8a-b9c4-bc8cb4384a06" />

So I simply updated it to add `chmod +s /bin/bash`.

<img width="661" height="236" alt="13 - updated makefile" src="https://github.com/user-attachments/assets/dc720e94-3d9b-4110-af6b-2e53ff0ecae4" />

Then executed it and got root shell.

<img width="770" height="661" alt="15 - gg" src="https://github.com/user-attachments/assets/432f422d-70f2-488f-bfc7-fbf10f5b8a67" />
