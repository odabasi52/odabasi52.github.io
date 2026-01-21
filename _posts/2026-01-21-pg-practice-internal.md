---
layout: post
title: "Internal - Proving Grounds Practice"
summary: "Nmap vuln script scan → CVE-2009-3103 (SMB RCE) → Administrator"
---

# Internal - Proving Grounds Practice

## Enumeration
### Nmap 
Initial Nmap scan revealed SMB and other common ports were open.

<img width="1613" height="838" alt="00 - nmap" src="https://github.com/user-attachments/assets/2af167b9-410b-450e-a2fd-7903df162961" />

At first I tried SMB Null session but it was not available. So I re-run the nmap scan with vuln script and found out that the machine is vulnerable to CVE-2009-3103 through SMB.

<img width="1337" height="756" alt="01 - vuln nmap" src="https://github.com/user-attachments/assets/7e94eee1-a397-4111-9550-3aadde403ff1" />

## Exploitation (Directyly SYSTEM)
### CVE-2009-3103
After some research I found [an exploit on github](https://github.com/sec13b/ms09-050_CVE-2009-3103). 

<img width="1920" height="963" alt="02 - exploit" src="https://github.com/user-attachments/assets/de3355a1-a057-4baa-90b4-fdd554489d1a" />

It was explaining how to use metasploit for this CVE. So I simply used it and got a SYSTEM shell.

<img width="1613" height="527" alt="03 - done" src="https://github.com/user-attachments/assets/4db3559d-11b6-40fc-91fc-f8867313e78b" />
