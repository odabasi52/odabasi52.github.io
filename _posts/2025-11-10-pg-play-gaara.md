---
layout: post
title: "Gaara - Proving Grounds Play"
summary: "Directory brute-force → story content endpoints (rabbit holes) → SSH username enumeration (gaara:gaara) → password brute-force → SUID GIMP and GDB discovery → SUID GDB privilege escalation via GTFOBins (copy binary with SUID bit set)"
---

# Gaara - Proving Grounds Play

## Enumeration
### Nmap 
Initial nmap scan revealed HTTP and SSH ports were open.

<img width="799" height="316" alt="00 - nmap" src="https://github.com/user-attachments/assets/6ca74df1-dbe1-4e8c-a585-9723f8842c9f" />

### Web Enumeration
Website only showed a PNG file.

<img width="1265" height="563" alt="01 - web" src="https://github.com/user-attachments/assets/75291d1a-53a2-43ef-a7f7-6183a7b3b0d6" />

I applied directory brute forcing and only one endpoint was available.

<img width="1116" height="107" alt="02 - dirbuster" src="https://github.com/user-attachments/assets/236e7e95-150c-49dd-9b29-12c76d081aa4" />

That endpoint showed 3 additional endpoints inside it.

<img width="1216" height="773" alt="03 - web" src="https://github.com/user-attachments/assets/0c885354-9a18-48ea-8718-0285fb6d5495" />

<img width="666" height="150" alt="04 - curl" src="https://github.com/user-attachments/assets/a03875df-2b58-4958-a770-0fe2acc9f790" />

Then visited those endpoints. It was useless, some story about character I do not even know named Gaara.

<img width="1281" height="592" alt="05 -useless" src="https://github.com/user-attachments/assets/8d8a0014-6ade-4398-91ae-59b797990fbb" />

## Exploitation
However, the name gaara is mentioned too much even machine's name is gaara. So I brute forced SSH login using gaara as username. And I found a valid password. Logged in and got the user flag.

<img width="869" height="395" alt="06 - brute" src="https://github.com/user-attachments/assets/8819e574-c5a5-4c20-8ea3-143fae1c73c1" />

### Privilege Escalation
There were 2 non-common SUID bit privileges: GDB and GIMP. I tried gimp at first but it did not work. Then tried gdb and it worked. I simply copied gtfobins SUID privilege escalation for gdb and got the root flag.

<img width="838" height="259" alt="07 - gimp" src="https://github.com/user-attachments/assets/8372780a-326a-4b69-8218-480a1dd83cc5" />

<img width="815" height="326" alt="08 - root" src="https://github.com/user-attachments/assets/d4c5e44b-4538-4735-a9f1-41f0a1246eb2" />
