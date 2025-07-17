# Flight - Hack The Box

## Enumeration
### Nmap
Initial Nmap scan revealed SMB, Kerberos, HTTP and LDAP ports and a domain name.

<img width="1345" height="711" alt="00 - nmap" src="https://github.com/user-attachments/assets/65236f23-5b38-4dc0-a70d-37edddc5a388" />

### DNS
Using 'dig', I was able to obtain Domain controller's name.

<img width="1113" height="544" alt="01 - DC" src="https://github.com/user-attachments/assets/ee581ae7-2665-4987-8286-b784d8899de6" />

### VHost Enumeration
The website was static. So I did directory brute-force which revealed nothing. Then did vhost enumeration which revealed 'school' domain.

<img width="1280" height="502" alt="02 - subdomain" src="https://github.com/user-attachments/assets/fd395479-85e1-48b9-92e4-46a0dc0df84c" />

## Exploitation
### SMB Authentication
I set up a responder to listen for SMB authentication requests and obtain the hash. Then inside the school.flight.htb website, used LFI vulnerability to access fake share with my attacker IP, which revealed target hash.

<img width="1385" height="323" alt="03 - fake share" src="https://github.com/user-attachments/assets/402c2f9b-b988-49b2-b9ef-48161aa21e79" />

<img width="1893" height="418" alt="04 - got the hash" src="https://github.com/user-attachments/assets/dd51c006-06af-45c5-a4cd-c763c3e6e087" />

Then simply cracked the hash with hashcat.

<img width="1872" height="167" alt="05 - cracked" src="https://github.com/user-attachments/assets/dda1a3a8-b334-486d-ab90-be34dd16c181" />

### User Enumeration and Password Spray
So this was a service account which did not have many permissions. Using crackmapexec I generated a userList.

<img width="1463" height="366" alt="06 - userList" src="https://github.com/user-attachments/assets/f9c54bcc-22e6-46dd-8617-c38d36fa6b3c" />

The userList can also be generated with impacket-lookupsid

<img width="883" height="536" alt="06 - userList2" src="https://github.com/user-attachments/assets/47428c23-32d1-4c1a-a2d2-f1c05665be94" />

Then using cracked service account password, I applied password spraying attack which revealed one of the users had same password.

<img width="1293" height="319" alt="07 - got the user" src="https://github.com/user-attachments/assets/72a9ecf8-8cf8-4544-aefd-08f8a089c039" />

### NTLM Theft
The user had write access to a share which is probably commonly accessed. 

<img width="1629" height="298" alt="08 - s moon shares" src="https://github.com/user-attachments/assets/34bd183a-30a9-43ef-958f-c37461280d8c" />

Using '[ntlm_theft](https://github.com/Greenwolf/ntlm_theft)' tool I uploaded a phishing file inside the share, then started responder which allowed me to capture the hash of a user.

<img width="830" height="465" alt="09 - ntlm theft" src="https://github.com/user-attachments/assets/aaa1eaf1-c074-4159-9899-b8fdbe1fd749" />

<img width="767" height="123" alt="10 - put" src="https://github.com/user-attachments/assets/89dfc0d5-72e9-4b5a-b8a4-9b023299d41d" />

<img width="1884" height="170" alt="11 - c bum hash" src="https://github.com/user-attachments/assets/e2682aba-5af7-4e49-9bc3-754d7cbf5d12" />

Then using hashcat again, I cracked the hash.

<img width="1880" height="164" alt="12 - cracked" src="https://github.com/user-attachments/assets/10a99de0-46d0-4548-befc-9520a47ae385" />

### SMB Shares
The c.bum user had write access to the Web share. 

<img width="1577" height="296" alt="13 - c bum write web" src="https://github.com/user-attachments/assets/c24cdcd4-5048-4e34-97c2-61542933dc2a" />

So I generated a PHP Reverse shell and uploaded it to the target share, which allowed me to execute commands on target computer.

<img width="379" height="61" alt="14 - rev shell" src="https://github.com/user-attachments/assets/29893c90-3175-40a1-b419-716a7b6f0793" />

<img width="943" height="589" alt="15 - rev php" src="https://github.com/user-attachments/assets/c683b9ed-e2fe-4333-be43-5a584200bee1" />

<img width="580" height="194" alt="16 - got it" src="https://github.com/user-attachments/assets/6aff3ef3-6b9d-4545-aaa0-381feebfe17a" />

### Get an Interactive Shell
To get an interactive shell, I uploaded nc64.exe file and started netcat listener. Then running the command from the webshell, I got an interactive reverse shell.

<img width="798" height="262" alt="17 - download netcat" src="https://github.com/user-attachments/assets/ce81aa88-3183-493c-9580-71130373b071" />

<img width="795" height="553" alt="18 - got the shell" src="https://github.com/user-attachments/assets/77773b46-e858-4e74-bc20-e334883ce535" />

### Getting User
The shell was running as service account. So we had to run runas to get the c.bum user but we can not anwser the password prompt. So the solution was to use RunAsCs tool to get a reverse shell.

<img width="867" height="61" alt="19 - put runascs" src="https://github.com/user-attachments/assets/aa668467-7d34-4fd2-8ca8-24cfffa1be98" />

<img width="1475" height="152" alt="20 - runascs" src="https://github.com/user-attachments/assets/7a9efcbd-03bc-4a0d-ab39-55b438988b10" />

<img width="897" height="320" alt="21 - c bum" src="https://github.com/user-attachments/assets/016d2af7-4e53-4519-95ce-1f46bdb2485b" />

## Lateral Movement
While analyzing the computer, found inetpub page which is a .NET website (external websites was PHP).

<img width="767" height="768" alt="22 - inetpub" src="https://github.com/user-attachments/assets/cd9b752c-6a80-44fe-bf97-9c6b90882878" />

Using 'icacls' tool, I found c.bum user had write access here.

<img width="614" height="255" alt="26 - full access" src="https://github.com/user-attachments/assets/575db2e3-ea10-4242-972d-9c92df60d575" />

So I thought there was probably an internal website. So run 'netstat' command to check ports. Port 8000 was common for web applications.

<img width="836" height="782" alt="23 - port 8000" src="https://github.com/user-attachments/assets/fe99328f-a3ae-4a4a-a74b-a54f641aab0a" />

### Port Forwarding
So I had to do remote port forwarding to access internal website. I uploaded chisel to the target. Then started chisel server with reverse option.

<img width="1091" height="145" alt="25 - chisel2" src="https://github.com/user-attachments/assets/c99560f2-5fd6-4faa-a99e-13bcebe8bb4c" />

Then connected to server with client.

<img width="913" height="96" alt="24 - chisel1" src="https://github.com/user-attachments/assets/96af3bc3-8865-46d4-906f-a06bc5e8eb6a" />

### Reverse Shell
Then uploaded and put ASPX reverse shell to here. Visiting the page from the site got me reverse shell.

<img width="307" height="58" alt="27 - shell" src="https://github.com/user-attachments/assets/c2f19ac4-efd1-4339-b950-d90cc0038502" />

<img width="921" height="546" alt="28 - system account" src="https://github.com/user-attachments/assets/37abeeab-ece7-4dd1-8035-9ef904b69dd7" />

So I could see that it was a system account. I knew it because the prefix was not domain name. To test it I ran responder and tried to access fake share which revealed computer account hash.

<img width="588" height="78" alt="29 - fake share" src="https://github.com/user-attachments/assets/d90ec242-4fcd-474a-9485-5e46e4ef332c" />

<img width="1888" height="178" alt="30 - system account" src="https://github.com/user-attachments/assets/1e38c81e-9de6-4780-8059-85b583e2d690" />

From now on we have 2 choises.
- Use SeImpersonatePrivilege to privilege escalation (JuicyPatato etc.)
- Using rubeus, simply ask for tgt and using this tgt apply DCSync attack.

### TGT Delegation and DCSync
So using Rubeus I obtained Domain Controller's ticket.

<img width="1886" height="719" alt="31 - tgt delegation" src="https://github.com/user-attachments/assets/df8102d7-43c2-4d23-aa95-6b7a90568169" />

Then, first used 'ntpdate' to sync date with target DC to be able to use kerberos. Later, base64 decoded the file and converted the ticket to ccache file. Then using the ccache file I simply applied DCSync attack with 'secretdumps.py'. 

<img width="1758" height="355" alt="32 - got it" src="https://github.com/user-attachments/assets/ab36024e-d9d2-4050-9abb-eba2d4715f60" />

Finally, used dumped hash to get a system shell and got root flag.

<img width="1680" height="363" alt="34 - got the admin" src="https://github.com/user-attachments/assets/225b1813-ad88-4ca0-9eb5-3f67cc6b70b6" />

## Pwned
The machine was fully compromised.

<img width="714" height="679" alt="pwne" src="https://github.com/user-attachments/assets/c46bbb98-7665-4ed6-8cdd-a58084736197" />
