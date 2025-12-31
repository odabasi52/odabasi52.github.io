---
layout: post
title: "Algernon - Proving Grounds Practice"
summary: "FTP anonymous enumeration (rabbit hole logs) → IIS tilde enumeration → SmarterMail 6919 discovery on port 9998 → CVE affecting version 6985 exploitation → SmarterMail unauthenticated RCE → SYSTEM shell access"
---

# Algernon - Proving Grounds Practice

## Enumeration
### Nmap 
Initial nmap scan revealed many ports were open including FTP, HTTP, SMB ...

<img width="1121" height="817" alt="00 - nmap" src="https://github.com/user-attachments/assets/897b7879-2aea-423f-a6a4-5823b55dbd41" />

### Rabbit Hole Enumerations
At first I enumerated FTP as it allowed anonymous login. I downloaded all log files and analyzed them but it was useless. Only useful thing I gathered from the logs was there was an admin user.

<img width="814" height="359" alt="01 - anon login ftp" src="https://github.com/user-attachments/assets/47160a2e-8aed-4f1f-a451-bb4099a00d18" />

<img width="1842" height="295" alt="02 - downloaded all logs" src="https://github.com/user-attachments/assets/59cb9d13-201d-4f70-a0cd-b64420137801" />

I then fuzzed the website at port 80 and found /aspnet_client/system_web/ this path. Then I applied IIS tilde enumeration and found this path /aspnet_client/system_web/4_0_30319.
Then I searched the internet that maybe I can find useful information but I could not. I tried some known paths but none of them worked.

## Exploitation (Root Directly)
I then visited port 9998 and found out SmarterMail application was running.

<img width="1915" height="847" alt="03 smarter mail login" src="https://github.com/user-attachments/assets/e94dcfb5-efd2-4158-98db-bab26a547027" />

Its version was 6919.

<img width="1920" height="930" alt="08 - version" src="https://github.com/user-attachments/assets/21728943-13d7-45af-a053-be7bdb0ee013" />

At first I tried default logins and they did not work. Later I searched the internet and found SmarterMail version 6985 was vulnerable to RCE. The version I found was lower version, so I thought maybe I could run this exploit successfully.

<img width="1910" height="763" alt="09 - exploit" src="https://github.com/user-attachments/assets/fc0f95bb-06c0-44a7-ab25-525d190f64cb" />

Then I simply ran the exploit and got SYSTEM shell.

<img width="986" height="297" alt="10 - gg" src="https://github.com/user-attachments/assets/476e030a-da62-49e1-8fdb-1a143a3295cb" />
