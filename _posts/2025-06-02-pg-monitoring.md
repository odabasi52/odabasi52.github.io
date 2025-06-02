# Monitoring - OffSec Proving Grounds

## Objective
Engage in exploiting a vulnerability in monitoring software that enables remote code execution. Utilize this exploit to gain access with elevated privileges, as the software operates with high-level permissions. This lab is designed to capitalize on your skills in vulnerability exploitation.

## Enumeration
### Nmap
Initially, I conducted an Nmap scan on the target host, which revealed that several common services were accessible, including HTTP, SSH, HTTPs...

![000 - nmap output](https://github.com/user-attachments/assets/4b55aabd-cba9-4e31-b331-518419753147)

Upon further inspection, both the SSH and SMTP services did not yield any useful information. However, the HTTP (port 80) and HTTPS (port 443) services were active and hosting a web interface for Nagios XI, an enterprise-grade network monitoring solution.

![001 - access nagios](https://github.com/user-attachments/assets/761fc055-8995-492f-88d7-94998dd833ed)

## Exploitation & Privilege Escalation (CVE-2019-15949)
During enumeration of the HTTP and HTTPS services, it was identified that the web interface was running Nagios XI. According to the official Nagios XI documentation, the default username is nagiosadmin, while the default password must be set by the user during installation.
Based on this information, a series of login attempts were made using nagiosadmin in combination with commonly used passwords. One of these attempts was successful, granting access to the Nagios XI dashboard.
Notably, the HTTP version of the site displayed a message stating "Sorry Dave", suggesting restricted or placeholder content. However, access via HTTPS was successful, and the login page was functional over this secure channel.

![001 - access nagios](https://github.com/user-attachments/assets/d53d5f11-f804-444a-921e-9fd63d2fc2d4)

After successfully logging into the Nagios XI web interface using the nagiosadmin account with a commonly used password, the version in use was identified as being vulnerable to CVE-2019-15949. This vulnerability allows authenticated remote code execution due to improper input validation in certain administrative functions.

![002 - exploit](https://github.com/user-attachments/assets/76840d5e-8dc4-4404-9be1-3d07dc3e5558)

A publicly available exploit script was used to leverage this vulnerability. Upon execution, it provided command execution capabilities under the context of the web server. Further privilege escalation steps were unnecessary, as the exploit allowed direct access to a root-level shell on the target system.

![003 - nagios rce](https://github.com/user-attachments/assets/e7ce655b-763f-4533-a6a1-158028c1f8cf)
![004 - root](https://github.com/user-attachments/assets/6ea723ee-60eb-4e5d-8ff4-52530267def7)



