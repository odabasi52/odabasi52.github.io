# Vegeta1 - Proving Grounds Play

## Enumeration
### Nmap 
Initial nmap scan revealed HTTP and SSH ports were open.

<img width="885" height="379" alt="00 - nmap" src="https://github.com/user-attachments/assets/31731733-f64e-4e4e-bf99-7912969eeb24" />

### Web Enumeration
The website was just showing a header and an image.

<img width="1154" height="418" alt="01 - simple website" src="https://github.com/user-attachments/assets/92c90128-8b4d-456a-a077-65c167b82429" />

Then applied directory brute force and found some endpoints.

<img width="1280" height="576" alt="02 - ffuf" src="https://github.com/user-attachments/assets/d4de91a0-2946-4589-96c5-e44f0fcb4ff9" />

Non of the endpoints were useful (rabbit holes). Then checked robots.txt and found find_me endpoint.

<img width="1116" height="226" alt="03 - robots txt" src="https://github.com/user-attachments/assets/816e84f5-fee7-465c-87b4-d7c50b5277e3" />

It included double base64 encoded comment.

<img width="1116" height="702" alt="04 - find_me file" src="https://github.com/user-attachments/assets/1ea9c79e-4888-46d2-b39b-bac15d3586e2" />

I double decoded it. It showed qr code. Then using 'zbarimg' tool I decoded the qr code. It showed a password.

<img width="1604" height="366" alt="05 - double decode" src="https://github.com/user-attachments/assets/e966abd1-d7f8-4c2f-a9d5-1db61f895a07" />

<img width="1634" height="365" alt="06 - qr code" src="https://github.com/user-attachments/assets/44da0a26-333e-4080-8757-0b43db4b67a4" />

The password was useless, I tried different usernames with this password against SSH and it did not work. Then I applied directory brute forcing with larger list. And found 'bulma' enpoint.

<img width="1349" height="142" alt="07 - bulma" src="https://github.com/user-attachments/assets/3582a851-bfc0-4020-816f-fc1cfd1c9b65" />

## Exploitation
The endpoint included a wav file.

<img width="1290" height="384" alt="08 - hahaha " src="https://github.com/user-attachments/assets/510780ab-cf14-4051-87a0-3df95fad7fa2" />

The audio was spreading a message in morse. So I found an online morse decoder and ran it. It showed the message which included username and password.

<img width="1568" height="572" alt="09 - user and pass" src="https://github.com/user-attachments/assets/fff84da3-232b-40d3-973a-acf7ae39c760" />

So using this information I got the SSH shell.

<img width="989" height="499" alt="10 - got the user" src="https://github.com/user-attachments/assets/e2b0f6e5-b94f-41b7-85c0-67b8eb4a147b" />

## Privilege Escalation
I ran linpeas.sh on the target machine. It showed /etc/passwd file was writeable by the current user.

<img width="739" height="269" alt="11 - linpeas" src="https://github.com/user-attachments/assets/c924c82a-9391-4b1e-94c9-6767ccb2c643" />

So I can either update root entry or add another entry and assign its id to 0 to make it root.

I did the second one and ran the below command:
```bash
pw=$(openssl passwd password); echo "r00t:${pw}:0:0:root:/root:/bin/bash" >> /etc/passwd
```

<img width="1058" height="142" alt="12 - etc passwd update" src="https://github.com/user-attachments/assets/d4680b93-f562-40f1-8cc8-648e3dc0fbdb" />

Later, I simply got the root.

<img width="371" height="138" alt="13 - root" src="https://github.com/user-attachments/assets/9829911d-3cf3-41f5-b287-ae17f2ce70cd" />
