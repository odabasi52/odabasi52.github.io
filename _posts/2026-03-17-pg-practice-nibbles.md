---
layout: post
title: "Nibbles - Proving Grounds Practice"
summary: "PostgreSQL default credentials postgres:postgres → PostgreSQL 11.7 → CVE-2019-9193 RCE → user shell → SUID find → root"
---

# Nibbles - Proving Grounds Practice

## Enumeration
### Nmap
Initial nmap scan revealed FTP, SMB, HTTP and PostgreSQL ports were open.

<img width="880" height="530" alt="00nmap" src="https://github.com/user-attachments/assets/96a2773c-ac05-4e00-b64d-9b012eed9c61" />

### PostgreSQL Enumeration
At first I tried web enumeration and directory brute forcing but get nothing. Then I tried FTP and SMB brute forcing and again got nothing. Later, I tried default credentials `postgres:postgres` for PostgreSQL service and it worked.

<img width="1039" height="208" alt="01default-creds postgre" src="https://github.com/user-attachments/assets/2134488c-0ced-4670-b386-7c1f9812b141" />

I then checked version and found out it was `PostgreSQL 11.7`.

<img width="946" height="138" alt="02version" src="https://github.com/user-attachments/assets/0d49de57-a330-4f9f-a11c-e73ef400b1c2" />

## Exploitation
### CVE-2019-9193
In PostgreSQL 9.3 through 11.7, the "COPY TO/FROM PROGRAM" function allows superusers and users in the 'pg_execute_server_program' group to execute arbitrary code in the context of the database's operating system user. This functionality is enabled by default and can be abused to run arbitrary operating system commands on Windows, Linux, and macOS. NOTE: Third parties claim/state this is not an issue because PostgreSQL functionality for ‘COPY TO/FROM PROGRAM’ is acting as intended. References state that in PostgreSQL, a superuser can execute commands as the server user without using the ‘COPY FROM PROGRAM’.

There was a CVE assigned for this version. After some research I found and exploit: [https://www.exploit-db.com/exploits/50847](https://www.exploit-db.com/exploits/50847)

Executing it got me remote code execution.

<img width="619" height="245" alt="03exploited" src="https://github.com/user-attachments/assets/8c39b20e-bc9b-4fa8-aa3e-ac69f9eafbf6" />

Then I simply executed a reverse shell and obtained user shell.

<img width="893" height="364" alt="04revshell" src="https://github.com/user-attachments/assets/eb8d1a11-fbef-4e98-938f-f41c765c8574" />

<img width="843" height="669" alt="05localflag" src="https://github.com/user-attachments/assets/7ee7922d-239a-4103-93f5-5b509ca259d7" />

## Privilege Escalation
### find SUID
I executed below command to locate SUID binaries.
```bash
find / -user root -perm -4000 -exec ls -ldb {} \; 2>/dev/null
```

find binary was SUID binary.

<img width="835" height="259" alt="06suid" src="https://github.com/user-attachments/assets/70b4d167-4b6e-4e23-b25b-89c4abc00cf7" />

I simply executed necessary command from gtfobins to obtain root shell.
```bash
find . -exec /bin/sh -p \; -quit
```

<img width="699" height="402" alt="07gg" src="https://github.com/user-attachments/assets/2ad66df3-cc3b-4d29-81c2-02d04c80ccc0" />
