# Juicy Bar CTF - Static Code Analysis

![000 - Startingg](https://github.com/user-attachments/assets/80204a9e-6ac4-4e5e-847a-e298d6059d00)

In this post, we’ll walk through the solutions for all four static analysis challenges.



## Code Obfuscation
#### 1 - Description

![00 - Description](https://github.com/user-attachments/assets/3633cc6e-ecdc-4ea5-830a-fdfb92e1e011)

#### 2 - Obtaining 1st Flag
Since this was a static code analysis level, I used JADX to reverse engineer the APK file. After decompiling the code, I focused on the "Code Obfuscation" level. This section contained many functions, but one function named g() stood out as it appeared to contain a suspicious secret. I extracted the secret and used it for validation, which successfully worked and revealed the first flag.

![01 - G Function](https://github.com/user-attachments/assets/1b125af0-71ef-4927-bb5e-e080d32d6405)

![04 - Lesson Learned](https://github.com/user-attachments/assets/3eb8bc9d-d29d-4dae-b7dd-9c47e9f13a31)

#### 3 - Obtaining 2nd Flag
The second flag was found using a similar approach. Inside the JuicyDataClass class, I noticed a suspicious string that stood out from the rest of the code. I used this string for validation, and it successfully revealed the second flag.

![05 - toString](https://github.com/user-attachments/assets/cf49c1ae-cb36-427b-bda8-4bbefef6a79d)

![08 - lessons learned](https://github.com/user-attachments/assets/5bb5a8c2-099c-4a2d-a174-822d0404a4e8)

## Hardcoded Secrets
#### 1 - Description

![00 - Description](https://github.com/user-attachments/assets/5e136ca9-3fde-460b-bb9e-c270db7fbacb)

#### 2 - Obtaining 1st Flag

In the "Hardcoded Secrets" level, the first flag was obtained by simply decoding a Base64-encoded string found inside a function, which revealed the secret.

![01 - BASE64 val](https://github.com/user-attachments/assets/a51e0adc-64ae-47da-a58b-7c78fbd684e6)

![02 - Decode and got secret](https://github.com/user-attachments/assets/cab33cbd-79b2-4ca2-8722-52f15458513f)

![05 - Lessons Learned](https://github.com/user-attachments/assets/aded6859-1e83-4d85-9b8a-985531eb41a1)


#### 3 - Obtaining 2nd Flag 
The second secret was found in the strings.xml file, where a hardcoded API key was stored.

![06 - Strings xml API key](https://github.com/user-attachments/assets/97c650ad-1461-4fa8-8366-3323aa8f0162)

![09 - LessonLearned](https://github.com/user-attachments/assets/d3895f40-71c3-421e-97ac-189a9dbee363)

#### 4 - Obtaining 3rd Flag 

The third secret was a PEM file located inside the app’s resources.

![10 - private key](https://github.com/user-attachments/assets/41ac36e5-d7f5-4e32-9d92-74e61837d21f)

![11 - Lesson Learned](https://github.com/user-attachments/assets/204f7a1e-fd91-490f-b126-584b8b84e825)

## Reverse Engineering
#### 1 - Description

![00 - Description](https://github.com/user-attachments/assets/c15cff4d-d70c-4c93-8f2f-cc501eaf231a)

#### 2 - Obtaining 1st Flag
In the "Reverse Engineering" challenge, there were four flags hidden across four functions named like flagOneValid(), flagTwoValid(), and so on. The first flag was straightforward—it was simply a Base64-encoded string that, once decoded, revealed the flag.

![01 - Flag1 base64](https://github.com/user-attachments/assets/f12a7dd6-83b5-4ed3-bed1-256a9a41a750)

![02 - Flag1 b64 decode](https://github.com/user-attachments/assets/c8b49760-dbcd-48a3-81c4-066bc8708f7c)

![03  - Lesson Learned](https://github.com/user-attachments/assets/330172e1-a0bc-4a6e-b4f5-34ee1fa3c9e0)

#### 3 - Obtaining 2nd Flag

The second secret resembled Morse code, containing patterns like ..-- and ...-. Each group of four characters represented a single lowercase alphabet letter. To decode it, I wrote a Python script that mapped each 4-character pattern to its corresponding letter. Running the script successfully revealed the second secret.

![04 - Flag2 morse encoding](https://github.com/user-attachments/assets/da2889e9-9af7-4100-bb9d-0e64c27fbfba)

![05 - Decoder](https://github.com/user-attachments/assets/4c61baee-c9f6-4c23-8bef-627a6383dcdb)

![06 - decoded secret](https://github.com/user-attachments/assets/0b04bbdc-4d91-4b5b-a3e2-c347943c8c2e)

![07 - Lesson Learned](https://github.com/user-attachments/assets/424e15f7-f33c-42cb-9767-a87958c496f6)

#### 4 - Obtaining 3rd Flag
The function containing the third flag was working with a string that resembled a Bash script at first glance. However, it applied a transformation that stripped all characters except whitespace, tabs (\t), and newlines (\n). It then replaced \n with n, \t with t, and spaces with s. After some research, I realized this was likely Whitespace programming language code. I used a Python script to extract the Whitespace characters into a file, then ran it through an online Whitespace interpreter. This successfully compiled the code and revealed the third flag.

![08 - flag3 data](https://github.com/user-attachments/assets/377410b1-f13f-4e6d-bc1c-49071105b493)

![9 - python to extract ws](https://github.com/user-attachments/assets/2e017809-e302-450c-9345-a6b326e3543d)

![10 - secret](https://github.com/user-attachments/assets/01072309-7c7e-4a4f-8186-20460a65d3a5)

![11 - lessons learned](https://github.com/user-attachments/assets/615ea450-112a-4433-a1f9-813e069155af)

#### 5 - Obtaining 4th Flag

The fourth flag in this challenge was the most difficult. It involved a file named dexterity, which was AES-encrypted. After analyzing the related function in the app, I extracted the encrypted file and wrote a Python script to decrypt it. The output turned out to be a DEX file. I then opened the DEX file in JADX and located a relevant function. To retrieve the secret, I wrote another Python script to generate a valid input for that function, which ultimately returned the fourth flag.

![12 - dexterity](https://github.com/user-attachments/assets/ea8f5ea0-f4b5-4286-b8dd-a0b963fb5c32)

![13 - decrypt dexteriry](https://github.com/user-attachments/assets/6870b71b-cd62-4547-811e-6d558a58dcae)

![14 - decrypted dex](https://github.com/user-attachments/assets/efb1fb6f-1d24-4bc2-94db-fe63562137d1)

![15 - secrets](https://github.com/user-attachments/assets/e049dcd1-8aac-4565-9f20-415e77326f32)

![16 - lesson learned](https://github.com/user-attachments/assets/378f57d8-6362-4e6e-a6ec-85d6ede0dc4c)


## Bad Hash
#### 1 - Description

![00 - Description](https://github.com/user-attachments/assets/fc3bf0aa-5f92-498b-ab64-1ed06cd8c3e3)

#### 2 - Obtaining 1st Flag
The "Bad Hash" challenge was the easiest for me. I used CrackStation to reverse the first hashed secret. The result included a 123 suffix that was concatenated to the original value. After removing 123, I obtained the actual secret.

![01 - first secret](https://github.com/user-attachments/assets/ed60ab01-73fa-470a-a232-220b0d12631f)

![02 - lesson learned](https://github.com/user-attachments/assets/e50df5ce-d7a1-4c09-b10b-428b7af72f1e)


#### 3 - Obtaining 2nd Flag
The second flag used a CRC32 hash of a 4-character string. To solve it, I wrote a Python script to brute-force all possible 4-character combinations and compare their CRC32 values with the target hash. This approach successfully revealed the correct string and the second flag.

![03 - flag2](https://github.com/user-attachments/assets/356dde50-1fd9-49ea-b4c2-65fa6275c035)

![04 - secret2](https://github.com/user-attachments/assets/1268379a-d6ea-4644-bf20-f82ee9085723)

![05 - lesson learned](https://github.com/user-attachments/assets/2f8f0962-0cbf-4df7-be26-bc0eebffb79a)






