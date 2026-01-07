---
layout: post
title: "Levram - Proving Grounds Practice"
summary: "Gerapy 0.9.7 default credentials admin:admin → CVE-2021-43857 Authenticated RCE → (1st way) Python SetUID Capabilities → (2nd way) systemctl status cleartext credentials on service path → root"
---

# Levram - Proving Grounds Practice

## Enumeration
### Nmap 
Initial Nmap scan revealed SSH and port 8000 was open.

<img width="1068" height="649" alt="00 - nmap" src="https://github.com/user-attachments/assets/352fcabb-3523-4360-b958-2a7b1f988685" />

### WEB Enumeration
Website was Gerapy website.

<img width="1920" height="957" alt="01 - Gerapy" src="https://github.com/user-attachments/assets/cf3535c3-f1cc-4877-8d66-4f24afde8f97" />

Tried admin:admin default login and it worked.

<img width="1920" height="965" alt="02 - gerapy 0 9 7" src="https://github.com/user-attachments/assets/4524e4ff-9289-4999-86f7-e8043851a010" />


## Exploitation
### CVE-2021-43857
Gerapy is a distributed crawler management framework. Gerapy prior to version 0.9.8 is vulnerable to remote code execution, and this issue is patched in version 0.9.8.

While searching I found out this version was vulenrable to Authenticated RCE.

<img width="1920" height="787" alt="04 - exploit db" src="https://github.com/user-attachments/assets/b76f3e96-bf9f-420a-b957-69d35ae7e8f4" />

I ran the exploit but it did not work and gave error index out of range. After some research I understood that I need to create a project first, so I did.

<img width="1920" height="787" alt="03 - added a project" src="https://github.com/user-attachments/assets/0f06ca5d-d7ab-4f4b-ae34-552d7e2128a6" />

Then I ran the exploit and got a reverse shell.

<img width="1018" height="508" alt="05 - exploit" src="https://github.com/user-attachments/assets/3667a733-ef4e-4781-bae2-366c1613f54e" />

<img width="1018" height="163" alt="06 - shell" src="https://github.com/user-attachments/assets/5ab3cdb9-a096-4573-b274-23ce35f83b1d" />

Then I simple read the user flag.

<img width="931" height="366" alt="07 - flag" src="https://github.com/user-attachments/assets/ae28aaef-a3b8-4f67-8c6f-ba1edced0cf0" />

## Privilege Escalation (Capabilities SetUID)
### Python SetUID
I checked capabilities through both manual checking and with linpeas and found that python had setuid capabilities.

<img width="1085" height="158" alt="08 - python setuid priv" src="https://github.com/user-attachments/assets/b03a50b6-f5b0-4192-a545-71fd85e3d98a" />

<img width="1084" height="122" alt="08 - python setuid priv 2" src="https://github.com/user-attachments/assets/37fe96f7-c518-45e6-af65-7f6de0a4fc03" />

I simply obtained root by calling `python -c 'import os; os.setuid(0); os.system("/bin/bash")'` .

<img width="936" height="146" alt="09 - root" src="https://github.com/user-attachments/assets/877d94b6-f5e0-4313-ab17-1f52e92a42cb" />

## Privilege Escalation (Service Cleartext Credentials)
At first I checked all services in the machine and found that Gerapy was running as service (app.service)

<img width="1852" height="850" alt="image" src="https://github.com/user-attachments/assets/aceaa5dc-b90c-4819-a4e1-55d566443a76" />

Then I checked its status to find service path

<img width="1084" height="633" alt="10 - service path" src="https://github.com/user-attachments/assets/9d287d10-ad81-42e0-8cb6-cedb84596c97" />

Then checked that file and found cleartext crendentials

<img width="1084" height="422" alt="11 - found password" src="https://github.com/user-attachments/assets/97c27f09-072a-4ceb-9d3b-74c1838e8502" />




