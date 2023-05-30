![GitHub watchers](https://img.shields.io/github/watchers/xenoncolt/docker-stats?style=for-the-badge)  ![GitHub Repo stars](https://img.shields.io/github/stars/xenoncolt/docker-stats?style=for-the-badge) ![GitHub last commit](https://img.shields.io/github/last-commit/xenoncolt/docker-stats?style=for-the-badge)


# Preview
![Docker Stats Preview](https://cdn.discordapp.com/attachments/832180255103385650/1113222019539017728/image.png)


# Installation Guide
## Requirements

- [Docker](https://www.docker.com/)
- [NodeJS](https://nodejs.org/en)
- [Discord Bot](https://discord.com/developers/applications)


## Setup

1. Clone the repository:
    ``` 
    git clone https://github.com/xenoncolt/docker-stats.git
    ```
2. Install the dependencies:
    ```
    npm install
    ```
3. Rename the `example.env` file to `.env`:
    ```js
    TOKEN=YOUR_TOKEN_GOES_HERE
    ```
4. Replace the Token with valid Token. You can get your discord bot token from [Discord Developer Portal](https://discord.com/developers/applications)
5. Rename the `example.config.json` file to `config.json`
   ```js
   {
    "dockerSockPath": "path/file/docker.sock",
    "channelId": "CHANNEL_ID"
   }
   ```
6. Replace the Channel ID with the ID of the channel you want the bot to post stats to. And also replace your `docker.sock` file path. If you don't know where is your `docker.sock` file then follow #

7. Start the bot:
   ```
   node .
   ```


# Docker Sock
### Default path
You can check if there exist or not by running this cmd in terminal:
- On Linux:
    ```
    ls -l $HOME/.docker/desktop/docker.sock
    ```
- On Windows:
    ```
    ls -l C:\ProgramData\docker\docker.sock
    ```
### Search File Path
If the file don't exist there then search the file using this cmd
- On Linux:
  ```
  sudo find / -type s -name "docker.sock"
  ```
- On Windows:
  ```
  dir /s docker.sock
  ```
Now copy the path and replace in `config.json` with `/path/file/docker.sock`
### Contributing
<details>
<summary>Click to expand</summary>

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
Please make sure to update tests as appropriate.
</details>

### License
<details>
<summary>Click to expand</summary>

[MIT](https://choosealicense.com/licenses/mit/)
</details>

### Contact
<details>
<summary>Click to expand</summary>

If you have any questions, comments, or concerns, please contact me on Discord: `Xenon Colt#8969`
</details>

### Acknowledgements
<details>
<summary>Click to expand</summary>


- [Discord.js](https://discord.js.org/)

- [Docker Stats](https://docs.docker.com/engine/reference/commandline/stats/)

