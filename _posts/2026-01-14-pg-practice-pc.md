---
layout: post
title: "PC - Proving Grounds Practice"
summary: "TTYD Terminal → rpc.py application running locally on 65432 → ligolo-ng agent and proxy → Add route to 240.0.0.1/32 (127.0.0.1 of agent) → CVE-2022-35411 → rpc.py RCE exploit → bash reverse shell → root"
---

# PC - Proving Grounds Practice

## Enumeration
### Nmap 
Initial Nmap scan revealed SSH, 8000 ports were open.

<img width="958" height="482" alt="00 - nmap" src="https://github.com/user-attachments/assets/16d74cd5-50b6-4b10-acef-fb63c2527c78" />

### WEB Enumeration
Port 8000 was TTYD Terminal application.

<img width="1920" height="584" alt="01 - pc" src="https://github.com/user-attachments/assets/c138eb97-2197-4d2a-95d5-b67488e71404" />

## Exploitation (Directly Root)
We already had access to the user. So I ran linpeas and found a suspicious file ran by root (rpc.py).

<img width="1303" height="244" alt="02 - sus" src="https://github.com/user-attachments/assets/57f6a178-b40e-49e0-8c92-1bc7d3c9c3c3" />

Then I checked the rpc.py, it was runnşng a web application. Then checked netstat and found it was running locally on port 65432.

<img width="987" height="847" alt="03 - rpc py and localhost running application" src="https://github.com/user-attachments/assets/5b6a5c9a-1c55-412b-af38-6f24a9f0bd4d" />

### ligolo-ng
So I decided to run ligolo-ng to access internal application from outside.

I set the proxy and run the agent. Note that to access internal network (127.0.0.1) of the agent we need to add route to 240.0.0.1/32. For more information about this: [https://docs.ligolo.ng/Localhost/](https://docs.ligolo.ng/Localhost/)

<img width="1568" height="632" alt="04 - agent localhost" src="https://github.com/user-attachments/assets/61693999-2aa5-424b-a5e4-f7148776f566" />

<img width="840" height="101" alt="05 - agnet" src="https://github.com/user-attachments/assets/6727f899-1e40-4744-97c7-eb1aa848d1a9" />

### CVE-2022-35411
rpc.py through 0.6.0 allows Remote Code Execution because an unpickle occurs when the "serializer: pickle" HTTP header is sent. In other words, although JSON (not Pickle) is the default data format, an unauthenticated client can cause the data to be processed with unpickle.

After some research I found that rpc.py is vulnerable to command execution. As our target was running this app as root, we could simply get root by this vector. So I checked and found an [exploit](https://github.com/fuzzlove/CVE-2022-35411). 

<img width="1920" height="778" alt="06 - exploit" src="https://github.com/user-attachments/assets/38a25eab-ed89-4c2d-af37-d5d72f2769a2" />

This exploit was running for 127.0.0.1 so I updated to script to 240.0.0.1 (127.0.0.1 of target).

At first I tested the exploit with simple http request and it worked.

<img width="1420" height="102" alt="07 -testing exploit" src="https://github.com/user-attachments/assets/6cf870f0-08a3-4c70-9783-e0348e454323" />

<img width="736" height="99" alt="08 - it works" src="https://github.com/user-attachments/assets/8662fd16-d0d5-4dd8-acbd-65b4da1099ce" />

So I started netcat listener, then ran bash reverse shell and got the shell.

<img width="1688" height="86" alt="09 - exploit" src="https://github.com/user-attachments/assets/6eb127ba-192c-4d56-8741-422ba0d38d71" />

<img width="847" height="346" alt="10 - gg" src="https://github.com/user-attachments/assets/79b97244-1345-4e94-8291-8d4d7f5fd6de" />
