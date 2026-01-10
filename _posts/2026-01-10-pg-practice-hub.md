---
layout: post
title: "Hub - Proving Grounds Practice"
summary: "Port 8082 → FuguHub 8.4 → Customizable LSP (Lua Server Pages) page → CVE-2024-27697 → RCE (Remote Code Execution) → root"
---

# Hub - Proving Grounds Practice

## Enumeration
### Nmap 
Initial Nmap scan revealed SSH, HTTP, 8082i 9999 ports were open.

<img width="1367" height="692" alt="00 - nmap" src="https://github.com/user-attachments/assets/71f71514-7d20-42f3-aea9-e2131ee6ce7d" />

### WEB Enumeration
The port 80 had nothing special. When I visited it just showed forbidden. However Port 8082 had FuguHub running.

<img width="1920" height="754" alt="01 - website fuguhub" src="https://github.com/user-attachments/assets/31b03491-c716-42b4-90cb-71d5d5540b5f" />

It redirected me to set an admin for the website.

<img width="1920" height="754" alt="02 - website admin set" src="https://github.com/user-attachments/assets/f8697efe-e61a-4303-97b7-94ac21cae763" />

Then I logged in as admin.

<img width="1920" height="754" alt="03 - admin login" src="https://github.com/user-attachments/assets/5be351c5-d4f5-4fa1-b0de-f1305b7bf01f" />

After visiting about page, I found that FuguHub 8.4 was running.

<img width="1920" height="788" alt="04 - 0 version" src="https://github.com/user-attachments/assets/ec8e067f-2808-40a0-9eb0-304b519b7fc2" />

## Exploitation (Directly Root)
### CVE-2024-27697
The about page is an editable page that executes LSP code (Lua Server Pages), a PHP/ASP-like scripting language, simplifies the design of remote real-time monitoring and controller applications for embedded systems.
Its content can be changed through the Administrator panel. The vulnerability inserts a reverse shell written in lua into the About page which is viewable to both logged in and logged out users.

Customizable page can be seen below.

<img width="1920" height="886" alt="06 - customizable page" src="https://github.com/user-attachments/assets/1a16319a-ffc8-4670-8f5d-8822bc5918d2" />

I found an [exploit](https://github.com/SanjinDedic/FuguHub-8.4-Authenticated-RCE-CVE-2024-27697) that both explains and automates that vulnerability.

<img width="1920" height="788" alt="05 - exploit" src="https://github.com/user-attachments/assets/bc85e786-0a5c-49c8-8a40-594599489adb" />

At first I tried to exploit it manually as explained below.

<img width="1253" height="810" alt="06 - 0 exploit" src="https://github.com/user-attachments/assets/4dde1699-ab50-4089-96fd-f7f6c04a2fb9" />

Edited the customizable page and added reverse LSP shell.

<img width="1920" height="886" alt="07 - update lsp script" src="https://github.com/user-attachments/assets/e7456360-be8b-4235-b76d-f4b947895ce7" />

And visiting the about page got me reverse shell.

<img width="1920" height="790" alt="08 - revshell" src="https://github.com/user-attachments/assets/70585a8d-8c0d-4d70-a621-c5a9d3d3e53e" />

I could also run exploit.py directly and get a reverse shell.

<img width="855" height="208" alt="09 - exploit py " src="https://github.com/user-attachments/assets/8052542a-08ba-4caa-9c18-de6945bdf7d0" />

Then I reaad the root flag.

<img width="560" height="158" alt="10 - root" src="https://github.com/user-attachments/assets/93ee4ddc-8d8b-444b-9df7-dc5b5248eab5" />


