# Juicy Bar CTF - Tools and APIs
In this post, we’ll walk through the solutions for all Tools and APIs solutions.

## Captain's Log
#### 1 - Description

![00 - Description](https://github.com/user-attachments/assets/f605a0d7-7da5-48b7-a069-cf369337b032)

#### 2 - Obtaining Flag
The first question was the easiest. Logging was left enabled, so when I opened the activity, I could see the flag directly in Logcat.

![01 - Logs](https://github.com/user-attachments/assets/05ed3a25-e760-497c-ae16-076b33a3f039)

![02 - Lesson Learned](https://github.com/user-attachments/assets/43d982cf-5076-4fa0-a08f-7113e672b474)

## Time Travel
#### 1 - Description

![00 - Description](https://github.com/user-attachments/assets/625fb889-e98e-4977-8348-843c051896c5)

#### 2 - Obtaining Flag
The Time Travel challenge requires us to change the device's date and time. By reversing the APK using JADX, we can find the expected timestamp. Once we set the correct date and time, the flag is revealed.

![01 - Function](https://github.com/user-attachments/assets/57cce53e-b44f-49f9-9d25-10e853622bf1)

![02 - root shell and update date](https://github.com/user-attachments/assets/e21beee6-100a-4d2d-ae3c-bb9697dad449)

![3- lesson learned](https://github.com/user-attachments/assets/905f9460-e04b-47a2-b85e-2bba929a9a45)


## Export Duty
#### 1 - Description

![00 - Description](https://github.com/user-attachments/assets/83b02d59-f861-424e-9734-b5f19dccd490)

#### 2 - Obtaining Flag
The Export Duty challenge was straightforward, we just needed to call the exported target activity to retrieve the flag.

![01 - Exported ](https://github.com/user-attachments/assets/d3769d42-ed34-4f12-8ea9-3b2076904d63)

![02 - Code](https://github.com/user-attachments/assets/0ab2f209-6439-4f98-b533-fc2f2e52e40b)

![03 - Lesson Learned](https://github.com/user-attachments/assets/8bcdba90-a7a5-44c9-bdf7-286291923816)

## Content Providers
#### 1 - Description

![00 - Description](https://github.com/user-attachments/assets/5cd32b1f-b290-497c-8dd0-bd166177a851)

To query the content provider, we first needed to add the appropriate <queries> element to the AndroidManifest.xml. Once that was done, we could query the provider and retrieve the flag.

![01 - add Query](https://github.com/user-attachments/assets/1eed83d7-57d1-4e5b-a53b-72a36a1cc2d9)

#### 2 - Obtaining 1st Flag
The first flag in the Content Providers challenge was easy to obtain—simply querying the provider was enough to retrieve it.

![02 - Provider](https://github.com/user-attachments/assets/34f7beb5-15f3-4164-b0ab-b36a92eb674e)

![06 - FLAG without PATH](https://github.com/user-attachments/assets/9f721253-657f-4c65-a7b3-712c39367dc6)

![07 - Lesson Learned](https://github.com/user-attachments/assets/5cb28794-ae95-4fa6-a5ce-57aeba974d4a)

#### 3 - Obtaining 2nd Flag
The second flag was protected by path permissions, so I slightly modified the code to bypass the restriction and successfully retrieved the flag.

![03 - FLAG uses permission](https://github.com/user-attachments/assets/0d0aab3e-29ef-493f-8f33-8b645f0d9437)

![04 - get The Flag](https://github.com/user-attachments/assets/14bd680e-0111-41fb-935f-337dff8db10f)

![05 - Lesson Learned](https://github.com/user-attachments/assets/99276ffa-d570-4838-970b-a5eb309454c0)


#### 4 - Obtaining 3rd Flag
The third flag involved hijacking a content provider. I wrote a script to mimic the provider, and when the target attempted to insert the flag, my script successfully captured it.

![08 - External Provider](https://github.com/user-attachments/assets/a756dc5a-97ee-415b-8723-75258ed0e81c)

![08 - Tries to reach provider](https://github.com/user-attachments/assets/d72d2c90-5608-49f7-bc71-57647c00482e)

![09 - Code](https://github.com/user-attachments/assets/4b2738f5-572e-4f03-b78a-576fa6e70066)

![10 - GG](https://github.com/user-attachments/assets/2b23b0f6-17f4-4981-9ad2-610f8b61ffa4)

![11 - Lesson Learned](https://github.com/user-attachments/assets/d3c99319-32f0-4a2e-a422-e19ebae2dbf1)


## Juicy Broadcasts
#### 1 - Description

![00 - Description](https://github.com/user-attachments/assets/a719114c-27a7-456d-b296-2ac320c3272d)

![00 - manifest](https://github.com/user-attachments/assets/ba559319-9b94-4ab4-bb94-48d7e8718775)


#### 2 - Obtaining 1st Flag
The first Broadcast Receivers challenge was straightforward: set the correct action and data, send the broadcast, and receive the flag.

![01 - code part](https://github.com/user-attachments/assets/9cdbe37f-f43f-46d2-b1b2-5ec1965e2f01)

![02 - First Flag](https://github.com/user-attachments/assets/99c070be-2fb8-4122-9211-510be198efc2)

![03 - Lesson Learned](https://github.com/user-attachments/assets/94a18aaa-7a73-419a-bc43-7601a50a3c95)

#### 3 - Obtaining 2nd Flag
The second challenge was a bit trickier. It required sending an sendOrderedBroadcast with resultExtras that included a Boolean value.

![04 - code part](https://github.com/user-attachments/assets/719ea00c-16a0-4208-bae8-8cb3bd6de87f)

![05 - Second Flag](https://github.com/user-attachments/assets/63a42a8d-1f71-427a-a4c6-9c924f64b9e9)

![06 - Lesson Learned](https://github.com/user-attachments/assets/ab536cc8-72e4-40e1-819a-a677e6412fc5)

#### 4 - Obtaining 3rd Flag
The third flag was obtained by creating a fake receiver with the intended action, which allowed me to capture the flag.

![07 - code part](https://github.com/user-attachments/assets/750725b8-2372-442f-b7b8-568f10d8afa7)

![08 - Flag](https://github.com/user-attachments/assets/0eeafd31-ba3d-4797-ab30-edb84f7527f1)

![09 - Lesson Learned](https://github.com/user-attachments/assets/ba0736f8-20e7-4fa9-af3b-a0e5f1cabf54)

## At Your Service
#### 1 - Description
![00 - Description](https://github.com/user-attachments/assets/b442d282-1bc6-4593-9955-23631c867a32)

![00 - Manifest](https://github.com/user-attachments/assets/142cc731-779f-4276-bd70-2f4c8facc2c3)

#### 2 - Obtaining 1st Flag
The first Service challenge was tough. I created a message handler and sent a message with the specific what value to get the flag.

![00 - Code Parts](https://github.com/user-attachments/assets/6850b40f-b1ed-4351-b275-1170b609d894)

![02 - Flag](https://github.com/user-attachments/assets/dd74fa3e-0345-410e-b7ff-f0a265c0689c)

![03 - Lesson learned](https://github.com/user-attachments/assets/14fc6cc2-c83f-41e3-bed8-ecb1e5c1f376)

#### 3 - Obtaining 2nd Flag
The second challenge was even harder. I set the replyTo value to receive a response from the target’s message handler and extracted the flag from the extra data.

![04 - Flag](https://github.com/user-attachments/assets/add015e3-c11d-4044-9517-d74504228593)

![05 - Lesson Learned](https://github.com/user-attachments/assets/64091139-9d66-4e0d-8d14-c6fc4029bf39)

## Sign Here
#### 1 - Description

![00 - Description](https://github.com/user-attachments/assets/43f7094d-e9fb-47e8-a2ca-8f6ae4685d2c)

#### 2 - Obtaining Flag
The Sign Here challenge was very difficult. When I tried to access the content provider, I got an error saying I needed to sign the app with the correct key. After checking the hints, I discovered the APK was signed with a test key commonly found on AOSP. I then exported the APK, re-signed it using apksigner with the test keys, and was finally able to access the provider and retrieve the flag.

![01 - Sign](https://github.com/user-attachments/assets/d46a56f0-d02d-4e2f-802d-ce04fe9043f0)

![02 - APK Signer](https://github.com/user-attachments/assets/dca75cff-a980-42cd-9bb6-c464420a60e9)

![03 - Lessons Learned](https://github.com/user-attachments/assets/07d190f9-5ce7-4b13-af48-add584605539)

## Data Exfiltration
#### 1 - Description
![00 - Description](https://github.com/user-attachments/assets/14af4fa9-7e67-4e51-a502-77351597a0c7)

#### 2 - Obtaining Flag
The final challenge, Data Exfiltration, was the hardest. The app had a "Share File" feature that launched a file picker, listing applications like the Gallery. To exploit this, I needed to fake a file picker and trick the app into reading a sensitive file.
I defined a custom activity in my manifest to act as a file picker:

![01 - Faking a File Picker Activity](https://github.com/user-attachments/assets/053b7ba0-fabf-431d-a33a-2625a8ca556b)

Then, in PickerActivity, I crafted a fake URI pointing to the target file:

![02 - Fake a file selection](https://github.com/user-attachments/assets/7c7eac39-abf6-4fee-a4cb-075084eb0841)

When I selected my app from the file picker list, it returned the malicious URI. The vulnerable app then attempted to read the file at that location—revealing the flag.

![03 - Share a file](https://github.com/user-attachments/assets/b520499a-403d-4665-a1ee-9d146cb6be83)

![04 - fake](https://github.com/user-attachments/assets/30a00da6-8c97-4eb8-8c6d-c5aa46bf9612)

![05 - result](https://github.com/user-attachments/assets/529ec199-b20c-46eb-a06f-60e06726ef22)

![06 - Lessons Learned](https://github.com/user-attachments/assets/217081fb-bcda-4c22-ac70-e1ac926455a1)


