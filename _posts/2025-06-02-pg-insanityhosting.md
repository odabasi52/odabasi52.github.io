---
layout: post
title: "InsanityHosting - OffSec Proving Grounds"
summary: "News page disclosed a username otis → Monitoring page Brute Force using otis → Valid Login → 2nd Order SQL Injection → Get informations of database from webmail → Crack hashes → user shell → .mozilla folder → firefox decrypt → root"
---

# InsanityHosting - OffSec Proving Grounds

## Objective
Engage in enumeration, web enumeration, and exploiting SQL injection techniques to identify vulnerabilities. Utilize password cracking methods and implement privilege escalation strategies to enhance your access. This lab is designed to capitalize on your skills in vulnerability exploitation.

## Enumeration
### Nmap
Initially, I conducted an Nmap scan on the target host, which revealed that several common services were accessible, including HTTP, SSH and FTP services.

![000 - nmap](https://github.com/user-attachments/assets/66377b35-7e98-43a5-a2de-5e75c533395b)

### FTP Anonymous
I discovered that the FTP service allows login with the anonymous user account. However, this access did not lead to any further avenues for exploitation or sensitive data disclosure.

![001 - ftp anon](https://github.com/user-attachments/assets/a1084c0e-3ed9-40da-8d2e-b205d18ff249)

### Directory Brute Force
After performing directory brute-forcing, I discovered several accessible pages, including phpMyAdmin, webmail, monitoring, and news interfaces.

### PHPMyAdmin
I was able to identify a valid username for phpMyAdmin; however, the account only had access to the information_schema database, which did not provide any useful or exploitable information.

![002 - pma sql](https://github.com/user-attachments/assets/0448e843-25de-48b3-a7c7-c60ad148002f)

![003 - pma_null login](https://github.com/user-attachments/assets/b55ffb33-9568-4bcf-83b0-01f78dd4520b)

### News
The news page disclosed a username, otis, which could potentially be used for further enumeration or authentication attempts.

![004 - otis](https://github.com/user-attachments/assets/d7e6bb0c-2e2c-43de-a047-e5a506e2f314)

Using the previously discovered otis username, I conducted a brute-force attack and successfully obtained valid login credentials.

![005 - brute force otis](https://github.com/user-attachments/assets/009a74d4-0b36-4b62-8bf5-6912a858ab08)

![006 - webmail otis login](https://github.com/user-attachments/assets/a9cf4a8d-ad4a-4d98-9c1b-b90c35d312e1)

![007 - monitoring otis login](https://github.com/user-attachments/assets/7f566436-4f48-4131-a6a7-4f3b1396e8bd)

## Exploitation
After logging into the monitoring page, I discovered that submitting a name for a health check triggered an email notification if the system failed to resolve the associated IP address. By examining the contents of these email notifications, I inferred that the input might be interacting with a backend database. After multiple attempts, I confirmed the presence of a SQL injection vulnerability. Notably, the injection syntax that worked was: " or 1=1 # instead of the more common ' OR 1=1 --

![008 - sqli0](https://github.com/user-attachments/assets/fea4f84a-9a0b-4556-ae31-ef51b9ce4aa0)

Through further exploitation of the SQL injection vulnerability, I was able to enumerate database tables and extract usernames along with their corresponding hashed passwords.

![008 - sqli4](https://github.com/user-attachments/assets/8f88dfae-ec3a-4142-af1c-8bdf8e9e748a)

One of the extracted password hashes was weak and easily cracked, which provided valid SSH credentials. Using these, I successfully gained SSH access to the target system.

![009 - hash cracks](https://github.com/user-attachments/assets/ebbca874-e1ee-4c21-b0b1-7e92c4afa0c4)

![010 - ssh](https://github.com/user-attachments/assets/0a7939b5-7f0b-4604-b369-722281dbd7dd)

## Privilege Escalation
Within the SSH session, I found a .mozilla directory in the user's home folder. 

![011 -  mozilla](https://github.com/user-attachments/assets/09537bf1-ee04-4400-809d-0ff83f5fa3ce)

![011 -  mozilla json](https://github.com/user-attachments/assets/c8b02591-90f2-44e6-bb41-18bc5408c027)

Using a Firefox decryption tool on the stored credentials, I was able to extract the root user's password, ultimately gaining full system access.
The target system did not have Python installed, which prevented local execution of the Firefox decryption tool. To work around this, I transferred the entire .mozilla directory from the target to my local machine and ran the decryption tool there. This successfully revealed the root user's password, allowing me to escalate privileges and gain full system access.

![012 - moved all files](https://github.com/user-attachments/assets/517030f1-fc2f-4b22-9735-03d02c3f6002)

![012 - decrypt](https://github.com/user-attachments/assets/5c721124-ac87-491b-a342-2afebcca2793)

![012 - flag](https://github.com/user-attachments/assets/32268625-0e95-4a2d-8213-32000b3d45f3)

