# Monitored - Hack The Box

## Enumeration
### Nmap 
Initial nmap scan revealed SSH, HTTP, HTTPS, LDAP ports were open. I did some enumeration and could not find any useful information from them at first. So later I did UDP enumeration and found that SNMP was open.

<img width="1105" height="562" alt="00 - nmaps" src="https://github.com/user-attachments/assets/068e249b-3885-4fbf-81ec-e7bd30710d85" />

### WEB Enumeration
Website was nagios xi running on HTTPS port. I brute forced the nagiosadmin account but could not find the password.

<img width="1309" height="570" alt="01 - nagios xi" src="https://github.com/user-attachments/assets/a8f50b5c-0747-481b-8497-1548627ddff3" />

### SNMP Enumeration Setup
Later I did SNMP Enumeartion with the tool called SNMP Walk. While I was doing this I did not know the tool called snmpbulkwalk and I did not know that we could show the names of the snmp packets. So before moving on I will explain how to set your attacker machine for better SNMP Enumeration.

1. Uncomment the below line in /etc/snmp/snmp.conf
```bash
mibdirs /usr/share/snmp/mibs:/usr/share/snmp/mibs/iana:/usr/share/snmp/mibs/ietf
```
2. Download snmp-mibs-downloader (and snmpbulkwalk if not installed)
```bash
sudo apt install snmp-mibs-downloader
```
3. Run snmpbulkwalk
```bash
snmpbulkwalk -c public -v2c 10.129.230.96 -m all
```

Below screen shots explain this process:

<img width="904" height="255" alt="02 - 0 snmp" src="https://github.com/user-attachments/assets/afb2a7b7-2eef-470d-b23c-a2d0f79fd50a" />

<img width="1526" height="302" alt="02 - 1 snmp" src="https://github.com/user-attachments/assets/7b36d462-4a76-401c-8567-f75b14778ea4" />

<img width="1076" height="184" alt="02 - 2 snmp names" src="https://github.com/user-attachments/assets/a2842a38-21a3-45cf-b83f-2699c1ab1054" />

### SNMP Enumeration
I ran snmpwalk against the target to gather public strings and saved the output to a file. Then grepping the file with " STRING:" revealed a command that reveales cleartext password of the svc user.

<img width="884" height="84" alt="02 - running snmp walk" src="https://github.com/user-attachments/assets/379b27a5-c4c1-4643-ac64-7607180f829f" />

Later I tried to login to SSH and it did not work. Then tried to login Nagios page, which did not work but gave another error.

<img width="1416" height="774" alt="03 - snmpwalk" src="https://github.com/user-attachments/assets/5f62b9c1-b30d-45ac-92c8-3f051feefa4f" />

### API Enumeration
From there, I did not know what to do so I checked the guideline from the HackTheBox and found out service accounts use APIs to authenticate. So I checked Nagios Xi API login and foun [this forum post](http://support.nagios.com/forum/viewtopic.php?t=58783), which shows the below format:
```bash
curl -XPOST -k -L 'http://YOURXISERVER/nagiosxi/api/v1/authenticate?pretty=1' -d 'username=nagiosadmin&password=YOURPASS&valid_min=5'
```

This will return a token valid for 5 minutes, which can be used to access the dashboard. Below pictures show the process.

<img width="1230" height="168" alt="04 - token" src="https://github.com/user-attachments/assets/94c18e05-c39d-4cd4-b587-29a7d72cf476" />

<img width="1468" height="593" alt="05 -logged in with the token" src="https://github.com/user-attachments/assets/b4140bb2-f105-4e8b-98c1-54b65ae0cbc0" />

## Exploitation
### CVE-2023-40931
The version of the nagios was vulnerable to authenticated SQL Injection. So I found a [PoC script](https://github.com/G4sp4rCS/CVE-2023-40931-POC), which automatically dumps the database.

<img width="1530" height="181" alt="06 - sqli poc run" src="https://github.com/user-attachments/assets/2875c1ad-35f3-476a-9568-25a9762773c3" />

The output included xi_users table, which included nagiosadmin API-KEY and hashed password. I could not crack the password but checking the internet revealed that I could use API key to create a new admin user.

### Create Admin User via API
This [forum post](https://support.nagios.com/forum/viewtopic.php?t=49647), showed that we can create a user using API keys using below comamand:
```bash
curl -s -XPOST "https://XXXXXXXXXXXXX/nagiosfusion/api/v1/system/user?apikey=XXXXXXXXXXXXXXXXXXXXXXXX&pretty=1" -d 'username=XXXXX&password=XXXXX&name=XXXXX&email=XXXXX&auth_level=admin'
```

Executed the command to add new admin user.

<img width="1533" height="132" alt="07 - use api key to create user" src="https://github.com/user-attachments/assets/cd579570-b6d1-488a-8769-c565d805feb6" />

Then logged in as that user.

### RCE
As an admin user, I can run commands on remote machines as health check process. So at first I opened the Configure > Core Config Manager > Commands and created a new check command which runs reverse bash shell.

<img width="916" height="501" alt="08 - create command" src="https://github.com/user-attachments/assets/fbde0024-a807-49d9-b557-457319451f4b" />

Then from the Configure > Core Config Manager > Hosts page, I selected localhost and then selected the check command that I created and ran it while listening with netcat which led me to user flag.

<img width="1664" height="619" alt="09 - host management" src="https://github.com/user-attachments/assets/15266ba0-c535-477e-964d-88f02064cc36" />


## Privilege Escalation
### sudo -l
The sudo -l command revealed that I could run many nagios commands as root.

<img width="1013" height="482" alt="10 - sudo l" src="https://github.com/user-attachments/assets/20d53c7f-d9e2-40d2-9143-d61b22e92212" />

From there I did not know what to do. So I watched ippsec and read the 0xdf blog :D

There are 2 ways to exploit and get the root.

### First way - manage_services.sh (Abusing Excessive Permissions over Service Binaries)
The manage_services.sh file runs commands on some of the services. We could see that by checking the file:

<img width="1032" height="415" alt="11 - services" src="https://github.com/user-attachments/assets/d949f884-a75f-4a01-ad4f-5d59fa2e1bec" />

So I can call these services as root. From there, what I could do is I could check which service binaries I have write access to and update them to add SUID bit to /bin/bash. I used one-liner from 0xdf to check service permissions:
```bash
for service in "postgresql" "httpd" "mysqld" "nagios" "ndo2db" "npcd" "snmptt" "ntpd" "crond" "shellinaboxd" "snmptrapd" "php-fpm"; do find /etc/systemd/ -name "$service.service"; done | while read service_file; do ls -l $(cat "$service_file" | grep Exec | cut -d= -f 2 | cut -d' ' -f 1); done | sort -u
```

This simply loops through all services that was mentioned on manage_services.sh, Finds /etc/systemd/....<service_name>.service paths which includes service binary locations. And greps the binary locations and run ls -l on them.

Running the command revealed I got write permission over npcd and nagios.

<img width="1537" height="230" alt="12 - service permissions" src="https://github.com/user-attachments/assets/3a473792-71c1-45bc-8c2b-335cb4d1da4d" />

So I simply updated npcd binary to add SUID bit to /bin/bash and got the root shell.

<img width="952" height="516" alt="13 - root" src="https://github.com/user-attachments/assets/9c678344-0ffc-4de7-9875-3f1890bab0bc" />

### Second way - getprofile.sh (Abusing Symbolic Links)
At first I analyzed the file to understand what it does. It get and id as input, then reads many files and saves them inside the profile folder, and finally zips them. 

Again I did not know what to do at first. After watching ippsec I understood. We can check all files which are read and find a file which we have permissions over. Then create a symbolic link over that file to a file that we do not have access such as /root/root.txt or /root/.sh/id_rsa files. 

With this information in mind, I checked all files that are read, all files were in /var/log but one of them was inside nagios folder which our user had access. So simply created a symbolic link from this file to root id_rsa file, then ran the script as root.

<img width="1180" height="720" alt="14 - 2nd way symlinc" src="https://github.com/user-attachments/assets/dbf73edb-6bcf-4362-a82b-79be44bee9c0" />

Then unzipped the output and got the id_rsa file.

<img width="933" height="663" alt="15 - unzipping" src="https://github.com/user-attachments/assets/7b993a1e-b852-4cc5-bf61-8840a8c55341" />

<img width="814" height="675" alt="16 - id_rsa" src="https://github.com/user-attachments/assets/e3212bf9-0d88-40e7-b228-e874e74a4be5" />

Finally, logged in as root via SSH.

<img width="768" height="300" alt="17 - root" src="https://github.com/user-attachments/assets/16ee9151-c2d5-4573-bc68-5b452f7bbde3" />

## Pwned
The machine was fully compromised.

<img width="724" height="694" alt="pwned" src="https://github.com/user-attachments/assets/9bcbb217-be84-49e2-a058-d5d2ad62bc3d" />
