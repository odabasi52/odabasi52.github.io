# Broker - Hack The Box

## Enumeration
### Nmap
Initial NMAP scan revealed  SSH, HTTP, MQTT and ActiveMQ ports are open.

<img width="1410" height="377" alt="00 - nmapBroker" src="https://github.com/user-attachments/assets/63687bc2-2f0c-4837-91d1-7d7e7b82e6d2" />

### WEB Enumeration
WEB page had default credentials "admin:admin", so I got access to it.

<img width="1258" height="510" alt="01 - broker admin" src="https://github.com/user-attachments/assets/3bb16d46-c47d-48c1-bf10-27eb08eae3a3" />

### Directory Brute Force
The directory brute force revealed admin and api pages open. The admin page revealed the version of ActiveMQ.

<img width="1440" height="714" alt="02 - dirbust" src="https://github.com/user-attachments/assets/452fded6-ec28-47ad-8864-19d63e8aa6e9" />

<img width="1221" height="619" alt="03 - admin page" src="https://github.com/user-attachments/assets/91f83c33-db47-4c32-a8e6-1be5bc2637f1" />

## Exploitation
### CVE-2023-46604
Analyzing the version revealed a public exploit. [This](https://github.com/rootsecdev/CVE-2023-46604) repo includes a public PoC to get a reverse shell.

So I updated to poc-linux.xml and started a netcat listener. Then got a reverse shell.

<img width="1486" height="301" alt="04 - rce go" src="https://github.com/user-attachments/assets/ebf45810-474a-4df3-98a0-413483f3390c" />

<img width="1140" height="276" alt="05 - shell" src="https://github.com/user-attachments/assets/be7bfd42-301c-45b5-a4bc-08fc77246877" />

### Got The User
<img width="464" height="208" alt="06 - user" src="https://github.com/user-attachments/assets/c24baa1c-6acd-4a20-b7b0-29d9e52c7834" />

## Privilege Escalation
### sudo -l
The "sudo -l" revealed the user can run nginx as sudo. There were no GTFOBins page but searching through the internet revealed [this](https://github.com/DylanGrl/nginx_sudo_privesc) repo. 

<img width="865" height="145" alt="07 - sudo l" src="https://github.com/user-attachments/assets/cacd745e-ba05-4d37-92af-e98ce82f9f90" />

Using sudo privileges of nginx, I can create a ssh key to login as root.

<img width="915" height="578" alt="08 - nginx" src="https://github.com/user-attachments/assets/f7ffe840-b9ad-4762-b177-1b3a24f0ecf4" />

<img width="975" height="726" alt="09 - root" src="https://github.com/user-attachments/assets/84d331ae-7438-460d-a40a-4fb48eeba68b" />

## Pwned
The machine was pwned.

<img width="726" height="695" alt="10 - gg" src="https://github.com/user-attachments/assets/ce666263-7177-465b-99e5-cb1ec2398118" />
