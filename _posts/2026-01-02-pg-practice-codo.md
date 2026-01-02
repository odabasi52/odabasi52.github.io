---
layout: post
title: "Codo - Proving Grounds Practice"
summary: "CodoForum default admin credentials → CodoForum config page update allowed extension → CodoForum RCE → Passowrd inside website config.php → su root"
---

# Codo - Proving Grounds Practice

## Enumeration
### Nmap 
Initial Nmap scan revealed HTTP, SSH ports were open.

<img width="868" height="435" alt="00 - nmap" src="https://github.com/user-attachments/assets/dd70d9e3-dc9b-41dc-a952-ac28ca09b3d5" />

### Web Enumeration
Website was CodoForum website.

<img width="1920" height="919" alt="01 - web codo logic" src="https://github.com/user-attachments/assets/84089aac-041f-4f72-96bb-e8e0ea78a1f8" />

At first I brute forced to find versioning metafiles and found Readme.md file. It showed 5.2 as seen in the image.

<img width="1305" height="523" alt="02 - README " src="https://github.com/user-attachments/assets/af3d5227-9e0d-4ecd-939e-992ac8e5b76f" />

<img width="1920" height="421" alt="03 - version" src="https://github.com/user-attachments/assets/e239d97e-ab1f-4469-9472-03fc0f1a5fee" />

Then I found admin endpoint and tried admin:admin and it also worked. I logged in as admin and found that the version is actually 5.1 and will be updated to 5.2 as seen in images.

<img width="1919" height="866" alt="05 - admin admin login" src="https://github.com/user-attachments/assets/e4c7bd49-577b-4e55-8177-bf638e9c810f" />

<img width="1919" height="866" alt="06 - logged in - version" src="https://github.com/user-attachments/assets/7e549e71-2614-424d-99ff-70818f2d0de0" />

## Exploitation
### CVE-2022-31854
Then I searched the version and found that this version is vulnerable to RCE via admin logo update. However, uploading php extensions were disallowed.

<img width="1543" height="569" alt="image" src="https://github.com/user-attachments/assets/1372c412-0a22-45ae-9c89-53a7bfef33b0" />

So I searched the website and found allowed extensions list and added php.

<img width="1919" height="895" alt="07- allowed upload types" src="https://github.com/user-attachments/assets/2240b291-5ff0-4168-9f5e-f07e92633c6c" />

Then I simply uploaded php shell and got a reverse shell.

<img width="1919" height="944" alt="08 - shell" src="https://github.com/user-attachments/assets/7e72ab56-6807-4580-8a1b-1c729d14589e" />

<img width="1919" height="944" alt="09 - shell" src="https://github.com/user-attachments/assets/5335052f-d514-438c-9682-603e32c13029" />

## Privilege Escalation
### Config File
I tried some known methods such as sudo -l or SUID bits or kernel exploits and none of them worked. Then I started to search the web folders. 

There was a config.php file inside the web directory.

<img width="786" height="328" alt="11 - config" src="https://github.com/user-attachments/assets/43a0af17-aef1-4e0b-8b92-0ae1245f42a9" />

And it included a password.

<img width="402" height="286" alt="12 - password" src="https://github.com/user-attachments/assets/ab99c9b9-dfab-4077-8431-d24ee5629a4a" />

And I tried it with root, it worked. I got the root.

<img width="775" height="481" alt="13 - flag" src="https://github.com/user-attachments/assets/e22d493a-079a-44b8-a472-6b7819dea873" />

Note that, we can also run linpeas.sh and find that password directly.

<img width="1180" height="383" alt="10 - linpeas" src="https://github.com/user-attachments/assets/7eec783d-b948-4d7a-a0c5-3900eb68b1f1" />

<img width="762" height="107" alt="12 - password 2" src="https://github.com/user-attachments/assets/909d4ade-7bc2-4801-a3a2-fe252c2064f4" />

As seen in the image, linpeas directly greps the password.
