<h1 align="center">
  Shrimpcast
</h1>

<p align="center">
  <img src="https://github.com/shrimpcast/shrimpcast/assets/167498236/d3159e68-60dd-4e8f-a8ca-be0a99a759a1" alt="Logo">
</p>

![Project-showcase)](https://github.com/user-attachments/assets/1b58cf67-1545-4bb4-b129-029cad9a5cf6)

## Introduction

Shrimpcast is a highly customizable, flexible, battle-tested, fast, and secure self-hosted streaming platform, built for resilience at scale to support thousands of users.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Troubleshooting](#troubleshooting)
- [Throughput estimation](#throughput-estimation)
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
    - [Vapid](#vapid)
    - [Golden pass](#golden-pass)
    - [Turnstile](#turnstile)
  - [Active Users](#active-users)
  - [Bans](#bans)
  - [Mutes](#mutes)
  - [Auto-mod filters](#auto-mod-filters)
  - [Moderators](#moderators)
  - [Notify users](#notify-users)
  - [Emotes](#emotes)
  - [Bingo options](#bingo-options)
  - [Message and user management](#message-and-user-management)
  - [Chat commands](chat-commands)
    - [Cloud OBS](#cloud-obs)
    - [Whispers](#whispers)
    - [Others](#others)
- [Update](#update)
- [License](#license)

_Last revision: **1.3.4** (not fully complete)_

## Features

- **Secure**
- **Strong anti-spam foundations**
- **Fast and lightweight**
- **Flexible and highly customizable**
- **Battle-tested with thousands of concurrent users**
- **Out-of-the-box Cloudflare support**
- **Feature rich**

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
   
   Your instance will automatically reboot after the installation completes.


3. (Optional) If you're using Cloudflare as a reverse proxy, run:

   ```bash
   wget -O cloudflare_setup.sh https://github.com/shrimpcast/shrimpcast/releases/latest/download/cloudflare_setup.sh
   chmod +x cloudflare_setup.sh
   ./cloudflare_setup.sh
   ```

   This script will restrict traffic outside Cloudflare and apply a few required configuration tweaks.

And that's it! Shrimpcast should now be up and running. You can now try to access your domain URL. Make sure to save the admin session that was generated during the installation, which you can find at `/root/shrimpcast/setup/GeneratedAdminToken.txt`, or at the end of step 1.

## Troubleshooting

- .NET SDK installed but not found: <br>
  run `sudo snap remove dotnet-sdk && sudo apt remove -y 'dotnet*' 'aspnetcore*' 'netstandard*' && sudo rm -f /etc/apt/sources.list.d/microsoft-prod.list /etc/apt/sources.list.d/microsoft-prod.list.save && sudo apt update && sudo apt install -y dotnet8`
  then add the `--skipdotnet` flag to the install script and re-run it: `./install.sh [...] --skipdotnet`
- Certbot fails: <br>
  Ensure that port 80 on your VPS is publicly accessible and that your domain’s DNS is correctly configured. Then run:
  `sudo apt-get remove --purge nginx nginx-common`  <br>
  `sudo rm -rf /etc/nginx`  <br>
  `sudo apt-get autoremove --purge`  <br>
  then re-run the install script.

## Throughput estimation
This guide will help you accurately measure your server's actual upload speed using parallel connections, simulating real-world network usage.

### 1. Set up real-time monitoring

Open your first SSH session and run:

```bash
apt update && apt install nload
nload
```

### 2. Run the speed test

Open a second SSH session and run:

- Option 1 ([LibreSpeed CLI tool](https://github.com/librespeed/speedtest-cli))
```bash
# Download and extract librespeed-cli
wget https://github.com/librespeed/speedtest-cli/releases/download/v1.0.11/librespeed-cli_1.0.11_linux_386.tar.gz
tar -xzf librespeed-cli_1.0.11_linux_386.tar.gz

# Launch multiple parallel upload tests
for i in {1..8}; do 
  ./librespeed-cli --no-download --no-icmp --duration 30 &
done
wait
```

- Option 2 (Speedtest CLI)
```bash
# Download and install speedtest-cli
apt update && apt install speedtest-cli

# Launch multiple parallel upload tests
for i in {1..8}; do 
  speedtest-cli --no-download --secure &
done
wait
```

This will:
- Provide a realistic measurement of your server's maximum upload capacity

## Example output

When running properly, you'll see real-time throughput statistics in your first terminal window while the tests are executing in your second window.

![Upload speed test results example](https://github.com/user-attachments/assets/3f035573-3408-4cfb-857a-03637f6bf2e6)


## Why this works

By running multiple parallel upload tests, you simulate real-world conditions where multiple connections share your server's bandwidth, giving you a more accurate picture of your server's true upload capabilities than a single-threaded test.

## Media Server

You can access its panel by visiting {your_domain}/ui.

If you're using Cloudflare, for RTMP broadcast, you'll need to bypass the domain proxy (but don't worry, it's already configured to allow 1935!) and stream directly to the VPS IP (e.g., rtmp://{your_vps_ip}/{livestream}).

## Debug

First, clone the repository.
To debug the project, you will need:
- Visual Studio / VS code
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

![image](https://github.com/user-attachments/assets/06ab5f4b-05e0-4221-9630-b8ef69e05b1a)
  - [Configuration](#configuration)
    - [Site](#site)
    - [Chat](#chat)
    - [Stream](#stream)
    - [Poll](#poll)
    - [Tor & VPNs](#tor-and-vpns)
    - [Bingo](#bingo)
    - [OBS](#obs)
    - [Theme](#theme)
    - [Vapid](#vapid)
    - [Golden pass](#golden-pass)
    - [Turnstile](#turnstile)
  - [Active Users](#active-users)
  - [Bans](#bans)
  - [Mutes](#mutes)
  - [Auto-mod filters](#auto-mod-filters)
  - [Moderators](#moderators)
  - [Notify users](#notify-users)
  - [Emotes](#emotes)
  - [Bingo options](#bingo-options)

#### Site
<img width="1119" height="783" alt="iamge" src="https://github.com/user-attachments/assets/0532774e-53a0-4fb3-95af-fd955664fe3e" />

- **Enable PWA**: Toggles [Progressive Web App (PWA)](https://en.wikipedia.org/wiki/Progressive_web_app) support on or off.
- **Force latest version**: Forces all clients to be on the latest frontend version.
- **Publicly display connected users**: Shows or hides the list of connected users for non-admin users.
- **Max connections per IP**: The maximum number of simultaneous connections by a single IP address.
- **Minimum auto-mod time**: The minimum delay time expressed in milliseconds for the auto-mod.
- **Maximum auto-mod time**: The maximum delay time expressed in milliseconds for the auto-mod.
- **Open site at**: Time at which the site will be opened for users. While the site is closed, users will see a countdown:
  ![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/4da09809-76ca-40dd-ba3f-d655480987f4)
- **Stream title**: The title of both the stream and site.
- **Stream description**: Site/stream description. Use \n for line breaks.

#### Chat
<img width="1119" height="797" alt="image" src="https://github.com/user-attachments/assets/25a9b748-45e1-442a-89d4-77a20698f9ba" />

- **Enable chat:** Determines whether the chat feature is enabled or disabled for users.
- **Allow verified users only:** Specifies whether chat is restricted to verified users only.
- **Max visible messages:** Sets the maximum number of messages visible in the chat interface.
- **Message age limit (mins):** Specifies the age threshold of messages to display in the chat.
- **Required time for new users (min):** Sets the minimum time (in minutes) that new users must wait before being allowed to send messages.
- **Required time to post links (min):** Sets the minimum time (in minutes) that new users must wait before being allowed to send links. Use -1 for unlimited. 
- **Cooldown between messages:** Specifies the time interval users must wait between sending consecutive messages, in seconds.
- **Mute time in minutes:** Determines the duration for which a user is muted after violating chat rules.
- **Message length before truncation:** Defines the message length threshold at which it gets collapsed.
- **Default name for new users:** Sets the default username assigned to new users.

#### Stream
<img width="1528" height="733" alt="image" src="https://github.com/user-attachments/assets/302bf87c-b114-4633-b7bd-ee9a9f41d46c" />

- **Enable stream:** Shows or hides the player.
- **Show viewer count per stream:** Shows viewer count per stream.
- **Name:** Source name, also used for routing.
- **Title**: Optional source title displayed on the stream selection page. If left empty, the source name will be used instead.
- **URL:** URL source for the stream feed.
- **Thumbnail:** Determines the thumbnail used on the multistream preview for each source.
- **Legacy player**: Uses the browser’s native player for streaming. Also compatible with platforms like YouTube, Twitch, Streamable, and others.
- **Embed:** Dictates whether to treat URLs as embedded content.
- **With credentials:** Determines whether the player sends authentication cookies (HLS only). Use only if necessary.
- **Reset on Start**: If enabled, restarts Docker when the scheduled start time is triggered. Useful for restarting queued movies.
- **Schedule Start**: Schedules a background job to automatically enable the source. If already enabled, a countdown timer will be displayed.
- **Schedule End**: Schedules a background job to automatically disable the source.

#### Poll
![image](https://github.com/user-attachments/assets/40d82667-cc50-41b8-b142-23260028102e)
- **Show poll:** Controls the visibility of the poll.
- **Accept new options:** Determines whether new options can be added to an existing poll.
- **Accept new votes:** Specifies whether new votes are allowed after a poll has started.
- **Make votes public:** Makes votes visible to all users.
- **Minimum sent to participate:** Sets the minimum number of messages a user must have sent to participate in a poll.
- **Poll title:** Specifies the title or topic of the poll being conducted.

#### Tor and VPNs
![image)](https://github.com/user-attachments/assets/f8aee1d3-524a-4fb5-b31c-d094ea051da3)
- **Block TOR connections site-wide:** Blocks access to the site for TOR users.
- **Block TOR connections (chat only):** Prevents TOR users from chatting, but they can still access the site.
- **Block VPN connections site-wide:** Blocks access to the site for VPN users.
- **Block VPN connections (chat only):** Prevents VPN users from chatting, but they can still access the site.
- **API URL for IP detection service:** The third-party service used for IP detection (default: ip-api.com).
- **API key for VPN detection service:** Optional field for a token if the IP detection service requires one.
- **Optional header for sending the API key:** Allows sending the API key in a custom header.
- **VPN detection match criteria:** Customize how the JSON response is matched (e.g., `{"proxy": (value), "hosting": (value)}`).

### Bingo 
![image](https://github.com/user-attachments/assets/32a9a460-d2ac-4724-b426-d8a8dd3b22d6)
- **Show bingo:** Determines whether the bingo is displayed.
- **Enable auto marking:** Specifies whether automatic marking of options is enabled once a certain threshold is met.
- **Auto marking seconds threshold:** The number of seconds during which simultaneous suggestions are considered.
- **Auto marking unique user threshold:** The minimum number of unique user suggestions required to trigger auto-marking.
- **Bingo title:** A title for the bingo (self-explanatory).

#### OBS
![image](https://github.com/user-attachments/assets/72f665d9-1c13-44b9-b779-ea8546af281e)
> [!TIP]
> You don't need any of these configurations unless you're using a cloud OBS instance and you want to control it remotely. If you're going to use them, make sure that your OBS has WebSockets enabled and is accepting incoming connections. See more on [cloud OBS](#cloud-obs)
- **Host:** Specifies the host for OBS connection. Format: (ws://[IP]:4455)
- **Password:** Provides the password required for authentication when connecting to OBS.
- **Main scene:** Specifies the main scene to be displayed in the OBS interface.
- **Main source:** Specifies the main video source to be displayed within the main scene.
- **Kino source:** Specifies the video source to be displayed in the "Kino" scene.
- **Music source:** Specifies the audio source to be optionally played during the broadcast.

#### Theme
![image](https://github.com/user-attachments/assets/7bd254ed-84d3-42c3-bf40-2abd8cdb4a76)
- **Enable fireworks:** Toggles the display of fireworks animations.
- **Enable Christmas theme:** Enables or disables the Christmas theme.
- **Enable Halloween theme:** Enables or disables the Halloween theme.
- **Christmas theme snowflake count:** Specifies how many snowflakes are shown in the Christmas theme.
- **Primary color:** Sets the default primary palette color (default: blueGrey).
- **Secondary color:** Sets the secondary palette color (default: orange).

#### Vapid
![image](https://github.com/user-attachments/assets/40642056-f6e7-45f5-b55a-643c1e22c998)
> [!CAUTION]
> Do not change these values unless you know what you're doing.
- **VAPID Public Key:** Specifies the public key for VAPID authentication.
- **VAPID Private Key:** Specifies the private key for VAPID authentication.
- **VAPID Mail:** Provides the email address associated with VAPID authentication.

#### Golden pass
![image](https://github.com/user-attachments/assets/7621cd84-1fe5-45ce-80f9-99098e01e17b)
- Fully automated integrations with BTCPayServer & Stripe, 

#### Turnstile
![image](https://github.com/user-attachments/assets/072a8c57-a9f8-413e-ac10-2325ba83d86f)
- Requires [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) verification for new users.

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

## Chat commands

### Cloud OBS

If you're utilizing a cloud OBS instance, manage it effortlessly through chat commands:

- `!playmain [URL?]`
- `!playkino [URL?]`
- `!playmusic [URL?]`

### Whispers

Admins can securely send private messages to users using the following chat command:

- `!ping [SessionId] [Message]`

Retrieve the SessionId from the [Message and User Management](#message-and-user-management) section.

#### Others
- `!dockerrestart` — Restarts Docker.
- `!resetallsavedvpnrecords` — Clears all saved VPN-related IP records.
- `!tryipservice [IP?]` — Tests the IP service. If no IP is provided, it defaults to the requester’s IP.
- `!redirectsource [FROM] [TO]` — Redirects users watching source `FROM` to source `TO`.

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
