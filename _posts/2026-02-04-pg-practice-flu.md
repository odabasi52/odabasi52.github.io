---
layout: post
title: "Flu - Proving Grounds Practice"
summary: "Atlassian Confluence 7.13.6 → CVE-2022-26134 → Remote Code Execution (RCE) → pspy64 cron jobs → writeable cron file → root"
---

# Flu - Proving Grounds Practice

## Enumeration
### Nmap
Initial nmap scan revealed SSH and port 8090 were open. Moreover, it showed that port 8090 was a Confluence application.

<img width="905" height="689" alt="00 - nmap" src="https://github.com/user-attachments/assets/bdf2c55a-46a5-4419-ae29-c64526c13e70" />

### Web Enumeration
Visiting the web page revealed that `Atlassian Confluence` application was version `7.13.6`

<img width="1506" height="648" alt="01 - confuence 7 13 6" src="https://github.com/user-attachments/assets/b5816fd8-245f-4955-9be4-1a45938c64ba" />

## Exploitation
### CVE-2022-26134
In affected versions of Confluence Server and Data Center, an OGNL injection vulnerability exists that would allow an unauthenticated attacker to execute arbitrary code on a Confluence Server or Data Center instance. The affected versions are from 1.3.0 before 7.4.17, `from 7.13.0 before 7.13.7`, from 7.14.0 before 7.14.3, from 7.15.0 before 7.15.2, from 7.16.0 before 7.16.4, from 7.17.0 before 7.17.4, and from 7.18.0 before 7.18.1.

Target version was vulnerable to `CVE-2022-26134`.

<img width="1920" height="411" alt="02 - exploit" src="https://github.com/user-attachments/assets/e651d381-6146-4c45-97fb-8ff046b3f8c4" />

I did some research and found [jbaines-r7/through_the_wire](https://github.com/jbaines-r7/through_the_wire) repository, which includes an exploit for this vulnerability.

<img width="1685" height="750" alt="03 - exploit" src="https://github.com/user-attachments/assets/e84d71ec-834e-4d80-ae89-fa3c42410d13" />

I simply executed it and obtained the reverse shell.

<img width="1182" height="747" alt="04 - revshell" src="https://github.com/user-attachments/assets/128e2062-ca7b-4f9b-aae3-2a784544decd" />

And I read the user flag.

<img width="731" height="354" alt="05 - flag" src="https://github.com/user-attachments/assets/9dbe24a2-8d38-461f-b2b3-25143d17f02d" />

## Privilege Escalation
### pspy64 cron job
I executed `pspy64` and found out that target was running a cron job as root.

<img width="1248" height="134" alt="06 - pspy64 suspicious" src="https://github.com/user-attachments/assets/2cf96d7a-1074-4b0f-b154-dfbf27bd0d77" />

Then I read the `/opt/log-backup.sh` file. I also checked permissions and found out I could write on it.

<img width="724" height="348" alt="07 - opt backup" src="https://github.com/user-attachments/assets/6f1e5aa6-618e-41f2-9a2f-7abbc7b331ba" />

I simply the updated script to add SUID permission to bash.

<img width="836" height="358" alt="08 - update script" src="https://github.com/user-attachments/assets/12b56b62-8906-4cef-aae0-239bbeb798db" />

And I got the root.

<img width="768" height="458" alt="09 - root" src="https://github.com/user-attachments/assets/f01dcf5e-5c23-4ae9-b207-009211ea9ef9" />
