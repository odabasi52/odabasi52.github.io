---
layout: post
title: "Jordak - Proving Grounds Practice"
summary: "Jorani 1.0.0 → CVE-2023-26469 → Jorani RCE → User shell → sudo -l → NOPASSWD env → root"
---

# Jordak - Proving Grounds Practice

## Enumeration
### Nmap
Initial nmap scan revealed SSH and HTTP ports were open.

<img width="803" height="419" alt="00 - nmap" src="https://github.com/user-attachments/assets/d8e493e0-d1ce-4630-8538-ef0068e07124" />

### Web Enumeration
Website was `Jorani 1.0.0`.

<img width="1154" height="675" alt="01 - jorani" src="https://github.com/user-attachments/assets/2edabc39-21d2-41ba-813d-04d89aba17cf" />

I checked Jorani default credentials and found `bbalet:bbalet`.

<img width="1141" height="570" alt="02 - default" src="https://github.com/user-attachments/assets/c37e7e92-c226-4c96-82a5-72305f8916af" />

Later, I tried it and it worked. I logged in.

<img width="1157" height="451" alt="03 - logged in" src="https://github.com/user-attachments/assets/818e72a5-8ac6-4824-a2f3-36abec2b5710" />

## Exploitation
### CVE-2023-26469
In Jorani 1.0.0, an attacker could leverage path traversal to access files and execute code on the server.

I then searched for `Jorani 1.0.0` exploits and found this CVE which allows us to RCE. I also found this script [https://github.com/Orange-Cyberdefense/CVE-repository/blob/master/PoCs/CVE_Jorani.py](https://github.com/Orange-Cyberdefense/CVE-repository/blob/master/PoCs/CVE_Jorani.py)

<img width="1255" height="850" alt="04 - exploit" src="https://github.com/user-attachments/assets/06a9a3a9-a34c-4678-adfe-6b5f325b8c84" />

Executed it and got user shell.

<img width="1202" height="337" alt="05 - shell" src="https://github.com/user-attachments/assets/6d2abf1f-f3ce-4680-802b-9ba07a3e8adf" />

Then calling bash reverse shell while listening with nc, I obtained upgraded shell. Then I simply read user flag.

<img width="597" height="52" alt="06 - nc" src="https://github.com/user-attachments/assets/c6e4ee2a-c5bc-4861-9cdf-abd2635d97fe" />

<img width="912" height="696" alt="07 - local" src="https://github.com/user-attachments/assets/46d1e392-9468-4185-817a-678a2fff3de9" />

## Privilege Escalation
### NOPASSWD env
All I had to do was check `sudo -l` and found out `NOPASSWD env`. Later I executed `sudo env /bin/bash` to obtain root shell.

<img width="962" height="559" alt="08 - root" src="https://github.com/user-attachments/assets/c8b2a350-7e78-4e4d-aac7-dc87b0769e04" />

