# TombWatcher - Hack The Box

## Enumeration
### Initial Credentials
At the start of the pentest an unprivileged user credential is given, as in every Active Directory test.

<img width="935" height="73" alt="00 - initial" src="https://github.com/user-attachments/assets/c58cbfbd-8d7d-43e5-b3eb-4a737682a8f7" />

### Nmap 
Initial nmap scan revealed common ports for Active Directory.

<img width="1201" height="708" alt="01 - nmap" src="https://github.com/user-attachments/assets/e7fe48f6-685b-4630-9d02-2cbdaab6eff7" />

### SMB Enumeration
The user could login via SMB and read IPC$ Share.

<img width="1327" height="214" alt="02 - shares" src="https://github.com/user-attachments/assets/a7e12786-16b2-443f-9dca-5a9b4e2d3f05" />

So I applied RID Brute forcing and created a user list.

<img width="1401" height="568" alt="03 - userList" src="https://github.com/user-attachments/assets/48977289-5cef-41a8-bce9-f2327f7cfaf8" />

### BloodHound
Later I ran bloodhound python for further enumeration.

<img width="1179" height="355" alt="04 - bloodhound" src="https://github.com/user-attachments/assets/79609521-7e49-4491-99c4-817ac37368e7" />

## Exploitation
From now on, there will be many lateral movements. I will explain them step by step.

### WriteSPN
The initial user had writeSPN privileges over alfred. I used [targetedKerberoast](https://github.com/ShutdownRepo/targetedKerberoast) tool to obtain his ticket.

<img width="818" height="337" alt="05 - writespn" src="https://github.com/user-attachments/assets/074e99a3-3ded-48f4-b1ab-e097d9a32df6" />

<img width="1653" height="335" alt="06 - alfred ticket" src="https://github.com/user-attachments/assets/ff92092e-4e1c-4991-8219-db0deba123e8" />

Then used hashcat to crack it.

<img width="1648" height="250" alt="07 - cracked" src="https://github.com/user-attachments/assets/6bf8fa1c-de32-470d-9948-ed093c30dbc9" />

### AddSelf
The alfred user could add himself to Infrastructure group.

<img width="857" height="387" alt="08 - addself" src="https://github.com/user-attachments/assets/c281cc33-54b9-4ac4-9387-7b350c6bf1e7" />

I used [bloodyAD](https://github.com/CravateRouge/bloodyAD) tool to add him to the group.

<img width="1051" height="171" alt="09 - added alfred" src="https://github.com/user-attachments/assets/2d581706-84b5-4dc9-9c99-718b100d8431" />

### ReadGMSAPassword
The Infrastructure group had privileges to read GMSAPassword of the ansible_dev$.

<img width="662" height="178" alt="10 - readgmsa" src="https://github.com/user-attachments/assets/184a4c0e-c543-4dae-b0dc-5f8bf8531ede" />

I used netexec's gmsa module to read the password hash.

<img width="1389" height="116" alt="11 - gmsa read password" src="https://github.com/user-attachments/assets/e94dd8a1-731f-4cb4-8d56-8e8227de2f3e" />

### Force Change Password
ansible_dev$ account had ForceChangePassword privileges over sam.

<img width="705" height="314" alt="12 - force change password" src="https://github.com/user-attachments/assets/dc6d5aec-f88e-4e1e-9677-7dc3640f5819" />

I used pth-net rpc to change the password. Because I only have password hash of the ansible_dev$.

<img width="1424" height="180" alt="13 - change" src="https://github.com/user-attachments/assets/3761c57b-d8b8-4663-a9b3-2ec164d7e42c" />

### WriteOwner
The sam was writeowner of the john.

<img width="1079" height="369" alt="14 - writeowner" src="https://github.com/user-attachments/assets/5eead340-520c-49db-a163-a00c7c0ddbf7" />

So using sam, I gained full privileges over John and changed his password.

<img width="1330" height="425" alt="15 - got john" src="https://github.com/user-attachments/assets/7eadc00f-2471-43e5-afb6-081f1f54b975" />

### User Flag
The john could PSRemote. So, I got the user flag.

<img width="1081" height="432" alt="16 - user flag" src="https://github.com/user-attachments/assets/1d426b7f-42e8-498f-9dc0-efac005569e3" />

## Privilege Escalation
The John had GenericAll privileges over ADCS OU, but that OU had no members.

<img width="995" height="387" alt="17 - generic all adcs ou" src="https://github.com/user-attachments/assets/37f78b86-d8cf-4ab5-a285-468501ed4bfb" />

### Enumerating Certificates
I enumerated certificates using certipy-ad and could not find any vulnerable certificates. Then enumearted all templates and found that an SID with no name had object control over WebServer template.

<img width="887" height="562" alt="19 - a template include interesting sid" src="https://github.com/user-attachments/assets/220e41de-11df-4917-9632-c092de97c8d9" />

### Recovering Deleted AD Object
At first, I checked if the object was deleted. I ran command from [this](https://github.com/ivanversluis/pentest-hacktricks/blob/master/windows/active-directory-methodology/privileged-accounts-and-token-privileges.md) github repo.

<img width="1527" height="689" alt="20 - deleted object" src="https://github.com/user-attachments/assets/10e5bf99-aeb7-43c7-a042-b36425225a45" />

Object was deleted and it was cert_admin user. I found [this](https://specopssoft.com/blog/recover-deleted-active-directory-object/) post and used commands from there to recover the object.

<img width="926" height="444" alt="21 - restored it" src="https://github.com/user-attachments/assets/dcbe8321-3174-41d3-a503-8bfef34c9370" />

Then ran bloodhound again and found it was in ADCS OU.

<img width="760" height="310" alt="22 - it is in OU" src="https://github.com/user-attachments/assets/271fccd6-bcab-426a-893b-cab48d5e740b" />

So as john I can simply change its password.

<img width="1422" height="270" alt="23 - updated password for cert_admin" src="https://github.com/user-attachments/assets/0e64c8c4-24d8-4a76-b523-709500406bb1" />

### ADCS - ESC15
Then I ran certipy-ad again using cert_admin credentials.

<img width="454" height="102" alt="24 - ran certipy" src="https://github.com/user-attachments/assets/2ddd2813-e96c-4e68-a15a-56d7bc2e5e08" />

The WebServer template was vulnerable to ESC15.

<img width="1260" height="684" alt="25 - vulnerable" src="https://github.com/user-attachments/assets/b98c1945-dc85-4a16-9125-ac49d38f773b" />

So I opened [official wiki](https://github.com/ly4k/Certipy/wiki/06-%E2%80%90-Privilege-Escalation) of certipy. First, I tried the method a and it did not work. Then tried method B and got the administrator hash.

<img width="801" height="313" alt="26 - pfx" src="https://github.com/user-attachments/assets/78cc456a-1ae6-43f1-84df-71db00e1518a" />

<img width="953" height="304" alt="27 - pfx2" src="https://github.com/user-attachments/assets/d0fff42a-8c2c-4cf8-8f9b-f6e5be94c9c6" />

<img width="960" height="244" alt="28 - hash" src="https://github.com/user-attachments/assets/eab5352a-abb5-4fcd-8cc6-3118c4212c3a" />

### Root Flag
We got the root.

<img width="1079" height="249" alt="29 - got root" src="https://github.com/user-attachments/assets/0f72552a-aee3-4bf2-bd1e-880b5371e0e3" />

## Pwned
Easy, peasy

<img width="746" height="713" alt="30 - pwned it" src="https://github.com/user-attachments/assets/ae94fa2d-319d-45b2-9590-21f63bc433fc" />
