---
layout: post
title: "Law - Proving Grounds Practice"
summary: "htmLawed 1.2.5 → CVE-2022-35914 → /htmLawedTest.php Not Found → Non-Default (index.php) endpoint to POST → NC Binary Transfer → Remote Code Execution → cronjob (pspy64) → Update file and exploit cronjob → root"
---

# Law - Proving Grounds Practice

## Enumeration
### Nmap 
Initial Nmap scan revealed SSH, HTTP ports were open.

<img width="847" height="327" alt="00 - nmap" src="https://github.com/user-attachments/assets/86635d94-d690-4374-b504-8f382843b8f6" />

### Web ENumeration
The website was htmLawed 1.2.5 website.

<img width="1920" height="688" alt="01 - website" src="https://github.com/user-attachments/assets/194bb804-3abb-4c44-b723-8cf69823764b" />

## Exploitation
### CVE-2022-35914
/vendor/htmlawed/htmlawed/htmLawedTest.php in the htmlawed module for GLPI through 10.0.2 allows PHP code injection.

The website was vulnerable to RCE but I could not run processing on the website. When I click process button it showed Not Found.

<img width="1920" height="436" alt="02 - not found" src="https://github.com/user-attachments/assets/671bdfb0-4ca6-4e9e-9494-c5064f78f4d2" />

Then I found [this blog](https://mayfly277.github.io/posts/GLPI-htmlawed-CVE-2022-35914/) which explains the exploit in detail.

<img width="1915" height="787" alt="05 - exploit" src="https://github.com/user-attachments/assets/45e2752d-4a82-464b-86b3-86be888451b2" />

I tried again with /vendor/htmlawed/htmlawed/htmLawedTest.php or different combinations but still got NOT FOUND errors.

Later I tried fuzzing and found index.php (which was the default page we see).

<img width="1450" height="865" alt="03 - index php" src="https://github.com/user-attachments/assets/dee9e127-456c-4cd0-94cd-d844fee0d2e3" />

<img width="1287" height="461" alt="04 - index php" src="https://github.com/user-attachments/assets/9985c2e0-9cca-4d8d-a4d7-170e2b3d3c9e" />

And I tried to send POST request to index.php instead of htmLawedTest.php and it worked.

<img width="1535" height="471" alt="06 - works" src="https://github.com/user-attachments/assets/eaab2b02-85be-4121-aac7-390faff240f7" />

Later, I tried bash reverse shell but it did not work. So I downloaded a netcat binary form [H74N/netcat-binaries](https://github.com/H74N/netcat-binaries) repo and transfered it using wget. Later I gave it permissions with `chmod 777 nc`. And finally I ran it and got a reverse shell.

<img width="1732" height="667" alt="08 - revshell" src="https://github.com/user-attachments/assets/20a3e5e2-8d2d-4065-bdb2-eba54378e607" />

Then simply read the local flag in /var/www folder.

<img width="641" height="206" alt="09 - local" src="https://github.com/user-attachments/assets/82840532-0871-4aa2-baf1-67506dfd0c20" />

## Privilege Escalation
### cronjob
Inside the /var/www folder there was a file named cleanup.sh which was owned by us (www-data). We could read and write, however we could not run the operations in the file.

<img width="671" height="326" alt="10 - sus" src="https://github.com/user-attachments/assets/a5d70355-f960-4eb6-b2a3-e2e3258e2e59" />

### pspy64
I ran pspy64 and made sure that root was running a cronjob to execute cleanup.sh

<img width="709" height="118" alt="11 - ez" src="https://github.com/user-attachments/assets/8fa73dea-eb26-411f-b39d-24b11cc13f6e" />

So I updated the script and added nc execution at the end.

<img width="847" height="196" alt="12 - update" src="https://github.com/user-attachments/assets/b129ac8b-419e-4e42-9e3d-8beed1584662" />

After a minute I got the root shell.

<img width="793" height="274" alt="13 - gg" src="https://github.com/user-attachments/assets/dfcc6748-7120-43ef-8cdf-5e5f55a58025" />
