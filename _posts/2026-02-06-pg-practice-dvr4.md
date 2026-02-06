---
layout: post
title: "DVR4 - Proving Grounds Practice"
summary: "Argus Surveillance DVR 4.0 → CVE-2018-15745 Path Traversal → Read user's private key (.ssh\\id_rsa) → SSH user shell → CVE-2022-25012 Weak Password Encryption → C:\\ProgramData\\PY_Software\\Argus Surveillance DVR\\DVRParams.ini contains hashed password → Run exploit to obtain password → RunAsCs with netcat → Administrator"
---

# DVR4 - Proving Grounds Practice

## Enumeration
### Nmap
Initial nmap scan revealed SSH, SMB and Port 8080 were open.

<img width="1204" height="701" alt="00 - nmap and proxy DVR" src="https://github.com/user-attachments/assets/94d1289c-d7fd-4a53-bce6-5a47f26bab5e" />

### Web Enumeration
Visiting the website revealed that it was `Argus Surveillance` web page.

<img width="1094" height="328" alt="01 - argus surveilance web" src="https://github.com/user-attachments/assets/1f48a842-212a-44ea-a6d7-9821bf49cb8f" />

Later, I checked the help page and found out that the version was `Argus Surveillance DVR 4.0`.

<img width="1280" height="426" alt="02 - version" src="https://github.com/user-attachments/assets/34ac43bf-7aeb-4931-8e0f-c470ec1a3810" />

## Exploitation
### CVE-2018-15745
Argus Surveillance DVR 4.0.0.0 devices allow Unauthenticated Directory Traversal, leading to File Disclosure via a ..%2F in the WEBACCOUNT.CGI RESULTPAGE parameter.

The version was vulnerable to path traversal. I tried it and it worked.

<img width="1666" height="293" alt="03 - directory traversal" src="https://github.com/user-attachments/assets/83271792-e61d-4f15-8a5e-92a0a65b3e65" />

Later, I checked usernames from the web page.

<img width="1283" height="478" alt="04 - users" src="https://github.com/user-attachments/assets/68563141-0674-4ea5-a1f9-222f2fb1f68a" />

Then I tried to read SSH private keys (id_rsa) for both user. And it worked for viewer user. Command can be seen below.

```bash
curl "http://192.168.165.179:8080/WEBACCOUNT.CGI?OkBtn=++Ok++&RESULTPAGE=..%2F..%2F..%2F..%2F..%2F..%2F..%2F..%2F..%2F..%2F..%2F..%2F..%2F..%2F..%2F..%2FUsers%2FViewer%2F.ssh%2Fid_rsa&USEREDIRECT=1&WEBACCOUNTID=&WEBACCOUNTPASSWORD="
```

<img width="1670" height="419" alt="05 - id_rsa" src="https://github.com/user-attachments/assets/daf7146c-0931-4bc7-90d9-ce9f3d44cefc" />

And using it I obtained the user shell.

<img width="739" height="512" alt="06 - local flag" src="https://github.com/user-attachments/assets/6c82b001-73c6-49c1-86d8-e187b5caed60" />

## Privilege Escalation
### CVE-2022-25012
Argus Surveillance DVR v4.0 employs weak password encryption.

So by reading `C:\ProgramData\PY_Software\Argus Surveillance DVR\DVRParams.ini` and obtaining password hashes, we can decrypt both users' passwords.

At first I read the `C:\ProgramData\PY_Software\Argus Surveillance DVR\DVRParams.ini` and noted password hashes.

<img width="1469" height="747" alt="07 - passwords" src="https://github.com/user-attachments/assets/58444c0d-7724-4228-90f0-7f2385f35bd8" />

Then I used [G4sp4rCS/CVE-2022-25012-POC](https://github.com/G4sp4rCS/CVE-2022-25012-POC) which simply decrypts the password. However, it can not decrypt special characters. So I checked and found the byte codes for special chars as seen below.

- ! = B398
- @ = 78A7
- \# = \<blank\>
- $ = D9A8

Running this tool revealed last byte was unkown. However, checking the special char byte codes, I found that it was `$`.

<img width="627" height="387" alt="08 - password" src="https://github.com/user-attachments/assets/97a5a8e7-c2a5-4546-91f5-da25d08a36c7" />

### RunAsCs
Later, I simply used `RunAsCs` with Administrator user and found password to obtain reverse shell using netcat.

<img width="965" height="51" alt="09 - command" src="https://github.com/user-attachments/assets/4aae9a26-d047-42bf-a4f4-0da4f490d352" />

I obtained the Administrator shell.

<img width="758" height="565" alt="10 - gg" src="https://github.com/user-attachments/assets/cbf233ec-2490-4004-80d9-152461e7a339" />


