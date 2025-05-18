# Stapler - OffSec Proving Grounds

## Objective
Utilize enumeration, web enumeration, and WordPress enumeration techniques to identify vulnerabilities. Engage in database enumeration and implement privilege escalation strategies. Additionally, harness the abuse of sudo permissions to enhance your access. This lab is designed to capitalize on your skills in vulnerability exploitation.

## Enumeration
### Nmap
Initially, I conducted an Nmap scan on the target host, which revealed that several common services were accessible, including HTTP, FTP, SSH, DNS, NetBIOS, and MySQL. As there was limited information available from these services, I proceeded with a comprehensive scan using the -p- flag to examine all 65,535 TCP ports. This revealed additional open ports that were not detected during the initial scan.

![0_nmap](https://github.com/user-attachments/assets/c715300b-1408-4946-8665-196eb9f2cb99)

### FTP Anonymous
Upon further examination, I discovered that anonymous login was permitted on the FTP service. Within the accessible directory, there was a note containing usernames, which could potentially be used for further access or enumeration.
![1_ftp_anon](https://github.com/user-attachments/assets/dc6a1751-12d5-472b-afc0-6680a9d23d04)

### Website
The HTTP service on port 80 did not provide any useful information. However, during further enumeration, I identified an additional web service running on port 12380, which hosted a different website for further investigation.
![2_website](https://github.com/user-attachments/assets/dd0fad2d-d314-4bad-b8db-f096670e44b6)
The web service on port 12380 did not display any content when accessed via HTTP. However, upon attempting to connect using the HTTPS protocol, a new website was revealed, indicating that the service was configured to serve content securely over HTTPS.
![3_website_https](https://github.com/user-attachments/assets/94839e20-a310-4a03-868d-b3d8d521dea5)
I performed directory brute-forcing using Burp Suite, which resulted in the discovery of several directories. However, further inspection of these directories did not yield any useful information or lead to any actionable findings.
![4_website_dirb](https://github.com/user-attachments/assets/6d0a9e94-a4c3-4f6e-b5cf-1c9216b30278)
![5_anouncement](https://github.com/user-attachments/assets/189c1c1d-8f0c-4d11-a755-6fa8923feeaa)
Upon reviewing the robots.txt file, I identified two disallowed entries. One of these entries pointed to a WordPress blog, which provided an additional avenue for enumeration and potential exploitation.
![6_robots](https://github.com/user-attachments/assets/8338e2ba-2e62-4277-abad-bdd40cdd35ac)
I conducted a scan using WPScan on the discovered WordPress site. The scan successfully enumerated one or more valid usernames, which could be leveraged for further attacks such as brute-forcing or privilege escalation.
![7_wpscan](https://github.com/user-attachments/assets/c718ba37-f353-4a09-9046-a4796a642ef0)

## Exploitation
### Brute Forcing WordPress
Using the previously discovered username john, I performed a password brute-force attack against the WordPress login using the rockyou.txt wordlist. This resulted in the successful discovery of valid administrative credentials, granting access to the WordPress dashboard.

![0_name](https://github.com/user-attachments/assets/64c3da7e-9cf8-4559-8ce4-9f78c4cb4d9e)
![0_admin](https://github.com/user-attachments/assets/740fcb0a-a92d-449c-9f36-e85b9126caf1)

### Uploading Reverse Shell
After gaining administrative access to the WordPress dashboard, I generated a PHP reverse shell using the PentestMonkey reverse shell script. I uploaded the shell as a custom plugin through the WordPress interface. Once the shell was placed in the wp-content/uploads directory, I initiated a listener using Netcat on my local machine and accessed the uploaded PHP file via the browser. This successfully triggered the reverse shell and provided remote command execution on the target system.
![1_hack_php](https://github.com/user-attachments/assets/829229bf-15df-4a04-9330-79401657170d)
![2_upload](https://github.com/user-attachments/assets/18c6a7e1-819a-422e-85e0-c246b9dd912c)
![3_wp_contents](https://github.com/user-attachments/assets/fc09a635-0e36-49ec-97bb-dceb664c3fdd)
![4_shell](https://github.com/user-attachments/assets/1e78917b-0821-42a4-9887-b5f131c00b1c)
From the established remote shell access, I was able to locate and retrieve the first flag on the target system.

## Privilege Escalation
### First Way - Credential Hunting
The first privilege escalation method involved credential hunting. I examined the .bash_history files for all users and discovered valid SSH usernames and passwords. Notably, the user peter was permitted to execute all commands with sudo privileges. Utilizing these credentials, I established an SSH connection as peter, escalated privileges to root, and successfully retrieved the root flag.

![5_ssh](https://github.com/user-attachments/assets/2c20235a-33da-419b-8be2-197106df0608)
![6_postssh](https://github.com/user-attachments/assets/da388b86-b2c8-4004-9778-8b80aa3e1d54)

### Second Way - Linux Exploit Suggester
The second privilege escalation approach involved using the Linux Exploit Suggester tool, which identified several potential kernel-level vulnerabilities. Although the Dirty COW (CVE-2016-5195) exploit was attempted, it caused the system to crash and was therefore not viable. However, the CVE-2016-4557 exploit worked successfully, granting a root shell and full system control.
As observed, the Dirty COW 2 exploit functioned initially but resulted in a system crash, rendering it unusable for privilege escalation in this case.

![dirty_cow](https://github.com/user-attachments/assets/67da181c-8a2a-4687-8fe3-a3eed6f14428)

In contrast, the CVE-2016-4557 exploit executed successfully on the first attempt, immediately providing a root shell without causing system instability.
![exploit2](https://github.com/user-attachments/assets/747a945f-93ab-4bd0-b406-3767005beb45)
![exploit2_root](https://github.com/user-attachments/assets/d7a2fcce-6c0f-4bf7-bcc2-05688d5f5d5b)
