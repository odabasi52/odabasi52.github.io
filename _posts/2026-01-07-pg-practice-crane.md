---
layout: post
title: "Crane - Proving Grounds Practice"
summary: "SuiteCRM version found in Readme.MD → Default login admin:admin → SuiteCRM 7.12.3 RCE (CVE-2022-23940) → sudo -l → sudo service ../../bin/bash → root"
---

# Crane - Proving Grounds Practice

## Enumeration
### Nmap 
Initial Nmap scan revealed HTTP, SSH and MySQL ports were open.

<img width="1107" height="576" alt="image" src="https://github.com/user-attachments/assets/84cb096e-7de9-4a3a-8c45-f3c9ef1e9377" />

### WEB Enumeration
Website was SuiteCRM Website.

<img width="1919" height="973" alt="01 - website suite crm" src="https://github.com/user-attachments/assets/cf14857e-53c1-4907-8818-631ff661f8ee" />

I did directory bruteforcing with versioning-metafiles and found Readme.md which revealed version was 7.12.3 

<img width="1543" height="890" alt="02 - suite crm 7 12 3" src="https://github.com/user-attachments/assets/3a6402f1-90e9-4781-89d6-2f053bf33dfb" />

Then I tried default login admin:admin and it worked.

<img width="1920" height="950" alt="03 - admin:admin creds worked" src="https://github.com/user-attachments/assets/0f023617-2e83-4984-af78-2f87be365e28" />

## Exploitation
### CVE-2022-23940
SuiteCRM through 7.12.1 and 8.x through 8.0.1 allows Remote Code Execution. Authenticated users with access to the Scheduled Reports module can achieve this by leveraging PHP deserialization in the email_recipients property. By using a crafted request, they can create a malicious report, containing a PHP-deserialization payload in the email_recipients field. Once someone accesses this report, the backend will deserialize the content of the email_recipients field and the payload gets executed. Project dependencies include a number of interesting PHP deserialization gadgets (e.g., Monolog/RCE1 from phpggc) that can be used for Code Execution.

<img width="1612" height="144" alt="04 - exploit" src="https://github.com/user-attachments/assets/a7f76595-1343-4801-899a-936e98cbb2f0" />

I simply got a reverse shell.

<img width="753" height="215" alt="05 - shell" src="https://github.com/user-attachments/assets/7c57e7d0-b4ab-4920-9524-47f3b1a2eca4" />

## Privilege Escalation
### sudo /usr/bin/service
I ran `sudo -l` and found that we could run service as sudo.

<img width="887" height="164" alt="06 - sudo -l" src="https://github.com/user-attachments/assets/f305f71a-8d3d-4441-ad83-a42236bd0530" />

I simply applied steps in gtfobins which was `sudo service ../../../bin/bash` and got the root flag.

<img width="839" height="143" alt="07 - root flag" src="https://github.com/user-attachments/assets/8a990121-d800-491f-9481-f57aa336a65b" />

I also got the user flag after checking /var/www folder.

<img width="845" height="182" alt="08 - user flag" src="https://github.com/user-attachments/assets/32e17ed3-e1a5-4314-a8ac-1b653dc1a6fc" />

