---
layout: post
title: "P.O.O. - HackTheBox Mini Pro Lab"
summary: "Directory brute-force + nikto scanning → .DS_STORE file discovery → ds_store_exp file extraction → IIS Tilde enumeration (6 character shortname) → targeted fuzzing → poo_connection.txt endpoint → connection credentials (external:Pooch1234!) → MSSQL server connection → linked server enumeration (circular dependency chain) → PowerUpSQL Get-SQLLinkCrawl cmdlet → code execution via linked servers → database flag retrieval → backdoor user creation (sysadmin privileges)"
---

# P.O.O. - HackTheBox Mini Pro Lab

## Recon
### Nmap Enumeration
The Initial NMAP scan to the target revealed that MSSQL and HTTP ports were open.

<img width="1655" height="852" alt="00 - nmap" src="https://github.com/user-attachments/assets/cbed2e25-3df7-46af-9b42-705587a3e907" />

### Website Enumeration
Visiting the website revealed default IIS web page.

<img width="1920" height="868" alt="01 - website" src="https://github.com/user-attachments/assets/08a8a2e2-0d65-4252-87e0-dc85d214652c" />

So I did some directory fuzzing and some directories but either they are non-accessible or they required an admin password.

<img width="1116" height="788" alt="02 - ffuf" src="https://github.com/user-attachments/assets/ad60dc96-cbca-428b-86e1-bd3fb1c261ac" />

### .DS_STORE file
So I did more fuzzing with anothe wordlists such as quickhits or rafts from seclists. Moreover, I also started nikto to check if any vulnerabilities were available. Both tools found that .DS_STORE was accessible.

<img width="1258" height="527" alt="03 -  DSSTORE 2" src="https://github.com/user-attachments/assets/35b45a21-b4d7-48e6-94aa-0df80cb4656a" />

<img width="1883" height="539" alt="03 -  DSSTORE" src="https://github.com/user-attachments/assets/fd89693c-f6bb-4353-9135-12c8c3539500" />

So I did some research on this file and found a [medium post](https://iam0xc4t.medium.com/extract-file-from-ds-store-815a22542da9) which explains that we can extract website directories and some of the files using this file. So the file works like .git file.
I used [ds_store_exp](https://github.com/lijiejie/ds_store_exp) tool to extract all available web files.

<img width="817" height="309" alt="04 - dsstore extractor" src="https://github.com/user-attachments/assets/d2503632-0dfc-4949-b9dc-9988d66df26c" />

Then did some more fuzzing to the all endpoints. The Dev/... endpoints revealed some suspicious endpoints.

<img width="1258" height="829" alt="05 - fuzzing" src="https://github.com/user-attachments/assets/c93ac51f-519b-4f76-ace5-5821375673e2" />

### IIS Tilde Enumeration
Then I did even more fuzzing to all dev/.. endpoints but could not find anything useful. Later I knew that this was an IIS server so I could exploit IIS Tilde Enumeration vulnerability.
I could do it using [iis_tilde_enum script](https://github.com/esabear/iis_tilde_enum) or msfconsole. I did both of them as seen below.

<img width="1179" height="560" alt="06 - iis tilde" src="https://github.com/user-attachments/assets/c573a181-c632-44c7-b0d5-d06ed12d39cb" />

<img width="1099" height="523" alt="06 - iis tilde 2" src="https://github.com/user-attachments/assets/4f0812b3-769c-4e2e-afb9-3008f009f28b" />

Then from the 6 character shortname and 3 character extension I could see it was comething like poo_co.....txt, So I did even more and more fuzzing but this time with a specfici wordlist. I created a wordlist from seclists directory fuzzing wordlists, I onyl grepped word that starts with co.

<img width="1140" height="553" alt="07 - poo_connection txt " src="https://github.com/user-attachments/assets/e113ddf1-f571-4b26-b37a-076f626e61eb" />

It showed that the endpoint was poo_connection.txt, so I visited the endpoint and got the flag and connection informations.

<img width="1612" height="384" alt="08 - RECON flag" src="https://github.com/user-attachments/assets/ccf402ba-0f0b-4aad-a68b-d43a2d93efa6" />

## Huh?
### MSSQL Enumeration
With the found credentials I connected to MSSQL server.

<img width="1088" height="422" alt="00 - mssql client" src="https://github.com/user-attachments/assets/01ee96bb-3c6a-48f8-9ed4-19c576f8b05e" />

The user was not DB admin and it could not do anything useful in the SQL server.

<img width="1673" height="302" alt="02 - no dba" src="https://github.com/user-attachments/assets/a2e5b193-0112-4639-95ae-687b889c8d34" />

So, I followed this [hackviser MSSQL cheatsheet](https://hackviser.com/tactics/pentesting/services/mssql) and found out that there were server links.

<img width="1883" height="680" alt="03 - no dba on linked server but circular loop" src="https://github.com/user-attachments/assets/5927ccd6-f28a-4b14-bb2d-36ba1ea8c205" />

The external user from POO_PULIC was linked to internal_user from POO_CONFIG which was linked back to server admin from POO_PUBLIC. The schema can be seen below.

<img width="1741" height="590" alt="04 - 0 SİTUATİON" src="https://github.com/user-attachments/assets/16e6b52e-da02-4c70-9b17-2d66ee29b7d7" />

### PowerUpSQL
So Instead of writing manually, I ran PowerUpSQL script with Get-SQLLinkCrawl Cmdlet and got code execution.

<img width="1846" height="842" alt="05 - code execution" src="https://github.com/user-attachments/assets/eb829dae-750f-4fff-9da8-610dc87dab5f" />

Before moving further, I checked DB and found flag table. Simple read the flag.

<img width="1876" height="858" alt="06 - flag" src="https://github.com/user-attachments/assets/523d9a7b-05e4-4b3b-bf1b-1b8ca35037b5" />

## BackTrack
To avoid crawling links every time I created a backdoor user with sysadmin privileges.

<img width="1890" height="186" alt="00 - backdoor user" src="https://github.com/user-attachments/assets/ce1ca16d-a24e-405b-aff4-93b5cf16002c" />

Then connected using mssqlclient. However, there was a trigger that disallows me to enable xp_cmdshell. So, as a system admin I simply disabled the trigger and ran it.

<img width="1506" height="310" alt="01 - enabled xpcmdshell disabled trigger" src="https://github.com/user-attachments/assets/a9dad5a6-4ec1-439f-8bff-633f35e8c9e4" />

I couşd not get a reverse shell because external communication was dissallowed from the machine. So I enumerated webroot directory and found a web.config file and admin directory.

<img width="901" height="828" alt="02 - web" src="https://github.com/user-attachments/assets/f05468c6-7b53-4801-91c2-ca9237d4fc32" />

### External Scripts in MSSQL
But I had no permissions to read any file inside webroot directory.

<img width="914" height="639" alt="03 - no access," src="https://github.com/user-attachments/assets/cb3111d5-ab40-4243-9fe5-7be6b16f189f" />

So while searching I found an article about [external scripts from hackingarticles](https://www.hackingarticles.in/mssql-for-pentester-command-execution-with-external-scripts/). 
We can use external scripts (if it is available) in MSSQL to run python scripts and good thing is it runs as another user so we may have priileges to read the file.
So I simply tried it and it worked, I read the web.config file. Which included Administrator password.

<img width="1660" height="633" alt="04 - different user with password" src="https://github.com/user-attachments/assets/4dc8386e-6c6e-4b3f-b547-0877dbc6a4a1" />

Then I simply visited the admin endpoint from the website and got the flag.

<img width="1579" height="228" alt="05 - got the flag" src="https://github.com/user-attachments/assets/77f0474c-da87-4e9f-bab7-a6fcb8006b55" />

## Foothold
I ran netstat -ano using xp_cmdshell and found that WinRM port was open but we could not see it on nmap scan. 

<img width="1486" height="684" alt="00 - winrm is open but fw blocks it" src="https://github.com/user-attachments/assets/a8a7a999-019e-4d4e-bb39-69f04312b96b" />

So, I thought probably firewall was blocking it and I ran nmap scan again against the IPv6 address of the target and detected the WinRM port.
Later, I simply added IPv6 address to /etc/hosts file and connected using evil-winrm.

<img width="1486" height="726" alt="01 - lets try ipv6" src="https://github.com/user-attachments/assets/82da98f2-5bf6-4e77-a213-eaca19e27796" />

<img width="1439" height="551" alt="02 - ipv6 evilwinrm" src="https://github.com/user-attachments/assets/bf8e69e8-498a-404d-9a4d-16b23d39c4c7" />

And I got the flag.

<img width="1021" height="347" alt="03 - got flag" src="https://github.com/user-attachments/assets/107e5897-1546-4beb-a4e9-bb4a0215f1bc" />

## p00ned
Inside the machine, at first I checked the DC's IP and found it using ping scan.

<img width="801" height="259" alt="00 - dc scan" src="https://github.com/user-attachments/assets/4cb7175c-7c02-4e7d-b18a-c0c4829f42dd" />

<img width="1194" height="112" alt="00 - internal ping scan" src="https://github.com/user-attachments/assets/d5b185e9-f3e8-48a7-989f-ca9fc1ad2ea2" />

### BloodHound
I could not run SharpHound in the evil-winrm because the user was not the domain user. But I still had MSSQL access which run xp_cmdshell commands as computer account. So, I transfered the SharpHound using evil-winrm and ran it using MSSQL xp_cmdshell.

<img width="1837" height="767" alt="01 - sharphound" src="https://github.com/user-attachments/assets/3532221a-b3b0-4b3d-a323-a98265ff794c" />

<img width="1150" height="579" alt="02 - zip" src="https://github.com/user-attachments/assets/855ac09a-c776-4f16-80ad-e9d8406cafa9" />

Then checked the bloodhound but could not find many useful informations. However, I found out later that p00_adm user is domain admin and could be kerberoastable as it has SPN.

<img width="1369" height="914" alt="03 - kerberoastable" src="https://github.com/user-attachments/assets/4fdc7cb8-e917-4d09-ace8-ba5e5aec83b8" />

### Kerberoasting
So I simply used Rubeus to kerberoast the user.

<img width="1723" height="374" alt="04 - rubeus" src="https://github.com/user-attachments/assets/7c7de1e0-2c21-4ec5-83d7-cfcaf888ab89" />

Then cracked the hash with hashcat using keyboard combinations wordlist.

<img width="1602" height="267" alt="05 - combinations" src="https://github.com/user-attachments/assets/981ee49b-499a-44a3-83d5-a8fe0350dbfe" />

<img width="1883" height="370" alt="06 - cracked" src="https://github.com/user-attachments/assets/0ce85978-9151-4fdb-a826-0d9306e6f9dd" />

### RCE on DC
Now I could simply create credentials in evil-winrm and run remote commands.

<img width="1599" height="267" alt="07 - rce on dc" src="https://github.com/user-attachments/assets/d910dfef-c8e6-454c-91e5-069b32dce950" />

<img width="1760" height="278" alt="08 - poo flag" src="https://github.com/user-attachments/assets/6abeb885-551d-4683-8834-f3f381830573" />

Or I can access remote shares using this credentials directly using net use command.

<img width="1138" height="406" alt="09  - 2nd way" src="https://github.com/user-attachments/assets/513a1e46-779c-4fb0-86ae-c0019d12b65c" />

## Pwned
So whole mini prolab was compromised.

<img width="1043" height="735" alt="PWNED" src="https://github.com/user-attachments/assets/b69156bb-9037-4940-9333-4103a2460147" />
