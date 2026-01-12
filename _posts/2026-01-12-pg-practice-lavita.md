---
layout: post
title: "Lavita - Proving Grounds Practice"
summary: "Lavarel 8.4.0 → CVE-2021-3129 → joshuavanderpoll/CVE-2021-3129 exploit to RCE→ www-data shell → cronjob enumeration (pspy64) → cronjob abuse with file writing → user shell → sudo -l → composer sudo privileges → user had not write access so switched to www-data → root"
---

# Lavita - Proving Grounds Practice

## Enumeration
### Nmap 
Initial Nmap scan revealed SSH, HTTP ports were open.

<img width="990" height="460" alt="00 - nmap " src="https://github.com/user-attachments/assets/8dd05088-fb40-48ce-9275-d06701eb867d" />

### WEB Enumeration
Website was a static website but there were names in it, I noted them.

<img width="1915" height="701" alt="01 - web and users" src="https://github.com/user-attachments/assets/9a646b82-699e-41ab-a47b-a41e5724cea8" />

When I click send button below the page, it gave error which revealed the version of Lavarel 8.4.0

<img width="1915" height="701" alt="02 - send" src="https://github.com/user-attachments/assets/ab1ec121-4045-445a-bf5e-727d6f0dd87b" />

<img width="1915" height="701" alt="03 - version" src="https://github.com/user-attachments/assets/6817c34d-bb83-4b7f-98c7-afbd5306ff89" />

## Exploitation
### CVE-2021-3129 
Ignition before 2.5.2, as used in Laravel and other products, allows unauthenticated remote attackers to execute arbitrary code because of insecure usage of file_get_contents() and file_put_contents(). This is exploitable on sites using debug mode with Laravel before 8.4.2.

I found that this version is vulnerable to RCE if it is in debug mode.

At first I registered a user and logged in to website.

<img width="1915" height="665" alt="04- lavita" src="https://github.com/user-attachments/assets/eb36316d-bf91-493f-b7ff-e8ed73f7302a" />

<img width="1920" height="814" alt="05 - registered" src="https://github.com/user-attachments/assets/9f91ae10-73ef-447e-a392-fff57c3bc718" />

And I enabled the debug mode.

<img width="1920" height="814" alt="06 - enabled" src="https://github.com/user-attachments/assets/3a219384-19f8-406a-a58b-16ee0314668f" />

Then while searching I found this [hackerone post](https://hackerone.com/reports/2765259) which explains this exploit in detail.

<img width="1920" height="921" alt="09 - h1" src="https://github.com/user-attachments/assets/fb000ba1-c0ae-4a4a-9d3b-8d54e463e292" />

The hackerone post mentioned an exploit [joshuavanderpoll/CVE-2021-3129](https://github.com/joshuavanderpoll/CVE-2021-3129) repo.

<img width="1920" height="921" alt="10 - exploit" src="https://github.com/user-attachments/assets/09bdd0cd-545e-4251-9b40-5e79a13819c0" />

I downloaded it and tested it. It worked really well.

<img width="1327" height="674" alt="11 - rce" src="https://github.com/user-attachments/assets/178ab56a-a0b6-4dc5-99f8-e00b18f81239" />

After some try I got the reverse shell using netcat.

<img width="1130" height="292" alt="12 - executed nc" src="https://github.com/user-attachments/assets/3bac8558-d96c-4584-855a-24295ec674c8" />

<img width="1130" height="292" alt="13 - shell" src="https://github.com/user-attachments/assets/4450ad9a-66d0-4ca4-9a1f-99c5226eb3e6" />

I had read permission as www-data so I read the user flag.

<img width="822" height="267" alt="14 - user flag" src="https://github.com/user-attachments/assets/2edd003e-1e94-4f07-91a1-a6057cb38888" />

## Lateral Movement
### Environment Variable (Wrong Try)
At first I checked website configs and found that some passwords are stored in environment variables.

<img width="908" height="646" alt="15 - env" src="https://github.com/user-attachments/assets/d8ff63b7-fedf-416f-9ef3-8f88d4809584" />

I accessed the mysql but it did not have any useful information.

### Cronjob abuse (pspy64)
Later I ran pspy64 and found that user with id 1001 was running php file periodically.

<img width="1496" height="734" alt="16 - 1001" src="https://github.com/user-attachments/assets/2323f6ca-f457-47c1-bf59-b4c7e027970c" />

So I had write permission over that file. At first I created a php reverse shell.

<img width="851" height="253" alt="17 - shell" src="https://github.com/user-attachments/assets/e68de04b-19a8-4f15-9e4e-6358f125d43b" />

Then I simply overwritten that file.

<img width="1079" height="482" alt="18 - uploaded shell" src="https://github.com/user-attachments/assets/26c024b8-0f76-4e01-bb00-f5c767cfe722" />

And got the user shell.

<img width="863" height="351" alt="19 - user shell" src="https://github.com/user-attachments/assets/39530d8c-204f-4177-a08b-037d334c0824" />

## Privilege Escalation
### Composer Sudo Exploitation (sudo -l)
The user had NOPASSWD sudo permissions on composer binary for specific working dir.

<img width="879" height="177" alt="20 - sudo l" src="https://github.com/user-attachments/assets/66058c9d-45a8-4170-8a46-f38aa8b6c12b" />

[GTFOBins](https://gtfobins.github.io/gtfobins/composer/) shows how to exploit it but we have to make some changes to work with our working dir. So at first instead of creating temporary variable, I used our working dir in gtfobins steps. However, user had no write access to the working dir.

<img width="1091" height="221" alt="22 - test" src="https://github.com/user-attachments/assets/3596095a-c8cf-425f-9edc-82250b534c97" />

But, www-data had write acces. So I switched to the previous shell and created that composer.json file.

<img width="1392" height="93" alt="23 - www data" src="https://github.com/user-attachments/assets/3d69ed63-76c3-4b3c-a3de-a1f6d7c55b2c" />

Then I simply ran last step on GTFOBins and got the root shell.

<img width="1091" height="247" alt="24 - ezz" src="https://github.com/user-attachments/assets/bf0b20c3-a2cb-4ea8-b0fc-febbd7b309c1" />
