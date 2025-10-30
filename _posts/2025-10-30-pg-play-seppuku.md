# Seppuku - Proving Grounds Play

## Enumeration
### Nmap 
Initial Nmap scan revealed SSH, HTTP, FTP and SMB ports were open. Moreover, some non standard ports were open too.

<img width="1004" height="677" alt="00 - nmap" src="https://github.com/user-attachments/assets/95f599bf-0588-47bb-bbc1-6a675013ce46" />

### Failed Attempts
I tried anonymous FTP and it was not allowed. Then tried Guest SMB and it was allowed but no share was readable. Then applied directory brute forcing for HTTP and 8088 ports and it did not reveal anything.

<img width="1072" height="163" alt="01 - smb guest" src="https://github.com/user-attachments/assets/1cd3b421-a490-4711-b94f-71e816703f98" />

### Web Enumeration
Later I applied directory brute forcing to the non standard port, which revealed SSH keys and password lists.

<img width="998" height="722" alt="02 - ffuf 0" src="https://github.com/user-attachments/assets/b63f8173-17ff-4976-a1bb-c0aeb747b004" />

<img width="906" height="437" alt="03 - secrets" src="https://github.com/user-attachments/assets/4d723ca6-f54d-492c-a38d-f6afda18e050" />

<img width="902" height="509" alt="10 - found id_Rsa" src="https://github.com/user-attachments/assets/fcf45eb7-e08b-4960-9a04-68169361d1e2" />

At first I checked passwd.bak and shadow.bak but it showed rabbit hole :D so I did not even try to brute force it.

<img width="957" height="397" alt="04 - rabbit hole" src="https://github.com/user-attachments/assets/66c3d674-94ea-45b3-a33a-1c719977331f" />

## Exploitation
### Brute Forcing
Then with the found password list I applied FTP brute forcing and found a valid login.

<img width="810" height="190" alt="05 - ftp creds" src="https://github.com/user-attachments/assets/e89332ef-20d4-4372-9e18-b5f27a50daeb" />

Then simply logged in and got the user flag.

<img width="649" height="360" alt="06 - user" src="https://github.com/user-attachments/assets/638b5d21-ff1e-47b4-8306-21eb15418970" />

## Privilege Escalation
### Checking users
Current user was seppuku user. There were 2 other users.

<img width="425" height="109" alt="13 - users" src="https://github.com/user-attachments/assets/f54d8335-b2ca-4f04-8456-d0cb137c6ecb" />

### seppuku user
The seppuku user had NOPASSWD sudo privileges over ln binary, but I could not do anything useful with it.

<img width="783" height="92" alt="07 - sudo l" src="https://github.com/user-attachments/assets/c3ac4128-1e7d-4d2f-9947-e6dcb86cf4ef" />

Moreover, the user was in restricted bash environment. So I forced SSH session to open bash with -t flag.

<img width="507" height="36" alt="08 - rbash" src="https://github.com/user-attachments/assets/3a4d0cdc-1727-45b4-adbe-b4f466579e17" />

<img width="344" height="102" alt="09 - rbash bypass" src="https://github.com/user-attachments/assets/eeeaa121-8254-4d5d-9f12-8e1ba1a560b3" />

And, there was .passwd file in the home directory which showed a password like text. I noted it.

<img width="281" height="33" alt="14 - password" src="https://github.com/user-attachments/assets/67e08f46-7832-4a5a-a4bc-1e7a94658d9f" />


### tanto user
Then I ran linpeas. And while checking I found out the tanto user had .ssh in his home page but id_rsa was missing. So I thought maybe I can use the SSH private key I found before. And it worked.

<img width="975" height="540" alt="11 - tanto ssh" src="https://github.com/user-attachments/assets/1673e90d-5ce1-4dae-93d5-55e15acb445d" />

<img width="523" height="277" alt="12 - tanto login" src="https://github.com/user-attachments/assets/59a7256f-4002-4861-b915-d6c24705b784" />

The tanto user could not do anything. I could not understand why I pwned that user.

### samurai user
Later, I tried the password I found from .passwd file against samurai user and it worked. I ran 'sudo -l' and found out I can run /home/tanto/.cgi_bin/bin /tmp/* as sudo NOPASSWD.

<img width="790" height="166" alt="15 - logged in" src="https://github.com/user-attachments/assets/2eb6fafe-a884-4c00-b4a0-704981900a7f" />

So that was why I pwned tanto. To create a malicious binary. In tanto SSH session, I created .cgi_bin directory and malicious binary.

<img width="310" height="77" alt="16 - file creation" src="https://github.com/user-attachments/assets/1fa2873c-9648-4b8a-9a7a-6ae39388301a" />

Then using samurai's privileges and wildcard '*', I applied path traversal to give /bin/bash SUID privileges. And simply got the root.

<img width="667" height="213" alt="17 - root" src="https://github.com/user-attachments/assets/ed805df7-c22c-4c6b-838b-a4b2be9941e1" />

