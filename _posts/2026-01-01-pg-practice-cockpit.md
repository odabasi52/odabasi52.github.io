---
layout: post
title: "Cockpit - Proving Grounds Practice"
summary: "Directory brute forcing with raft-medium-files.txt → SQL Injection admin'-- - → Cockpit CMS Login → Cockpit CMS add SSH public key → SSH Login → TAR Wildcard abuse using sudo privileges"
---

# Cockpit - Proving Grounds Practice

## Enumeration
### Nmap 
Initial Nmap scan revealed HTTP, SSH ports and 9090 ports were open.

<img width="1028" height="592" alt="00 - nmap" src="https://github.com/user-attachments/assets/b81b959b-9a87-445a-baa2-7d30760d02c7" />

### WEB Enumeration
The website at port 80 seemed like dummy website. I did directory enumeration and could not find any useful folder.

<img width="1920" height="783" alt="01 - website port 80" src="https://github.com/user-attachments/assets/3372fe1b-ca3b-4fbe-aa55-1cee02cf7ee7" />

Then checked 9090, it was also a website. It was Cockpit CMS website and I tried some known vulnerabilities but none of them worked.

<img width="1920" height="905" alt="02 - 9090 port" src="https://github.com/user-attachments/assets/dbc323f1-1e7f-400e-9042-91914b018c75" />

Then I used different wordlist `raft-medium-files.txt` from seclists which includes common files and it worked. I found login.php file on port 80.

<img width="1281" height="655" alt="03 - login website" src="https://github.com/user-attachments/assets/f175ebdc-33af-40ab-90ef-48f88ba90250" />

<img width="1920" height="913" alt="04 - website" src="https://github.com/user-attachments/assets/0bcb88f0-332a-4ce0-aab0-a317ed2d3906" />

## Exploitation
### SQL Injection
At first I tried simple ' to check if it would throw any errors. And indeed it threw and error.

<img width="1920" height="830" alt="05 - error" src="https://github.com/user-attachments/assets/e6e6277c-fba5-4750-a571-76d468c8dc64" />

Then tried OR 1=1, AND 1=1 and other common methods bot all of them were blocked.

<img width="1920" height="830" alt="06 - blocked" src="https://github.com/user-attachments/assets/ac91c006-fbdb-4b75-8e84-ccea04c95947" />

Then I simply tried admin' -- - and it was it, I simply got inside the website and obtained user passwords.

<img width="1920" height="830" alt="07 - 0 sqli" src="https://github.com/user-attachments/assets/29fdd82d-b46e-474f-9708-8586ee586cfa" />

<img width="1920" height="830" alt="07 - 1 sqli" src="https://github.com/user-attachments/assets/5cb882ca-f926-4413-8935-0726a887c491" />

### Cockpit CMS (Add SSH Public Key)
Then I base64 decoded user passwords and logged in to Cockpit CMS.

<img width="1920" height="909" alt="08 - logged in" src="https://github.com/user-attachments/assets/aef80251-6923-4326-849a-fcf4dc40c094" />

Then I simply added my local id_rsa.pub (ssh public key) to Cockpit CMS.

<img width="1920" height="909" alt="09 - ssh public key" src="https://github.com/user-attachments/assets/8c5eba18-2f4c-4646-acbe-1a09de0eba2d" />

And with this I got the user and its flag.

<img width="781" height="814" alt="10 - user flag" src="https://github.com/user-attachments/assets/8ab07075-432c-4a83-b084-b4370cd1b98f" />

## Privilege Escalation
### Tar Wildcard Abuse
sudo -l revealed I could run tar binary with wildcard (*) as root.

<img width="1337" height="125" alt="11 - sudo l" src="https://github.com/user-attachments/assets/e9250a6a-bfb2-4406-a9ef-5928d3056253" />

So it was simple. I applied steps in tar wildcard abuse:
```bash
mkdir tmp/tar_test
cd tmp/tar_test
echo 'echo "james ALL=(root) NOPASSWD: ALL" >> /etc/sudoers' > root.sh
echo "" > "--checkpoint-action=exec=sh root.sh"
echo "" > --checkpoint=1
sudo /usr/bin/tar -czvf /tmp/backup.tar.gz *
```
And applying these steps got me NOPASSWD sudo for all commands.

<img width="1300" height="365" alt="12 - tar wildcard abuse" src="https://github.com/user-attachments/assets/24ec99ee-cf88-4f76-aa73-1b2bc9f430f6" />

I then simple got root.

<img width="879" height="365" alt="13 - root" src="https://github.com/user-attachments/assets/6501469d-28b1-4f1f-9b06-ea7bd4b48b00" />



