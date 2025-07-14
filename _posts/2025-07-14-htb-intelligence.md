# Intelligence - Hack The Box

## Enumeration
### Nmap
The Nmap scan revealed open ports for SMB, LDAP, and Kerberos, which strongly suggests that the target is a Domain Controller. Additionally, an HTTP port was also found to be open.

<img width="1431" height="858" alt="00 - nmap" src="https://github.com/user-attachments/assets/ea635cae-b7b9-4ddd-9414-1a5536e4bf12" />

### WEB Enumeration
While enumerating the website, I found some accessible documents. The naming scheme was YYYY-MM-DD-upload.pdf so I decided to brute force and download all available pdf files.

<img width="1563" height="864" alt="01 - naming scheme" src="https://github.com/user-attachments/assets/bb56971f-1623-4f95-9163-98ad94fc8ca5" />

<img width="1636" height="495" alt="02 - pdfs" src="https://github.com/user-attachments/assets/b5d1040f-e8b4-4a9a-a94b-d5d81561ba71" />

### ExifTool
Using the PDF url list, I downloaded all pdf files using WGET. Then using exiftool, I extracted all unique Creator names from metadata to create a user list.

<img width="1068" height="633" alt="03 - got a userList" src="https://github.com/user-attachments/assets/3b5ca191-386b-4ee8-8c11-c640e6db9d52" />

Checking the list with kerbrute showed that all usernames are valid

<img width="1328" height="882" alt="04 - all of them are valid" src="https://github.com/user-attachments/assets/381f956e-61a2-4b4a-8bf1-2373f321a457" />

### Reading PDFs
Reading through PDFs, I found default password is available on one of them. But I could also get it using grep.

<img width="1373" height="474" alt="05 - default password" src="https://github.com/user-attachments/assets/ed9e3f27-3a68-4b81-b80c-2e87f50b9031" />

## Exploitation
### Password Spray
Using the default password and userList, I applied password spray attack and found a valid credential.

<img width="1367" height="324" alt="06 - got it" src="https://github.com/user-attachments/assets/2e9d9d69-1acf-40c7-9c1a-6056bb4d4923" />

### SMB Enumeration
Using the valid credentials, I enumerated smb shares. Users and IT shares were not default ones. So inside the user I got the user flag.

<img width="1654" height="284" alt="07 - smb shares" src="https://github.com/user-attachments/assets/ad372d0a-4eb4-466b-95e0-87cf2791996d" />

<img width="799" height="256" alt="08 - got the user flag" src="https://github.com/user-attachments/assets/ee7c6dac-a8a3-4f1e-b3ea-4ec4258ea08f" />

## Lateral Movement
### ADIDNS Poisoning
Before continuing you can check out [this](https://docs.sysreptor.com/d/ad/insecure-adidns/) post or [this](https://www.thehacker.recipes/ad/movement/mitm-and-coerced-authentications/adidns-spoofing) post to understand ADIDNS Poisoning.

IT Share contained a powershell script which sends authentication request to domains that starts with web in active directory. 

<img width="1565" height="230" alt="09 - script" src="https://github.com/user-attachments/assets/0fa92358-971b-4e6b-b0d3-4babcbf93c55" />

By default all users are allowed to add new record that do not exists yet. So using our user credentials and dnstool, I added a new record.

<img width="1617" height="125" alt="10 - add a record web" src="https://github.com/user-attachments/assets/dce88893-82a6-4e75-ab82-023366de6bf2" />

Now all I had to do was setup a poisoner such as responder and wait for requests. After some time I got the NTLMv2 hash of the user.

<img width="1882" height="291" alt="11 - ted" src="https://github.com/user-attachments/assets/ce172ea2-3077-405d-8405-a922fad76b54" />

Then using hashcat, I was able to crack the hash.

<img width="1884" height="172" alt="12 - got it" src="https://github.com/user-attachments/assets/c2d68b15-a220-4c73-aea4-ba218de592eb" />

## Privilege Escalation
Then using new credentials, I ran bloodhound-python.

<img width="1111" height="414" alt="13 - bloodhound python" src="https://github.com/user-attachments/assets/0750fc31-e2b9-406e-92ab-f56df4c2dff0" />

### Read GMSA Password
Our current user was in ITSupport group which can read GMSA (Group Managed Service Account) passwords. GMSA Passwords are passwords that are rotated every X day.

<img width="1013" height="425" alt="14 - gmsa" src="https://github.com/user-attachments/assets/b1b13e3c-ce53-41af-bc78-06cb9a78589d" />

Using GMSADumper script I got the target users NT Hash.

<img width="1031" height="154" alt="15 - gmsa read" src="https://github.com/user-attachments/assets/edfb718b-b5be-4645-adec-c6a7720ae00e" />

### AllowedToDelegate
The service account hash delegation permissions over DomainController. 

<img width="1382" height="614" alt="16 - delegate" src="https://github.com/user-attachments/assets/0efee11c-7b2e-498d-b2c0-b44193429cef" />

So I used GetST script from impacket to request an Administrator ticket.

<img width="1881" height="201" alt="17 - get admin ticket" src="https://github.com/user-attachments/assets/899c5a08-f5ef-4fa0-a6b2-5097847b4a27" />

Then using psexec.py, I got the system shell.

<img width="1881" height="424" alt="18 - got the admin" src="https://github.com/user-attachments/assets/5fd82b49-c310-405d-9643-a2c1556c28b2" />

## Pwned
The machine was fully compromised.

<img width="807" height="645" alt="pwned" src="https://github.com/user-attachments/assets/f1c5d49a-7ec4-4875-9c7f-18cf474ed4d6" />
