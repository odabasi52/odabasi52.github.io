---
layout: post
title: "DriftingBlues6 - OffSec Proving Grounds"
summary: "Found robots.txt hint to append .zip extension, discovered password-protected scammer.zip, cracked with zip2john and John the Ripper, obtained Textpattern CMS credentials, uploaded PHP reverse shell, exploited Dirty COW (CVE-2016-5195) for root."
---

# DriftingBlues6 - OffSec Proving Grounds

## Objective
Deploy enumeration and web enumeration methods to identify vulnerabilities. Engage in password cracking techniques to gain unauthorized access. Capitalize on privilege escalation strategies to further elevate access. This lab is designed to apply your skills in system exploitation.

## Enumeration
### Nmap
Initially, I conducted an Nmap scan on the target host, which revealed only the HTTP service on port 80.

![00 - nmap](https://github.com/user-attachments/assets/b6e8a2a1-8174-4445-9b87-4c5145096f5f)

### Web Enumeration
While enumerating the web application, I discovered a robots.txt file that included a hint suggesting to append .zip to filenames during DirBuster scans.

![01 - robotstxt](https://github.com/user-attachments/assets/99f67ef6-27ca-48a2-abf2-024b7ca7db4d)

Using the .zip extension during my DirBuster scan, I discovered a file named scammer.zip, which was password-protected. I used zip2john to extract the password hash from scammer.zip and cracked it with John the Ripper. After extracting the archive, I found credentials stored inside.

![02 - zip](https://github.com/user-attachments/assets/24d74fa6-d69b-4941-acf2-68358f3db4a4)

![03 - cracked](https://github.com/user-attachments/assets/ca399448-4a80-4c5c-94b5-688c2c4d3ee5)

I used these credentials to log into a Textpattern CMS instance that I had previously discovered using DirBuster.

Inside the Textpattern CMS, I identified that it was running an outdated and unpatched version. I attempted several publicly available exploits against it, but none of them were successful.

![04 - exploit](https://github.com/user-attachments/assets/80e7f1be-59f9-4da9-ae03-3804a8b3eb11)

Since the automated exploits failed, I manually uploaded a simple web shell that executed commands via GET requests to verify code execution.
After confirming functionality with the basic web shell, I uploaded a PHP reverse shell, established a connection, and gained remote access to the server.

![05 - upload site](https://github.com/user-attachments/assets/07fe3f96-5abb-4c9c-bf01-7776b68a77c5)

![06 - exploit](https://github.com/user-attachments/assets/93a53901-e9a6-4de3-94ef-8a8c6e725c43)

![07 - exploited](https://github.com/user-attachments/assets/38d60a67-c5d1-4caa-8b5a-2ef4a3762f8d)

![08 - shell](https://github.com/user-attachments/assets/6b3ffaa4-8fbc-4b0c-b445-64bc1b4835c8)

## Privilege Escalation
I attempted several common privilege escalation techniques, but none of them were successful. After running uname -a, I noticed the system was running an outdated Linux kernel. I used Linux Exploit Suggester, which recommended the Dirty COW (CVE-2016-5195) exploit. I executed the Dirty COW exploit and successfully obtained a root shell.

![09 - exploits](https://github.com/user-attachments/assets/88a6258e-63b4-48f4-bbbc-d59611812c2f)

![10 - gg](https://github.com/user-attachments/assets/c8be84c1-7a73-48e2-9e9c-4249b9f05042)

