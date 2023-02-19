I have done first two parts of the test which are mendatory i. e 
1. Auth Functionality
2. Read and Update operations on units

Here "index.html" file is the entry point for the website. To see the details you have to login. You cann't directly access the "Dashboard.html" file, you have to login again.

Base url used in this i.e "https://test.indusgame.com" is kept inside "Constants.js" file as "BASE_URL" which is used across the website.

1. Auth Functionality :- To login you have to enter the username as "mousumi.malik" and password "9H6r6dDnJrXGRGWfICudldywaKCZCbEZ".

Three endpoinds used in the login functionality are "POST /logins" which is used to log into the website, "POST /auths" used to access "refreshToken" which will give "accessToken" and "AUTH POST /logouts" which is used to logout from the website.

Validation provided for the username are - the username has 5 to 20 lowercase ASCII letters with at maximum one period (.) anywhere but as the first or last character. At maximum, the username can have 20 characters.

Validation provided for the password are - the password is between 10 and 64 characters long.

The validation functionalities are provided in the "script.js" file.

When login you'll redirect to "Dashboard.html" file where you'll see the user informations. There is also a logout button which will redirect to login page again.

2. Read and Update operations on units :- When you click on the edit icon you'll redirected to a page where editable units will be - quality, health, attack, maxTargetCount, spawnCost, spawnCooldownInSeconds. 

The validation provided for the "quality" are - must be one of "Common", "Rare", and "Epic".
The validation provided for the "health" are - must be an integer between 5 and 10k, must be divisible by 5.
The validation provided for the "attack" are - must be an integer between 5 and 500, must be divisible by 5.
The validation provided for the "maxTargetCount" are - must be an integer between 1 and 100.
The validation provided for the "spawnCost" are - must be an integer between 0 and 1000, must be divisible by 5.
The validation provided for the "spawnCooldownInSeconds" are - must be between 0 and 100, can have upto 1 decimal place.

The validation functionalities are provided in the "Update.js" file.

Api call is handled in "WebServiceCall.js"

In "Utils.js" file, utilites functionality are handled like error handeling etc...
