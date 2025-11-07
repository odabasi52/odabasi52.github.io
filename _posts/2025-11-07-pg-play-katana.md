# Katana - Proving Grounds Play

## Enumeration
### Nmap 
Initial nmap scan revealed HTTP, SSH, FTP and uncommon web ports were open.

<img width="867" height="639" alt="00 - nmap" src="https://github.com/user-attachments/assets/f5ab5105-0a82-47a5-a408-16f349194121" />

### Web Enumeration
The port 8715 was asking for credentials. Port 8088 and 80 was simple katana picture.

<img width="1291" height="570" alt="01 - web" src="https://github.com/user-attachments/assets/406780ed-06a8-4053-abc5-565894c96f27" />

<img width="1289" height="559" alt="01 - web 2" src="https://github.com/user-attachments/assets/7a4c5b45-cdd4-481c-a594-b4bb05454a61" />

I applied directory brute forcing to the standard HTTP port and found ebook endpoint.

<img width="1299" height="590" alt="02 - ebook" src="https://github.com/user-attachments/assets/19b27bc6-6919-4664-958c-423993e1c80e" />

The endpoint was vulnerable to sql injeciton but I could not get any information other than the credentials admin:admin. 

<img width="1285" height="550" alt="03 - ebook sqli" src="https://github.com/user-attachments/assets/9274c250-545c-438c-881e-f60cf358aedd" />

Then searching the ebook version revealed it was vulnerable to malicious file upload through admin_edit.php and admin_add.php, but when I tried those endpoints it gave 404 not found.

So I applied directory brute forcing to port 8088 and found some valid endpoints.

<img width="1286" height="627" alt="04 - 8088 brute" src="https://github.com/user-attachments/assets/a5342331-46bc-4d63-878b-1aad2db0b9ef" />

## Exploitation
The upload.php and upload.html enpoints seemed suspicious. The upload.html endpoint was uploading 1 or 2 files to other web server.

<img width="1247" height="661" alt="05 - upload html" src="https://github.com/user-attachments/assets/613b70d7-5a8c-4896-bed6-a5e98e87e615" />

So I created reverse shell file in php language and uploaded it. The site showed that the file is moved to manager site.

<img width="1247" height="661" alt="06 - uplaod rev" src="https://github.com/user-attachments/assets/4df8620f-1864-4abd-b74b-4b56af57ca11" />

So I thought maybe it was in port 8715 where the credential was asked. I tried found credential admin:admin and it worked. I got the reverse shell.

<img width="1113" height="84" alt="07 - admin admin rev php" src="https://github.com/user-attachments/assets/b7a11ceb-4948-4a72-8c82-1a7925bee70f" />

<img width="694" height="312" alt="08 - local" src="https://github.com/user-attachments/assets/b12e51be-d402-4be9-b034-0e4f04b4128e" />

## Privilege Escalation
I ran linpeas.sh and transfered it through same manager web server, that www-data had write access to and analyzed it. It revealed that the python2.7 had setuid capabilities.

<img width="481" height="123" alt="09 - linpeas" src="https://github.com/user-attachments/assets/649a9f07-6434-4232-9e01-3169b3315e16" />

So I could simply create python file or more simply use '-c' flag to run python directly and get the root.

<img width="894" height="461" alt="10 - got the root" src="https://github.com/user-attachments/assets/3c3fe1aa-dcf8-4a94-ae83-68c0ca92f36f" />
