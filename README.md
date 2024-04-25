> [!NOTE]
> This documentation is a work-in-progress

<h1 align="center">
  Shrimpcast
</h1>

<p align="center">
  <img src="https://github.com/shrimpcast/shrimpcast/assets/167498236/d3159e68-60dd-4e8f-a8ca-be0a99a759a1" alt="Logo">
</p>

![Minimalist-Showcase-Project-Presentation](https://github.com/shrimpcast/shrimpcast/assets/167498236/82d0aac8-d1c0-4290-af0d-33cbefa37156)

## Introduction

Shrimpcast is a highly customizable, flexible, battle-tested, fast, and secure self-hosted streaming platform.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Media server](#media-server)
- [Debug](#debug)
- [Usage](#usage)
  - [Getting started](#getting-started)
  - [Configuration](#configuration)
    - [Site](#site)
    - [Chat](#chat)
    - [Stream](#stream)
    - [Poll](#poll)
    - [OBS](#obs)
    - [Theme](#theme)
    - [Notifications](#notifications)
  - [Bans](#bans)
  - [Active users](#active-users)
  - [Auto-mod filters](#auto-mod-filters)
  - [Notify users](#notify-users)
  - [Emotes](#emotes)
  - [Message and user management](#message-and-user-management)
  - [Cloud OBS](#cloud-obs)
  - [Whispers](#whispers)
- [Update](#update)
- [License](#license)

## Features

- **Secure**
- **Strong anti-spam foundations**
- **Fast and lightweight**
- **Flexible and highly customizable**
- **Battle-tested with hundreds of concurrent users**
- **Inbuilt chat poll**
- **Out-of-the-box Cloudflare support**

## Installation

To install Shrimpcast, follow these steps:

> [!IMPORTANT]
> You need a valid domain to run this script, with properly configured DNS records.

> [!NOTE]
> Recommended OS: Ubuntu x64 22.04 LTS

1. On a fresh VPS, run:

   ```bash
   wget -O install.sh https://github.com/shrimpcast/shrimpcast/releases/latest/download/install.sh
   chmod +x install.sh
   ./install.sh -d [YOUR_DOMAIN_NAME]
   ```

   Make sure to replace `[YOUR_DOMAIN_NAME]` with your domain name.

2. (Optional) If you're using Cloudflare as a reverse proxy, run:

   ```bash
   wget -O cloudflare_setup.sh https://github.com/shrimpcast/shrimpcast/releases/latest/download/cloudflare_setup.sh
   chmod +x cloudflare_setup.sh
   ./cloudflare_setup.sh
   ```

   This script will restrict traffic outside Cloudflare and apply a few required configuration tweaks.

And that's it! Shrimpcast should now be up and running. You can now try to access your domain URL. Make sure to save the admin session that was generated during the installation, which you can find at `/root/shrimpcast/setup/GeneratedAdminToken.txt`, or at the end of step 1.

## Media Server

Shrimpcast doesn't come with its own built-in media server; instead, it relies on [srs-stack/5.12.21](https://github.com/ossrs/oryx/releases/tag/v5.12.21).

You can access its panel by visiting {your_domain}:2053.

If you're using Cloudflare, for RTMP broadcast, you'll need to bypass the domain proxy (but don't worry, it's already configured to allow 1935!) and stream directly to the VPS IP (e.g., rtmp://{your_vps_ip}/live/livestream).

### Why [srs-stack/5.12.21](https://github.com/ossrs/oryx/releases/tag/v5.12.21)?

Because it's entirely open-source, supports HTTP-FLV for low-latency streaming, and performs admirably.

### Can I use another media server?

Yes, while Shrimpcast defaults to [srs-stack/5.12.21](https://github.com/ossrs/oryx/releases/tag/v5.12.21), you're free to use any other option, such as:

- [Mediamtx](https://github.com/bluenviron/mediamtx)
- [AntMediaServer](https://github.com/ant-media/Ant-Media-Server)
- etc

Just remember, if you opt for a different media server, you'll need to install and configure it yourself.

Although not recommended, you can even bypass the need for a media server entirely by using services like GCloud Streams.

## Debug

First, clone the repository.
To debug the project, you will need:
- Windows 10 
- Visual Studio 2022
- .NET 8 SDK & runtime
- PostgreSQL

Make sure that your PostgreSQL instance is properly configured.

## Usage

### Getting started

Once you have Shrimpcast up and running, you will need to authenticate as an admin. To do this, use the token saved at `/root/shrimpcast/setup/GeneratedAdminToken.txt`, and follow these instructions:

![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/2c62fc16-0f58-4147-b90b-3daa610642a1)

1. Press the top-left button.
2. Paste the token and submit.

And that's it! You're now authenticated as an admin.

### Configuration

Once you're authenticated as an admin, you will have the following options:

![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/96fc0191-93d0-4a4b-962e-6abf661769ab)

- [Configuration](#configuration)
    - [Site](#site)
    - [Chat](#chat)
    - [Stream](#stream)
    - [Poll](#poll)
    - [OBS](#obs)
    - [Theme](#theme)
    - [Notifications](#notifications)
- [Bans](#bans)
- [Active Users](#active-users)
- [Auto-mod Filters](#auto-mod-filters)
- [Notify Users](#notify-users)
- [Emotes](#emotes)

#### Site
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/05228ef8-30cf-40d0-85d3-056acb9fee85)

- **Block TOR connections**: Will block connections from TOR exit nodes.
- **Max connections per IP**: The maximum number of simultaneous connections by a single IP address.
- **Minimum auto-mod time**: The minimum delay time expressed in milliseconds for the auto-mod.
- **Maximum auto-mod time**: The maximum delay time expressed in milliseconds for the auto-mod.
- **Open site at**: Time at which the site will be opened for users. While the site is closed, users will see a countdown:
  ![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/4da09809-76ca-40dd-ba3f-d655480987f4)
- **Stream title**: The title of both the stream and site.
- **Stream description**: Description to show below the stream title.

#### Chat
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/dead4bd7-d876-488e-a76e-5f25aaae1425)

- **Enable chat:** Determines whether the chat feature is enabled or disabled for users.
- **Max visible messages:** Sets the maximum number of messages visible in the chat interface.
- **Message age limit (mins):** Specifies the age threshold of messages to display in the chat.
- **Required time for new users (mins):** Sets the minimum time (in minutes) that new users must wait before being allowed to send messages.
- **Cooldown between messages:** Specifies the time interval users must wait between sending consecutive messages, in seconds.
- **Mute time in minutes:** Determines the duration for which a user is muted after violating chat rules.
- **Default name for new users:** Sets the default username assigned to new users.

#### Stream
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/c136b625-db4f-4798-b290-5c7528484011)
- **Enable stream:** Shows or hides the player.
- **Use primary source:** Specifies whether to use the primary source for the stream. Fallbacks to the secondary source if disabled.
- **Use native player:** Determines whether to use the browser's native player for streaming.
- **Treat URL as embed:** Dictates whether to treat URLs as embedded content for streaming purposes.
- **Primary stream URL:** Specifies the primary URL source for streaming content.
- **Secondary stream URL:** Provides an alternative URL source for streaming content if the primary source is unavailable.

#### Poll
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/f7743eaf-b4ff-4021-b46b-d4e27ae34c6f)
- **Show poll:** Controls the visibility of the poll.
- **Accept new options:** Determines whether new options can be added to an existing poll.
- **Accept new votes:** Specifies whether new votes are allowed after a poll has started.
- **Minimum sent to participate:** Sets the minimum number of messages a user must have sent to participate in a poll.
- **Poll title:** Specifies the title or topic of the poll being conducted.

#### OBS
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/8d626329-df9d-4caa-81df-056ff2d2b48b)
> [!TIP]
> You don't need any of these configurations unless you're using a cloud OBS instance and you want to control it remotely. If you're going to use them, make sure that your OBS has WebSockets enabled and is accepting incoming connections. See more on [cloud OBS](#cloud-obs)
- **Host:** Specifies the host for OBS connection. Format: (ws://[IP]:4455)
- **Password:** Provides the password required for authentication when connecting to OBS.
- **Main scene:** Specifies the main scene to be displayed in the OBS interface.
- **Main source:** Specifies the main video source to be displayed within the main scene.
- **Kino source:** Specifies the video source to be displayed in the "Kino" scene.
- **Music source:** Specifies the audio source to be optionally played during the broadcast.

#### Theme
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/908360b0-3a7d-4d27-94e2-6c6474cfd549)
- **Enable fireworks:** Enables or disables the display of fireworks animations.
- **Enable Christmas theme:** Activates or deactivates the Christmas theme.
- **Christmas theme snowflake count:** Specifies the number of snowflakes displayed as part of the Christmas theme.

#### Notifications
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/2449c7b8-f09a-4a7f-ad4e-c7447735aa46)
> [!CAUTION]
> Do not change these values unless you know what you're doing.
- **VAPID Public Key:** Specifies the public key for VAPID authentication.
- **VAPID Private Key:** Specifies the private key for VAPID authentication.
- **VAPID Mail:** Provides the email address associated with VAPID authentication.

### Bans
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/c4066618-ae54-4930-ae06-7a773d339872)

Shows the list of banned users. Use the button on the right to unban the user.

### Active users
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/13d5e33d-121e-4f16-b243-778017587cfb)

Show the list of active users. Use the button on the right to display their information.

### Auto-mod filters
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/43fdfdd5-da5c-46fd-9d5c-9bcebd777f92)

Shows the list of active auto-mod filters. Use the button on the right to remove them.

### Notify users
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/cfd0c047-277f-4fce-b399-6356e165392c)

Shows a dialog asking whether to notify the subscribed users that the stream has started.

### Emotes
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/fb6d898c-a218-420c-96e0-d86ae10c205b)

Shows the list of active emotes. To add a new emote, click on "ADD". Keep in mind that the size can't be greater than 36x36.

### Message and user management
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/3f3f9780-c7e4-4106-a9e4-1ba28fa3cda8)

While authenticated as an admin, hover over a message and you will have the options to:
1. Remove the message (by clicking on the remove button)
   
   ![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/7e718ae2-ed98-43e7-bd64-261e7383d030)
   
2. Manage the user (by clicking on the user button)
   
   ![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/40b26c11-177b-4199-a699-37789bdcf49a)

   The following moderation options will be available:
   - **Mute**: mutes the user for the amount of time dettermined in the chat [configuration](#chat)
   - **Ban**: Bans the user and displays a public chat message indicating that the user has been removed from chat.
     >Caution: when issuing a ban, all IPs associated with the user will be blocked.  
   - **Silent ban**: Bans the user without notifying the chat.
   - **Silent ban and delete**: Issues a ban and removes the user messages without notifying the chat.
   - **Filter and ban**: Same as **Silent ban and delete**, but also adds the message to the auto-mod filters
> [!WARNING]
> The auto-mod tool isn't intended for censorhip but to ease the removal of spam. Note that adding a filter will result in any user whose message contains the filter being banned.

### Cloud OBS

If you're utilizing a cloud OBS instance, manage it effortlessly through chat commands:

- `!playmain [URL?]`
- `!playkino [URL?]`
- `!playmusic [URL?]`

### Whispers

Admins can securely send private messages to users using the following chat command:

- `!ping [SessionId] [Message]`

Retrieve the SessionId from the [Message and User Management](#message-and-user-management) section.

## Update
If you want to update to the latest version of shrimpcast, you can do so by running
   ```bash
   wget -O update.sh https://github.com/shrimpcast/shrimpcast/releases/latest/download/update.sh
   chmod +x update.sh
   ./update.sh -d [YOUR_DOMAIN_NAME]
   ```
   Make sure to replace `[YOUR_DOMAIN_NAME]` with your domain name.

## License

This project is licensed under the [GNU License](LICENSE).
