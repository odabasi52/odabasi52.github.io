---
layout: post
title: "BitForge - Proving Grounds Practice"
summary: "Simple Online Planning 1.52.01 (SOPlanning 1.52.01) → git-dumper (Git Dumper) tool → git log to show commit history → git show <commit_id> → DB Password → mysql login with --ssl-skip → Analyze Open Source SOPlanning code to find default admin password hash through github.dev → Update admin password with SQL → Simple Online Planning 1.52.01 (SOPlanning 1.52.01) CVE-2024-27115 Authenticated RCE → pspy64 to detect user password → sudo NOPASSWD flask run → update app.py to exploit flask run → root"
---

# BitForge - Proving Grounds Practice

## Enumeration
### Nmap
Initial nmap scan revealed SSH and HTTP ports were open. Moreover, it showed `.git` directory is accessible on website.

<img width="1548" height="710" alt="00 - nmap" src="https://github.com/user-attachments/assets/8be6f728-846c-45e8-b0d0-c898ece5f3ab" />

### Web Enumeration
Website directed us to `bitforge.lab` so I added it to `/etc/hosts` file.

<img width="1160" height="476" alt="01 - web" src="https://github.com/user-attachments/assets/1cbfccc3-be22-48a2-b142-bc13bafaacf9" />

Later, I found a subdomain in the website called `plan.bitforge.lab`.

<img width="1026" height="783" alt="02 - subdomain" src="https://github.com/user-attachments/assets/0b4d7816-4bbd-4cbc-9966-fab150bf3ea9" />

It was `Simple Online Planning 1.52.01 (SOPlanning 1.52.01)` website. 

<img width="1160" height="661" alt="03 - simple online planning 1 52 01" src="https://github.com/user-attachments/assets/0aafbfc0-1bdf-49c3-ba91-0ded51fc2820" />

## Exploitation
### git-dumper
I could not find any default credentials. However, as shown in nmap output I found `.git` directory.

<img width="825" height="530" alt="04 - config" src="https://github.com/user-attachments/assets/50459596-67fb-4752-9bc6-35b50355fc5e" />

So I used `git-dumper` tool to dump it.

<img width="677" height="361" alt="05 - git dumper" src="https://github.com/user-attachments/assets/8fb6f8be-8576-4e40-853b-dad5a7edbc45" />

Then checked `commit history` using `git log` command.

<img width="695" height="552" alt="06 - removed db" src="https://github.com/user-attachments/assets/e57449ba-e18c-48f7-b5ff-3d0580deddf7" />

Then used `git show <commit_id>` command and obtained DB password.

<img width="670" height="547" alt="07 - login creds" src="https://github.com/user-attachments/assets/452c99c9-bde3-41f8-bbed-6db9b8a87b3c" />

### MYSQL
Then I logged in to mysql but I added `--skip-ssl` flag to avoid TLS errors.

<img width="1023" height="809" alt="08 - mysql" src="https://github.com/user-attachments/assets/af5fc956-5401-4219-802e-2c40c65dc151" />

I read the admin password hash.

<img width="643" height="214" alt="09 - admin hash" src="https://github.com/user-attachments/assets/bad244e7-03d7-4864-9672-d855fe434fab" />

However, it was not crackable. I tried and it did not work. Later, I opened [https://github.dev/Worteks/soplanning](https://github.dev/Worteks/soplanning) to checkout default admin credentials and I found it.

<img width="1476" height="689" alt="10 - default admin" src="https://github.com/user-attachments/assets/b5d886e8-fdde-4804-a04b-badec59c7c87" />

Then I tried to update the password on DB and it worked.

<img width="999" height="253" alt="11 - updated" src="https://github.com/user-attachments/assets/a97be128-5fd3-4455-9be4-6b867e0048d9" />

I was able to login.

<img width="1522" height="709" alt="12 - logged in" src="https://github.com/user-attachments/assets/dc84dea1-5b4b-4e11-8807-ea94dd20c54c" />

### CVE-2024-27115 
An authenticated Remote Code Execution (RCE) vulnerability is found in the SO Planning online planning tool. With this vulnerability, an attacker can upload executable files that are moved to a publicly accessible folder before verifying any requirements. This leads to the possibility of execution of code on the underlying system when the file is triggered. The vulnerability has been remediated in version 1.52.02.

So there was a CVE for `Simple Online Planning 1.52.01 (SOPlanning 1.52.01)`. I found an exploit ([https://www.exploit-db.com/exploits/52082](https://www.exploit-db.com/exploits/52082)) and executed it.

<img width="865" height="277" alt="13 - shell" src="https://github.com/user-attachments/assets/e93ed231-e005-4e2b-aac8-21a7d34ec9d6" />

Later, to get a better shell I transfered pentest-monkey reverse shell.

<img width="970" height="132" alt="14 - transfer new shell" src="https://github.com/user-attachments/assets/e578e3e9-e2a0-484e-8364-2417cadfb538" />

Then obtained upgraded shell.

<img width="1569" height="725" alt="15 - updated shell" src="https://github.com/user-attachments/assets/02edeb1d-3954-487c-8919-09a4f9139afc" />

### PSPY64
Then I transfered `pspy64` and `linpeas.sh` files.

<img width="898" height="103" alt="16 - transfered files" src="https://github.com/user-attachments/assets/0dea8a68-de7b-40c1-a03d-d4f1539d8a8a" />

Executing `pspy64` revealed jack's password.

<img width="1228" height="79" alt="17 - pspy64" src="https://github.com/user-attachments/assets/4d1f073b-b582-4262-b00d-71088765622c" />

So I switched to jack and obtained user flag.

<img width="1064" height="495" alt="18 - jack local" src="https://github.com/user-attachments/assets/70cd0b1f-11ee-4da2-a1ef-a97380744ffe" />

## Privilege Escalation
### sudo -l (NOPASSWD flask run)
At first I switched to SSH shell. Then I executed `sudo -l` and found I could execute `flask_password_changer` as `sudo`.

It was `.sh` script. It was at first changing directory to `/opt/password_change_app` then running `flask run`.

`flask run` commands executed `app.py` on current directory. And we have write access to `app.py`.

<img width="1241" height="453" alt="19 - nopasswd" src="https://github.com/user-attachments/assets/0ebd74eb-84b9-4e4b-9e6e-e7c25b7310cc" />

So I updated `app.py` to execute `chmod +s /bin/bash`. And simply obtained root.

<img width="935" height="562" alt="20 - root" src="https://github.com/user-attachments/assets/03994a43-06f9-4d18-b19a-4c335ccf8c5c" />




