---
layout: post
title: "Election - OffSec Proving Grounds"
summary: "robots.txt includes usernames → Logs page on website → Credentials found → phpMyAdmin login → crack hash → SSH user shell → (1st way) SUID Serv-U binary (CVE-2019-12181) → (2nd way) PwnKit Privilege Escalation (CVE-2021-4034) → (3rd way) Baron Samedit Exploit (CVE-2021-3156) → root"
---

# Election - OffSec Proving Grounds

## Objective
Leverage enumeration and web enumeration techniques to uncover system weaknesses. Apply privilege escalation strategies to gain elevated access. This lab is designed to harness your skills in vulnerability discovery and exploitation.

## Enumeration
### Nmap
During the initial reconnaissance phase, an Nmap scan was conducted, revealing the presence of two open ports on the target system: Port 80 (HTTP), indicating an active web service, and Port 22 (SSH), indicating the presence of an SSH service. These findings were noted for further analysis in subsequent phases of the assessment.
![00 - nmap output](https://github.com/user-attachments/assets/69fa9199-8b74-401c-9a17-be57a50a6889)

### Website
The website was found to have a robots.txt file, which contained four records. This file is typically used to guide web crawlers on which pages or sections of the site should not be indexed or accessed. The specific entries in the file were noted for further analysis during the engagement.
![01 - robots txt ](https://github.com/user-attachments/assets/64da68bf-6865-467a-8ba9-0910fd30ff6a)

An attempt was made to leverage SQLmap for automated SQL injection testing on the identified web application. However, the tool did not successfully exploit any vulnerabilities, indicating that either the web application is not susceptible to SQL injection or additional mitigations are in place to prevent such attacks. Further manual testing may be necessary to explore other potential vectors.
![02 - sqlmap election site](https://github.com/user-attachments/assets/998e0a45-126f-416d-88a0-20feb46dc7b6)

During a directory brute-force scan using DirBuster, a "logs" page was discovered that was accessible without authentication. Upon further examination, the page contained credentials, potentially compromising sensitive information. This finding was flagged for immediate attention, as it could represent a significant security risk.
![03 - admin logs](https://github.com/user-attachments/assets/a5722681-c494-4bf7-b965-d34a51b2b7cc)

The credentials found on the accessible "logs" page were duly noted for further analysis. Additionally, a subsequent DirBuster scan revealed the presence of a "phpmyadmin" directory, which was also accessible without authentication. This discovery could potentially allow for further exploitation if the phpMyAdmin instance is misconfigured or vulnerable. Both findings were flagged for immediate attention and further investigation.
![08 - phpmyadmin](https://github.com/user-attachments/assets/207f89a7-e79a-4d2b-8b40-69d0fa29ad2a)

The default credentials (root:toor) were used to access the phpMyAdmin interface, successfully logging into the system. This highlights a critical security vulnerability, as the use of default credentials can provide unauthorized access to sensitive database information. This finding underscores the need for securing applications by changing default credentials and implementing stronger access controls.
![09 - phpmyadmin root - toor](https://github.com/user-attachments/assets/a6d4a8bc-07e6-4e14-a601-216a509c4507)

## Exploitaion
### SSH
Using the previously discovered credentials, an SSH session was successfully established, granting access to the system’s shell. This represents a significant security risk, as unauthorized access to the shell could allow for further system compromise or data exfiltration. Immediate action is recommended to address this vulnerability and secure the system against unauthorized access.
![04 - ssh love](https://github.com/user-attachments/assets/ee8d4f54-8d6c-4d5b-9893-0a8f49db47cf)
At this stage, with SSH access successfully obtained using the previously discovered credentials, the next step is privilege escalation. This phase involves identifying potential vulnerabilities or misconfigurations that could allow for the elevation of user privileges, enabling access to higher-level accounts, such as root. Various techniques and tools will be employed to escalate privileges and gain full control over the system.

## Privilege Escalation (Attempts)
### ADM Group - Logs
Upon identifying that the SSH user was part of the ADM group, I proceeded to examine the system's /var/log directory for any valuable information that could assist in privilege escalation. This directory often contains log files that may reveal sensitive data, system configurations, or errors that could indicate potential vulnerabilities or misconfigurations, providing further opportunities to escalate privileges.
![05 - adm group](https://github.com/user-attachments/assets/e4c86302-23d9-4388-943f-2f45918fb54a)
![06 - check logs](https://github.com/user-attachments/assets/480f20ac-361f-4a11-a883-61c7c65ab2a3)

### WebRoot
Upon reviewing the logs in the /var/log directory, it was noted that the root user had performed actions within the web root directory. This led to further investigation in the web root, where I discovered a database connection. This could potentially provide access to sensitive data or lead to further exploitation if the database is improperly configured or lacks proper access controls. The findings were noted for further investigation and potential privilege escalation opportunities.
![07 - mysql db](https://github.com/user-attachments/assets/8377a696-8759-42f1-b53c-fab8870ccaf9)
![07 - mysql password](https://github.com/user-attachments/assets/e4792c2b-826f-421e-ba6a-daca1905eb45)

Upon further investigation, I found that the database tables were also accessible through the phpMyAdmin interface, but they did not reveal any useful information. Continuing the inspection of the web root, I discovered a card.php file containing double binary-encoded data. Using CyberChef to decode the data, I uncovered credentials hidden within, which could potentially be used for further system access or escalation. This finding is significant as it may provide additional avenues for exploitation.
![10 - 0 card php](https://github.com/user-attachments/assets/1c6e7874-0e09-4150-9e00-994a4a145ed9)
![10 - 1 double binary encoding](https://github.com/user-attachments/assets/3ad7c934-2edd-48e3-993b-39fbe21d7d72)

After using the decoded credentials to log into the admin page of the website, I was able to successfully authenticate. However, upon further exploration, no additional sensitive information or exploitable vulnerabilities were uncovered through this access. This indicates that, while the admin page was accessible, it may have been secured or lacking in critical misconfigurations that could further aid in the exploitation of the system.
![10 - 2 logged in to admin](https://github.com/user-attachments/assets/9faf072a-88f8-49eb-89d1-13dae3da1ba3)

## Privilege Escalation
### CVE-2019-12181
Next, I ran the following command to identify potential SUID (Set User ID) files owned by the root user:
```bash
find / -user root -perm -4000 -exec ls -ldb {} \; 2>/dev/null
```
This command revealed the presence of the Serv-U file, which was identified as an exploitable SUID binary. I successfully exploited this vulnerability, which allowed me to escalate privileges and gain a root shell. This represents a critical security flaw, as SUID binaries can provide unauthorized users with elevated privileges if misconfigured.
![11 - serv-u -s](https://github.com/user-attachments/assets/68efd304-b88b-4f2b-85f4-6986ba96e585)
![11 - exploitdb](https://github.com/user-attachments/assets/0971d87d-7a94-4cb3-81aa-1849c6c64ef8)
![11 - proof root](https://github.com/user-attachments/assets/4194f2b2-be60-410a-8990-285ef054607e)

### CVE-2021-4034
In addition to exploiting the Serv-U binary, I also attempted the CVE-2021-4034 vulnerability, commonly known as "PwnKit," which allows for privilege escalation through a flaw in the Polkit's pkexec component. This exploit was also successful, further elevating my privileges to root. The successful exploitation of both the Serv-U SUID binary and the PwnKit vulnerability demonstrates multiple critical pathways for privilege escalation, highlighting significant security weaknesses within the system.
![12 - 0 pwnkit](https://github.com/user-attachments/assets/7f54c0f7-d7b9-4b4b-b7e3-2bbd26736043)
![12 - 1 root](https://github.com/user-attachments/assets/2a2ca8a2-e3f7-4a70-9996-fe016ff1359e)

### CVE-2021-3156
In addition to the previous privilege escalation techniques, I also tested the CVE-2021-3156 vulnerability, known as "Baron Samedit," which affects the sudo program. This vulnerability allows for privilege escalation due to improper handling of command-line arguments in the sudo command. The exploit was successful, further allowing me to escalate privileges to root. The successful exploitation of three separate vulnerabilities (Serv-U, PwnKit, and Baron Samedit) underscores significant security flaws within the system, emphasizing the need for immediate remediation.
![13 - 0 baron](https://github.com/user-attachments/assets/e761f7ea-655b-4623-843b-70cc94d61950)
![13 - 1 github](https://github.com/user-attachments/assets/6bee2746-584c-422f-ab9a-0cd242c495dc)
![13 - 1 root](https://github.com/user-attachments/assets/6d2e6350-960c-418b-a23d-9b0e9fc72a91)




