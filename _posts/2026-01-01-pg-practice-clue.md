---
layout: post
title: "Clue - Proving Grounds Practice"
summary: "Cassandra Web Remote File Read → Obtain freeswitch password from /etc/freeswitch/autoload_configs/event_socket.conf.xml → Freeswitch command execution and Reverse shell using same port (8021) as server → su cassandra (with obtained password from /proc/self/cmdline or linpeas output) → download id_rsa → ssh as root"
---

# Cockpit - Proving Grounds Practice

## Enumeration
### Nmap 
Initial Nmap scan revealed HTTP, SSH, SMB ports and Port 3000, 8021 ports were open.

<img width="990" height="432" alt="00 -nmap" src="https://github.com/user-attachments/assets/8003bd90-10bd-4092-884e-d22f32d9c0c3" />

### WEB Enumeration
At first I checked the website at port 80, it only showed forbidden.

<img width="1920" height="436" alt="01 - port 80 website" src="https://github.com/user-attachments/assets/652dc903-f65f-4cb1-bd07-9655af1b9acd" />

Then I checked port 3000, it was Cassandra Web Website.

<img width="1920" height="790" alt="02 - port 3000 website" src="https://github.com/user-attachments/assets/ae1effe7-7010-4786-95bc-d9e2fcdd6dea" />

## Exploitation
### LFI in Cassandra Web
I checked Cassandra exploits and found one, which is remote file read. ([Exploit](https://www.exploit-db.com/exploits/49362))

<img width="1895" height="203" alt="03 - cassandra searchsploit" src="https://github.com/user-attachments/assets/7f543e53-0381-4b3c-851f-29c926bfa88a" />

I tried to read `/etc/passwd` and it worked.

<img width="1009" height="685" alt="04 - 0 passwd file read" src="https://github.com/user-attachments/assets/0becb6fb-c631-44d1-b2e6-b6fe125ae9fd" />

Then I read `/proc/self/cmdline` and found a password and noted it.

<img width="1115" height="355" alt="04 - 1 cmdline file read to check cassandra" src="https://github.com/user-attachments/assets/03827608-8ff2-4961-9a5e-cf7f821b1bd0" />

### Freeswitch command execution
Then I checked port 8021, it was a freeswitch application. I searched freeswitch pentesting and found [this blog](https://x7331.gitbook.io/boxes/services/tcp/8021-freeswitch#id-47799) .

<img width="1920" height="878" alt="05 - freeswitch" src="https://github.com/user-attachments/assets/4ef9ba13-1816-4328-b1a4-814f1c0514a5" />

Tried the default password as suggested but it did not work.

<img width="759" height="349" alt="06 - password is not hardcoded" src="https://github.com/user-attachments/assets/425bc05f-edd1-407d-9c9c-3bc2ff8c3c45" />

### SMB Null Session
Then checked SMB and found out it had null session available.

<img width="1260" height="251" alt="07 - smb null session" src="https://github.com/user-attachments/assets/351cb838-0846-44a0-bce9-d3ddb3268f83" />

Then I listed all the files and checked if there is a `event_socket.conf.xml` file and I found it. This file is used to store fireswitch password.

<img width="823" height="148" alt="08 - event socket conf file" src="https://github.com/user-attachments/assets/dc096581-df0d-4464-9a24-216c58e3dcaf" />

Then I downloaded the file and read it. It included default password, so it was not useful.

<img width="1700" height="423" alt="09 - non default password nah" src="https://github.com/user-attachments/assets/2a87b20a-a545-4d6f-8fb0-b2c0c81f9f02" />

### Cassandra Web LFI to read Freeswitch Password
Then I went back to cassandra exploit and tried to read `event_socket.conf.xml` directly, unlike backup in smb. And it included a different password.

<img width="1372" height="265" alt="10 - freeswitch password" src="https://github.com/user-attachments/assets/5dd94ab7-1710-4383-a007-5c562f18f1c7" />

I tried it and it worked.

<img width="656" height="229" alt="11 - it worked" src="https://github.com/user-attachments/assets/0cea1847-d8a0-4c6f-aa10-3cf61c925f83" />

### Fireswitch Command Execution
Then I simply downloaded an script to run commands.

<img width="1920" height="809" alt="12 - exploit" src="https://github.com/user-attachments/assets/23e3c247-164a-4391-b770-6b17ae2e90c9" />

And updated it to include correct password.

<img width="1920" height="809" alt="13 - updated" src="https://github.com/user-attachments/assets/b318a496-4c8b-4d0a-9a9e-76dfd95ab6db" />

Then tried it and it worked.

<img width="675" height="177" alt="14 - code execution" src="https://github.com/user-attachments/assets/4ace570d-54fe-4ee9-9565-7c91e3836b59" />

Later I ran a reverse shell. Note that, listener should run in the same port (8021) as server to communicate.

<img width="787" height="102" alt="15 - exploit" src="https://github.com/user-attachments/assets/7fc5e0e2-81e9-496e-9a31-265cfa91e26d" />

And I obtained the shell.

<img width="968" height="356" alt="16 - got it" src="https://github.com/user-attachments/assets/512a0825-d3d0-438d-bdab-3e69bfb3775c" />

I then could not find the user flag, run find command and then found it. It was in freeswitch directory.

<img width="755" height="152" alt="20 - user flag" src="https://github.com/user-attachments/assets/db2e29b9-d135-456c-8efe-359d561b9745" />

## Privilege Escalation
### Su to cassie
We had password for cassie but linpeas also showed the password. I used it with su and obtained cassie user. 

<img width="1492" height="114" alt="17 - 0 cassie" src="https://github.com/user-attachments/assets/aa5d3ae5-8d99-45b9-b094-4ce9250a9db1" />

<img width="753" height="393" alt="17 - cassie" src="https://github.com/user-attachments/assets/5c8d5fe3-7ff6-4bea-b7ed-687a889e21d0" />

### id_rsa
The cassie used had id_rsa file in her home directory. 

<img width="831" height="588" alt="18 - id_rsa" src="https://github.com/user-attachments/assets/fc953446-5cda-4eff-96ca-4c23c106b3f8" />

I tried it against root and it worked. 

<img width="816" height="732" alt="19 - root" src="https://github.com/user-attachments/assets/7c282f80-af30-430b-ac19-f0a68a2a9dcd" />

