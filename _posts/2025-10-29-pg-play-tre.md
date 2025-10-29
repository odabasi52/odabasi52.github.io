# Tre - Proving Grounds Play

## Enumeration
### Nmap 
Initial Nmap scan revealed SSH, HTTP ports were open.

<img width="793" height="373" alt="00 - nmap" src="https://github.com/user-attachments/assets/a8b2eefd-1bf1-4805-a846-79446b9b628d" />

### Dirbuster
Applied directory brute forcing to Web application which revealed some endpoints.

<img width="1014" height="583" alt="01 - dirbuster" src="https://github.com/user-attachments/assets/7cf60ce4-a582-468b-9280-19b7d642fe59" />

Then applied additional brute forcing to mantisbt directory which revealed config endpoint.

<img width="959" height="663" alt="02 - config" src="https://github.com/user-attachments/assets/31c4dd1f-62c9-42f1-a82d-8852928728fa" />

Visiting the config endoint revealed a file named 'a.txt' which included database username and password.

<img width="1112" height="436" alt="04 - adminer" src="https://github.com/user-attachments/assets/d8cb593b-9cd8-4011-a011-8fff80e89adb" />

## Exploitation
### Adminer
I knew from the first directory brute force that adminer application was available. I logged in to the application using found DB credentials. Later, I ran an SQL query which revealed users.

<img width="1112" height="436" alt="04 - adminer" src="https://github.com/user-attachments/assets/809e964d-65f4-41d5-9e90-9449f9f03445" />

### User Flag
Then using revealed credentials I got the user.

<img width="658" height="389" alt="05 - user" src="https://github.com/user-attachments/assets/34322824-f388-48db-8f8c-23401f45b900" />

## Privilege Escalation
### sudo -l
Sudoers file revealed that I could run shutdown as root user without password.

<img width="946" height="112" alt="06 - shutdown" src="https://github.com/user-attachments/assets/7cbce894-79b3-48b4-a58f-92c9bc915665" />

### Linpeas
And linpeas revealed that 'check-system' file was writeable by me.

<img width="814" height="499" alt="07 - check-system" src="https://github.com/user-attachments/assets/d79d4923-3336-486d-a87b-e0652c580d14" />

### Analyzing check-system
Moreover, checking with the 'ps -ef' command shows that 'check-system' command's Parrent PID (PPID) is 1 and its start time is equals to the machine boot time. This means, the check-system process run right after the boot.

<img width="648" height="37" alt="10" src="https://github.com/user-attachments/assets/bb9cf68d-dc24-4aff-9bbe-4d328f59d41a" />

Or we can run 'systemctl status check-system.service', and if the service is valid we know that it is a system daemon.

<img width="766" height="164" alt="11" src="https://github.com/user-attachments/assets/1ca748d6-44d4-4e9a-b9e1-8565faee5e2e" />

### Root
Then I simply updated check-system file to give SUID privileges to /bin/bash as root. Then rebooted using shutdown command.

<img width="658" height="117" alt="08 - reboot" src="https://github.com/user-attachments/assets/3842c8aa-9fe9-4897-9422-18ec8fe46b12" />

Then I exploited the SUID bit and got the root flag.

<img width="746" height="360" alt="09 - root" src="https://github.com/user-attachments/assets/4d598bac-a340-499e-abe9-718701952e56" />
