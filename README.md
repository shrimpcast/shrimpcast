<h1 align="center">
  Shrimpcast
</h1>

<p align="center">
  <img src="https://github.com/shrimpcast/shrimpcast/assets/167498236/d3159e68-60dd-4e8f-a8ca-be0a99a759a1" alt="Logo">
</p>

![Minimalist-Showcase-Project-Presentation](https://github.com/user-attachments/assets/2c0ad070-7c52-4609-a4e7-e36ef3008d2b)

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
    - [Tor & VPNs](#tor-and-vpns)
    - [Bingo](#bingo)
    - [OBS](#obs)
    - [Theme](#theme)
    - [Notifications](#notifications)
    - [Golden pass](#golden-pass)
  - [Active Users](#active-users)
  - [Bans](#bans)
  - [Mutes](#mutes)
  - [Auto-mod filters](#auto-mod-filters)
  - [Moderators](#moderators)
  - [Notify users](#notify-users)
  - [Emotes](#emotes)
  - [Bingo options](#bingo)
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

![image](https://github.com/user-attachments/assets/32a73635-45bf-4b7a-bcdf-272c20ea8668)
  - [Configuration](#configuration)
    - [Site](#site)
    - [Chat](#chat)
    - [Stream](#stream)
    - [Poll](#poll)
    - [Tor & VPNs](#tor-and-vpns)
    - [Bingo](#bingo)
    - [OBS](#obs)
    - [Theme](#theme)
    - [Notifications](#notifications)
    - [Golden pass](#golden-pass)
  - [Active Users](#active-users)
  - [Bans](#bans)
  - [Mutes](#mutes)
  - [Auto-mod filters](#auto-mod-filters)
  - [Moderators](#moderators)
  - [Notify users](#notify-users)
  - [Emotes](#emotes)
  - [Bingo options](#bingo)

#### Site
![image](https://github.com/user-attachments/assets/acf1196d-28b5-43c8-8305-dc557b46a4e4)

- **Hide stream title**: Hides the stream title that would otherwise show below the player.
- **Max connections per IP**: The maximum number of simultaneous connections by a single IP address.
- **Minimum auto-mod time**: The minimum delay time expressed in milliseconds for the auto-mod.
- **Maximum auto-mod time**: The maximum delay time expressed in milliseconds for the auto-mod.
- **Open site at**: Time at which the site will be opened for users. While the site is closed, users will see a countdown:
  ![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/4da09809-76ca-40dd-ba3f-d655480987f4)
- **Stream title**: The title of both the stream and site.
- **Stream description**: Description to show below the stream title.

#### Chat
![image](https://github.com/user-attachments/assets/9e127ae7-33cf-4288-a3d1-d5df95cf25b4)

- **Enable chat:** Determines whether the chat feature is enabled or disabled for users.
- **Allow verified users only:** Specifies whether chat is restricted to verified users only.
- **Max visible messages:** Sets the maximum number of messages visible in the chat interface.
- **Message age limit (mins):** Specifies the age threshold of messages to display in the chat.
- **Required time for new users (mins):** Sets the minimum time (in minutes) that new users must wait before being allowed to send messages.
- **Cooldown between messages:** Specifies the time interval users must wait between sending consecutive messages, in seconds.
- **Mute time in minutes:** Determines the duration for which a user is muted after violating chat rules.
- **Message length before truncation:** Defines the message length threshold at which it gets collapsed.
- **Default name for new users:** Sets the default username assigned to new users.

#### Stream
![image](https://github.com/user-attachments/assets/b949f460-2e46-4e91-92a8-323d12c95fc2)

- **Enable stream:** Shows or hides the player.
- **Use primary source:** Specifies whether to use the primary source for the stream. Fallbacks to the secondary source if disabled.
- **Use native player:** Determines whether to use the browser's native player for streaming.
- **Treat URL as embed:** Dictates whether to treat URLs as embedded content for streaming purposes.
- **Enable Multistreams:** Allows users to switch between the primary and secondary sources simultaneously.
- **Primary stream URL:** Specifies the primary URL source for streaming content.
- **(optional) Primary URL custom name** Sets the custom name for the primary source that shows on the multistream banner.
- **Secondary stream URL:** Provides an alternative URL source for streaming content if the primary source is unavailable.
- **(optional) Secondary URL custom name** Sets the custom name for the secondary source that shows on the multistream banner.

#### Poll
![image](https://github.com/user-attachments/assets/972273c0-d0c7-4fd5-88ae-e6c13ff99bd6)
- **Show poll:** Controls the visibility of the poll.
- **Accept new options:** Determines whether new options can be added to an existing poll.
- **Accept new votes:** Specifies whether new votes are allowed after a poll has started.
- **Make votes public:** Makes votes visible to all users.
- **Minimum sent to participate:** Sets the minimum number of messages a user must have sent to participate in a poll.
- **Poll title:** Specifies the title or topic of the poll being conducted.

#### Tor and VPNs
![image](https://github.com/user-attachments/assets/4df09ed9-1806-458d-9150-8e491433acdc)
- **Block TOR connections site-wide:** Blocks access to the site for TOR users.
- **Block TOR connections (chat only):** Prevents TOR users from chatting, but they can still access the site.
- **Block VPN connections site-wide:** Blocks access to the site for VPN users.
- **Block VPN connections (chat only):** Prevents VPN users from chatting, but they can still access the site.
- **API URL for IP detection service:** The third-party service used for IP detection (default: ip-api.com).
- **API key for VPN detection service:** Optional field for a token if the IP detection service requires one.
- **Optional header for sending the API key:** Allows sending the API key in a custom header.
- **VPN detection match criteria:** Customize how the JSON response is matched (e.g., `{"proxy": (value), "hosting": (value)}`).

### Bingo 
![image](https://github.com/user-attachments/assets/d835f252-2693-43a9-bdc3-4a9f9f3f593d)
- **Show bingo:** Determines whether the bingo is displayed.
- **Enable auto marking:** Specifies whether automatic marking of options is enabled once a certain threshold is met.
- **Auto marking seconds threshold:** The number of seconds during which simultaneous suggestions are considered.
- **Auto marking unique user threshold:** The minimum number of unique user suggestions required to trigger auto-marking.
- **Bingo title:** A title for the bingo (self-explanatory).

#### OBS
![image](https://github.com/user-attachments/assets/2746737d-29ae-4ee4-b5ef-ffadc13a5ad6)
> [!TIP]
> You don't need any of these configurations unless you're using a cloud OBS instance and you want to control it remotely. If you're going to use them, make sure that your OBS has WebSockets enabled and is accepting incoming connections. See more on [cloud OBS](#cloud-obs)
- **Host:** Specifies the host for OBS connection. Format: (ws://[IP]:4455)
- **Password:** Provides the password required for authentication when connecting to OBS.
- **Main scene:** Specifies the main scene to be displayed in the OBS interface.
- **Main source:** Specifies the main video source to be displayed within the main scene.
- **Kino source:** Specifies the video source to be displayed in the "Kino" scene.
- **Music source:** Specifies the audio source to be optionally played during the broadcast.

#### Theme
![image](https://github.com/user-attachments/assets/c3795652-41c5-4954-bf75-485364189f66)
- **Enable fireworks:** Toggles the display of fireworks animations.
- **Enable Christmas theme:** Enables or disables the Christmas theme.
- **Enable Halloween theme:** Enables or disables the Halloween theme.
- **Christmas theme snowflake count:** Specifies how many snowflakes are shown in the Christmas theme.
- **Primary color:** Sets the default primary palette color (default: blueGrey).
- **Secondary color:** Sets the secondary palette color (default: orange).

#### Notifications
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/2449c7b8-f09a-4a7f-ad4e-c7447735aa46)
> [!CAUTION]
> Do not change these values unless you know what you're doing.
- **VAPID Public Key:** Specifies the public key for VAPID authentication.
- **VAPID Private Key:** Specifies the private key for VAPID authentication.
- **VAPID Mail:** Provides the email address associated with VAPID authentication.

#### Golden pass
![image](https://github.com/user-attachments/assets/c7baac87-d1fe-40c3-83c7-87dfad7875bd)
- Fully automated integration with BTCPayServer, please see https://btcpayserver.org/

### Bans
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/c4066618-ae54-4930-ae06-7a773d339872)

Shows the list of banned users. Use the button on the right to unban the user.

### Mutes
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/45a00624-5b5e-4456-999f-0a1ea85697e0)

Shows the list of currently muted users. To remove a mute, use the button on the right.

### Active users
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/13d5e33d-121e-4f16-b243-778017587cfb)

Show the list of active users. Use the button on the right to display their information.

### Auto-mod filters
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/43fdfdd5-da5c-46fd-9d5c-9bcebd777f92)

Shows the list of active auto-mod filters. Use the button on the right to remove them.

### Moderators
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/9f9183d5-f3ee-4086-9f9c-7eb54725ebe0)

Shows the list of moderators. Use the button on the right to unmod them.

### Notify users
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/cfd0c047-277f-4fce-b399-6356e165392c)

Shows a dialog asking whether to notify the subscribed users that the stream has started.

### Emotes
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/fb6d898c-a218-420c-96e0-d86ae10c205b)

Shows the list of active emotes. To add a new emote, click on "ADD". Keep in mind that the size can't be greater than 36x36.

### Bingo options
![image](https://github.com/user-attachments/assets/4853a1c9-7ecb-44c1-93d8-fc02c8f6a50c)

Shows the list of bingo options. To add a new option, click on "ADD".

### Message and user management
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/3f3f9780-c7e4-4106-a9e4-1ba28fa3cda8)

While authenticated as an admin, hover over a message and you will have the options to:
1. Remove the message (by clicking on the remove button)
   
   ![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/7e718ae2-ed98-43e7-bd64-261e7383d030)
   
2. Manage the user (by clicking on the user button)
   
   ![image](https://github.com/user-attachments/assets/02d83a4b-87fa-4a06-838c-b8fbd7e21fa5)

   The following moderation options will be available:
   - **Make mod**: Grants the user moderator privileges.
   - **Verify**: Verifies the user.
   - **Ignore**: Ignores the user. This option is available to all users.
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
