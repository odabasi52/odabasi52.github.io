---
layout: post
title: "Boolean - Proving Grounds Practice"
summary: "Bypassed confirmation via parameter manipulation, exploited path traversal vulnerability, and uploaded SSH authorized_keys for authentication."
---

# Boolean - Proving Grounds Practice

## Enumeration
### Nmap 
Initial Nmap scan revealed HTTP and SSH ports and a non-common port were open.

<img width="1396" height="649" alt="00 - nmap" src="https://github.com/user-attachments/assets/406b670a-725d-4b5f-9461-608d466666fe" />

### WEB Enumeration
There were 2 web pages. One of them was on default 80 port and other one was on 33017.

<img width="1919" height="922" alt="01 - web" src="https://github.com/user-attachments/assets/d7d623b1-37b7-4063-8f64-403003a9a4b0" />

<img width="1919" height="206" alt="02 - another web" src="https://github.com/user-attachments/assets/e23be444-dc7c-4a68-b3c4-7221e4ca9b42" />

I did directory brute forcing against both of them. The on in the port 80 revealed filemanager folder, but it could not be accessed directly.

So at first, I registered the website and logged in. However, I still could not do anything because there was a confirmation process.

<img width="1919" height="428" alt="03 - confirmation" src="https://github.com/user-attachments/assets/b3ccbedc-4da8-4620-941a-82ee21bb33bb" />

## Exploitation
### Confirmation Bypass
I opened burp suite and checked the request and response when I try to edit email. There was a parameter named confirmed, which returns false.

<img width="1430" height="578" alt="04 - confirmed false" src="https://github.com/user-attachments/assets/5dad9037-c956-4ea9-a6d1-b8b9fa3d50bf" />

So I tried to edit the request by adding user[confirmed]=true parameter and it worked. I bypassed the confirmation.

<img width="1536" height="658" alt="05 - confirmed true" src="https://github.com/user-attachments/assets/818da1b2-239c-4e4c-9d05-cf07276cb3a1" />

### Path Traversal
Now we were inside the filemanager application. We could upload files with upload function. I uploaded 2 files and while checking I found there was a parameter called cwd.

<img width="1919" height="976" alt="06- file manager with cwd" src="https://github.com/user-attachments/assets/f1a9930b-513b-4515-a35d-ddcff152dac4" />

So I added that parameter to URL and removed download parameter. I could access to all filesystem with path traversal.

<img width="1919" height="976" alt="07 - path traversal" src="https://github.com/user-attachments/assets/21fc3f4b-8ae3-43cf-89a2-6dd307d93eca" />

### Authorized Keys
I tried many methods:
1. Brute forcing user password on ssh
2. Reading config files and decrypting credentials.yml.enc with master.key
3. Downloading ~/.ssh/id_rsa and try to login with them as user remi.

And none of them worked. Later, I found out that I could upload a file to .ssh folder. So I simply added my public key to authorized_keys file and uploaded it.

<img width="571" height="146" alt="08 - 0 authorized keys" src="https://github.com/user-attachments/assets/96c01f3b-82d7-4019-b3d6-0cc462dc8c07" />

<img width="1919" height="716" alt="08 - uploaded authorized keys" src="https://github.com/user-attachments/assets/f0299a64-0b74-4ecf-96df-50341a24eaf1" />

Then simply logged in as user remi.

<img width="780" height="333" alt="09 - user flag" src="https://github.com/user-attachments/assets/4d457be6-a39a-4f62-90f0-00e96b50b56b" />

## Privilege Escalation
While checking the home directory I found .bash_alias file which includes a command to become a root (using ssh). However, when I try that command it says too many authentication failures and does not allow me to ssh as root.

<img width="838" height="465" alt="10 - auth failure" src="https://github.com/user-attachments/assets/7e8503ed-f226-4e7b-82d8-3eb470dfe776" />

### IdentitiesOnly flag
I searched the internet and found this [medium post](https://setevoy.medium.com/ssh-the-too-many-authentication-failures-error-and-its-solution-feefaba0262a). Moreover, I did some more research to understand what is the problem.

SSH servers have a security limit (usually 6 attempts) on how many keys you can try before they ban you. 
When you run a standard SSH command, the client actually ignores your -i my_key.pem flag at first. 
Instead, it asks your SSH Agent (which stores your loaded keys) for credentials. The Agent happily offers every single key it has, one by one.
If you have 7+ keys loaded in your agent the server disconnects you before your client ever gets a chance to offer the specific key you asked for.

`IdentitiesOnly=yes` flag forces the SSH client to ignore the SSH Agent. It tells the client: "Do not offer any keys except the one I explicitly pointed to with the -i flag (or in my config file)."

So I tried it with running `root -o IdentitiesOnly=yes` and it worked. I got the root.

<img width="860" height="608" alt="11 - root" src="https://github.com/user-attachments/assets/a8fe6c65-9bdd-4444-9ba8-e8a74442edae" />

