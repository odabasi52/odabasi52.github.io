# BTRSys2.1 - Proving Grounds Play

## Enumeration
### Nmap 
Initial nmap scan revealed HTTP, SSH and FTP ports were open.

<img width="892" height="626" alt="00 - nmap" src="https://github.com/user-attachments/assets/2ec80009-2063-44df-af64-fe51efe8375c" />

The nmap showed FTP had anonymous session enabled. But the ftp did not have anything in it.

<img width="696" height="414" alt="01 - 0 ftp anon" src="https://github.com/user-attachments/assets/5293bc0d-cf91-4534-872f-c5e826a2da63" />

### Web Enumeration
Website just showed a gif file.

<img width="1290" height="549" alt="01 - web" src="https://github.com/user-attachments/assets/3f265bc1-ba76-4f17-ad10-9becf958d4f5" />

The robots.txt file revealed wordpress endpoint.

<img width="1148" height="455" alt="02 - robots txt" src="https://github.com/user-attachments/assets/644e0bba-2f44-4cfb-a94c-cc47e1413874" />

Enumerating the wordpress endpoint with wpscan revealed two valid users.

<img width="1054" height="546" alt="03 - wp users" src="https://github.com/user-attachments/assets/a6c99588-7fb4-4c41-8c31-5e7a478a74d1" />

Then brute forced the users and got a valid credential.

<img width="1599" height="443" alt="04 - cracked" src="https://github.com/user-attachments/assets/89981c7b-236f-4e38-bc3f-8dc805713b20" />

## Exploitation
### Wordpress Theme Editor
The user was administrator. So I could simply open wordpress theme editor and edit 404.php file as reverse shell.

<img width="1310" height="701" alt="05 - wordpress theme editor" src="https://github.com/user-attachments/assets/a71c2655-d93f-4993-89ff-61487236be89" />

Then all I need to do is setting up a reverse shell and visit <site>/wp-content/themes/<theme_name>/404.php endpoint.

<img width="1158" height="101" alt="06 - visiting" src="https://github.com/user-attachments/assets/bfb13bd1-25ba-485d-903e-5ab2b97efef4" />

<img width="959" height="392" alt="07 - revshell" src="https://github.com/user-attachments/assets/fa09ece5-fa7c-484b-a172-a314774605e7" />

Then visiting the home page of the btrisk user revealed user flag.

<img width="937" height="378" alt="08 - user flag" src="https://github.com/user-attachments/assets/f6e7ab9f-d05e-478f-8c69-02c0d8a35c48" />

## Privilege Escalation
### WP Config
The wp-config.php file revealed a valid root password for the mysql database.

<img width="953" height="579" alt="09 - wpconfig" src="https://github.com/user-attachments/assets/f97989d3-fdf6-4e6f-8413-f06ded8e827a" />

I used that password to login to mysql with the command 'mysql -u root -p' which prompts for password login. Then checking the wp_users table revealed hashed password of the root user.

<img width="1574" height="188" alt="10 - found passwords" src="https://github.com/user-attachments/assets/f3a443ce-7954-4a75-b276-8c48b5c77fa9" />

Used crackstation to crack the hash of the root.

<img width="1574" height="522" alt="11 - cracked" src="https://github.com/user-attachments/assets/f18eecc7-8397-44bd-9a46-064d9b790e31" />

Then, tried it with 'su root' command and it worked. I simply got the root.

<img width="559" height="194" alt="12 - root" src="https://github.com/user-attachments/assets/cd1db41c-db7d-4a03-939b-8ab890f569c4" />
