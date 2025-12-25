# Astronaut - Proving Grounds Practice

## Enumeration
### Nmap 
Initial Nmap scan revealed HTTP and SSH ports were open.

<img width="1008" height="505" alt="00 - nmap" src="https://github.com/user-attachments/assets/100d540f-035e-49be-8d74-2854c7a03f01" />

### WEB Enumeration
The website was Grav CMS website.

<img width="1917" height="421" alt="01 - webb" src="https://github.com/user-attachments/assets/553f8918-96ab-4b23-86bf-750929bef099" />

<img width="1917" height="921" alt="02 - grav" src="https://github.com/user-attachments/assets/529d7adc-abc6-409a-ba40-015508d9ca0c" />

I found admin login page on the website. Tried some default credentials but none of them worked.

<img width="1917" height="921" alt="03 - admin page" src="https://github.com/user-attachments/assets/baaea09f-06b8-4cf3-bfad-f82b75209306" />

## Exploitation
### CVE-2021-21425
While searching grav exploit on google, I found a [post from mehmet ince](https://mehmetince.net/cve-2021-21425-unexpected-journey-7-gravcms-unauthenticated-arbitrary-yaml-write-update-leads-to-code-execution/) 
which explains a unauthenticated RCE on grav cms. It also included metasploit script.

<img width="1920" height="885" alt="04 - found a post" src="https://github.com/user-attachments/assets/bff1edb5-e601-4273-bda5-1a409ac3ec58" />

And found a github repo that included exploit script for this CVE.

<img width="1920" height="885" alt="05 - github" src="https://github.com/user-attachments/assets/12f2f15e-c0df-4dba-ad04-69e436c81efe" />

I tried to exploit and it worked. I got a reverse shell.

<img width="1603" height="204" alt="06 - exploit" src="https://github.com/user-attachments/assets/a9155581-f497-4243-8616-719c1b664363" />

<img width="945" height="215" alt="07 - shell" src="https://github.com/user-attachments/assets/f3956532-3ed8-42d5-9cf1-32f92b0b0e58" />

Metasploit script also worked and got me a reverse shell.

<img width="1179" height="569" alt="08 - msfconsole shell" src="https://github.com/user-attachments/assets/1c92508f-b467-41d0-922f-408d6f76649d" />

## Privilege Escalation
### admin.yaml
While searching through web files I found a yaml file which included admin's hashed password. I tried to crack it but could not. So it was useless.

<img width="872" height="319" alt="10 - admin yaml" src="https://github.com/user-attachments/assets/4fd05653-ac81-4430-a8da-97d532737854" />

### PHP (SUID Bit)
I checked SUID binaries and found that PHP was SUID binary.

<img width="1393" height="818" alt="11 - php " src="https://github.com/user-attachments/assets/b257125c-cf06-467c-9e02-49b380709ca6" />

I found GTFOBins page for php SUID exploitation.

<img width="1920" height="653" alt="11 - 0 php" src="https://github.com/user-attachments/assets/258c7d2f-10e3-4e1b-92b7-2fa0712c66bc" />

Then applied the steps and got root.

<img width="1223" height="483" alt="12 - gg" src="https://github.com/user-attachments/assets/c50f5b81-1cdc-4a71-98d7-7868cb68ad4f" />


