---
layout: post
title: "Funbox - Proving Grounds Play"
summary: "WordPress discovery → wpscan user enumeration → password brute-force (joe:joe) → SSH access (rbash bypass via bash shell) → mbox file enumeration → funny user backup script discovery with write privileges → pspy64 process monitoring → root user script execution identification → backup script SUID /bin/bash modification → cron job execution → SUID bash root access"
---

# Funbox - Proving Grounds Play

## Enumeration
### Nmap 
Initial nmap scan reveal HTTP, FTP and SSH ports were open.

<img width="995" height="481" alt="00 - nmap" src="https://github.com/user-attachments/assets/5f3ac5f6-19bc-447b-9f0a-89867ad56671" />

### Web Enumeration
I was forwarded to a domain name when I visited the web page. So I added it to /etc/hosts file.

<img width="1115" height="231" alt="01 - domain" src="https://github.com/user-attachments/assets/43005579-aad4-4e07-98ab-64acf2a92340" />

<img width="691" height="107" alt="02 - etc hosts" src="https://github.com/user-attachments/assets/0e7213ba-67e5-48c9-9118-499c34621e56" />

Then while searching through the web page I found out that it was a wordpress page.

<img width="1289" height="563" alt="03 - wordpress info" src="https://github.com/user-attachments/assets/2ebf319b-cb1b-4c0b-863b-29f6294f2c41" />

So I did directory brute forcing and found valid wordpress endpoints.

<img width="1003" height="630" alt="04 - wordpress" src="https://github.com/user-attachments/assets/de8308b6-12c5-4f3f-bad3-117e649d978b" />

## Exploitation
### WPScan
Then I ran wpscan and found valid usernames.

<img width="1003" height="439" alt="05 - wpscan" src="https://github.com/user-attachments/assets/a967230b-2c91-4125-aa2b-e26f9d5553e2" />

For those usernames, I did brute forcing and found joe's password.

<img width="1462" height="356" alt="06 - cracked" src="https://github.com/user-attachments/assets/3f42d87c-c20b-4fc8-994e-95f2915b9cf4" />

Later, I enumerated the wordpress-admin page and could not find anything useful. I had no access to the themes or anything else.

### SSH and User Flag
Thus, I gave up on wordpress and tried the credentials I found on SSH port and it worked. I got the user.

The shell was restricted shell at first (rbash). So I logged in with bash shell.

<img width="847" height="258" alt="07 - ssh and got the user" src="https://github.com/user-attachments/assets/a63d996b-e55e-4f49-afaf-1a9361f32307" />

## Privilege Escalation
### Enumeration
There was a file named mbox. Checking it revealed that there should be a backup scrit running on funny user.

<img width="820" height="497" alt="08 - mbox" src="https://github.com/user-attachments/assets/b7cb0d4e-abad-46ee-bcd1-8851e38e5278" />

Checking the home page of funny user revealed that backup script. Moreover, current user had write privileges over it.

<img width="793" height="414" alt="09 - backup script" src="https://github.com/user-attachments/assets/0c52786d-e4a8-4c42-a2f9-940a8f24e745" />

### Pspy
Later, I updated the script and got reverse shell as funny user but it was a rabbit hole. Then, I learned that the script could also be running as other user. So I downloaded pspy64 and ran it. It revealed that the script was run by both funny and the root user.

<img width="1040" height="365" alt="10 - pspy output" src="https://github.com/user-attachments/assets/c48c4cc6-1d32-4fb3-bc4f-91b582848959" />

### Gaining Root Access
With this knowledge in mind, I updated the script to add SUID privileges to /bin/bash.

<img width="527" height="196" alt="11 - updated backup script" src="https://github.com/user-attachments/assets/aa750dda-cd26-489a-83c3-9705fd14a43b" />

Then, waited for 2 minutes and got the root shell and the flag.

<img width="715" height="305" alt="12 - got the root" src="https://github.com/user-attachments/assets/cf22ac37-f9ca-4a76-8b0f-328c7f8e979a" />
