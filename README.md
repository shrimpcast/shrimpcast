<h1 align="center">
  Shrimpcast
</h1>

<p align="center">
  <img src="https://github.com/shrimpcast/shrimpcast/assets/167498236/d3159e68-60dd-4e8f-a8ca-be0a99a759a1" alt="Logo">
</p>

<img width="2535" height="1341" alt="showcase" src="https://github.com/user-attachments/assets/8ce6f90d-6627-47c0-b930-5245fd8c106e" />

## Introduction

Shrimpcast is a highly customizable, flexible, battle-tested, high performance, and secure self-hosted streaming platform, built for resilience at scale to support thousands of users.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Troubleshooting](#troubleshooting)
- [Throughput estimation](#throughput-estimation)
- [Media server](#media-server)
- [Development](#development)
- [Usage](#usage)
  - [Getting started](#getting-started)
  - [How to set up your first stream](#how-to-set-up-your-first-stream)
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
    - [Load balancing](#load-balancing)
    - [Backups](#backups)
  - [Media server](#media-server)
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

_Last revision: **2.2.5**_

## Features

- **Secure**
- **Strong anti-spam foundations**
- **Fast and lightweight**
- **Flexible and highly customizable**
- **Battle-tested with thousands of concurrent users**
- **Out-of-the-box Cloudflare support**
- **Feature rich**
- **Inbuilt load balancing**

## Installation

To install Shrimpcast, follow these steps:

> [!IMPORTANT]
> You need a valid domain to run this script, with properly configured DNS records.

> [!NOTE]
> Required OS: Ubuntu x64 24.04 LTS

> [!NOTE]
> While the exact hardware requirements depend on your workload, a minimum of 2 vCPUs and 4 GB of RAM is recommended.

1. On a fresh VPS, run:

   ```bash
   wget -O install.sh https://github.com/shrimpcast/shrimpcast/releases/latest/download/install.sh
   chmod +x install.sh
   ./install.sh -d [YOUR_DOMAIN_NAME]
   ```

   Make sure to replace `[YOUR_DOMAIN_NAME]` with your domain name.
   
   Your instance will automatically reboot after the installation completes.
> [!IMPORTANT]
> SSL will be automatically configured. You **MUST** have properly configured DNS records before running the script.

2. (Optional) If you're using Cloudflare as a reverse proxy, run: <br>

   ```bash
   wget -O cloudflare_setup.sh https://github.com/shrimpcast/shrimpcast/releases/latest/download/cloudflare_setup.sh
   chmod +x cloudflare_setup.sh
   ./cloudflare_setup.sh
   ```

   This script will restrict traffic outside Cloudflare and apply a few required configuration tweaks.
   
> [!IMPORTANT]
> If you are using cloudflare, remember to set SSL to strict mode. Otherwise, cloudflare won't be able to connect to your origin.


And that's it! Shrimpcast should now be up and running. You can now try to access your domain URL. Make sure to save the admin session that was generated during the installation, which you can find by running 
```bash 
cat /root/shrimpcast/setup/GeneratedAdminToken.txt; echo
```
Or at the end of step 1.

## Troubleshooting

- Certbot fails: <br>
  Ensure that port 80 on your VPS is publicly accessible and that your domain’s DNS is correctly configured. Then run:
  ```bash
  sudo apt-get remove --purge nginx nginx-common &&
  sudo rm -rf /etc/nginx &&  
  sudo apt-get autoremove --purge
  ``` 
  then re-run the install script.

## Throughput estimation
Accurately measure your server's actual upload speed:
```bash
cd /tmp
curl -sSL https://install.speedtest.net/app/cli/ookla-speedtest-1.2.0-linux-x86_64.tgz -o speedtest.tgz
tar -xzf speedtest.tgz
sudo mv speedtest /usr/local/bin/
speedtest --accept-license --accept-gdpr
```

## Development

To build and debug the project, you will need:

- An IDE: **Visual Studio 2026**, **VS Code**, or **Rider**
- **.NET 10 SDK**
- **PostgreSQL**
- **FFmpeg 6 or later**  
  *(On Windows, ensure FFmpeg is available on your system `PATH`)*

### Windows-only requirements

- Git
- Add Git’s `bin` directory to your system `PATH`  
  *(typically `C:\Program Files\Git\usr\bin`), as the project relies on several Bash utilities*
- Wget for windows, also on your system `PATH`

## Usage

### Getting started

Once you have Shrimpcast up and running, you will need to authenticate as an admin. To do this, use the token saved at `/root/shrimpcast/setup/GeneratedAdminToken.txt`, and follow these instructions:

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/726453af-ed07-4896-922f-d4a6c27781c5" />

1. Press the top-left button.
2. Paste the token and submit.

And that's it! You're now authenticated as an admin.

### Configuration

Once you're authenticated as an admin, you will have the following options:

<img width="408" height="35" alt="image" src="https://github.com/user-attachments/assets/73b38ffb-3a5f-4b1a-8518-a6207c18f600" /><br>
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
    - [Load balancing](#load-balancing)
    - [Backups](#backups)
  - [Media server](#media-server)
  - [Bans](#bans)
  - [Mutes](#mutes)
  - [Auto-mod filters](#auto-mod-filters)
  - [Moderators](#moderators)
  - [Notify users](#notify-users)
  - [Emotes](#emotes)
  - [Bingo options](#bingo-options)

Field types:
 - <img src="https://img.shields.io/badge/public-red" align="absmiddle"> : any unauthenticated client can access the content of the field. Does not contain sensitive data. 
 - <img src="https://img.shields.io/badge/private-green" align="absmiddle"> : only admins can access the content of the field. Contains sensitive data. 

#### Site
<img width="1119" height="783" alt="iamge" src="https://github.com/user-attachments/assets/0532774e-53a0-4fb3-95af-fd955664fe3e" />

- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Enable PWA**: Toggles [Progressive Web App (PWA)](https://en.wikipedia.org/wiki/Progressive_web_app) support on or off. Must be turned on to allow push notifications.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Force latest version**: Forces all clients to be on the latest frontend version.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Publicly display connected users**: Shows or hides the list of connected users for non-admin users.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Max connections per IP**: The maximum number of simultaneous connections by a single IP address.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Minimum auto-mod time**: The minimum delay time expressed in milliseconds for the auto-mod.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Maximum auto-mod time**: The maximum delay time expressed in milliseconds for the auto-mod.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Open site at**: Time at which the site will be opened for users. While the site is closed, users will see a countdown:
  ![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/4da09809-76ca-40dd-ba3f-d655480987f4)
- <img src="https://img.shields.io/badge/public-red" align="absmiddle">  **Stream title**: The title of both the stream and site.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Stream description**: Site/stream description. Use \n for line breaks.

#### Chat
<img width="1273" height="849" alt="image" src="https://github.com/user-attachments/assets/ff7c4837-10f5-4380-a4b2-6055c4fe86bb" />

- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Enable chat:** Determines whether the chat feature is enabled or disabled for users.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Strip non ASCII characters:** Determines whether characters beyond the ASCII range, including Latin-A, may be used in chat messages.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Allow verified users only:** Specifies whether chat is restricted to verified users only.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Max visible messages:** Sets the maximum number of messages visible in the chat before it rotates.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Message age limit (mins):** Specifies the age threshold of messages to display in the chat.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Required time for new users (min):** Sets the minimum time (in minutes) that new users must wait before being allowed to send messages.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Required time to post links (min):** Sets the minimum time (in minutes) that new users must wait before being allowed to send links. Use -1 for unlimited. 
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Cooldown between messages:** Specifies the time interval users must wait between sending consecutive messages, in seconds.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Mute time in minutes:** Determines the duration for which a user is muted, in minutes.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Message length before truncation:** Defines the message length threshold at which it gets collapsed.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Default name for new users:** Sets the default username assigned to new users.

#### Stream
<img width="1600" height="666" alt="image" src="https://github.com/user-attachments/assets/334423e7-0b7f-4ccd-86fe-4db730ebf6e0" />

- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Enable stream:** Shows or hides the player.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Show viewer count per stream:** Shows viewer count per stream.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Name:** Source name, also used for routing.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Title**: Optional source title displayed on the stream selection page. If left empty, the source name will be used instead. <br />
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Stream override:** By default, the software uses the name for routing. If you wish to use a different stream, or a custom URL, you can use this field. <br />
                       For example, if you have a stream named 'movie', and you leave the field untouched, the program will point to `/....streams/movies/...` <br />
                       You could set `movie2` and it will point to `/....streams/movies2/...`, or use a full custom URL
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Thumbnail:** Determines the thumbnail used on the multistream & player preview for each source. If left empty, and the input is a server stream, the default generated thumbnail will be used.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **With credentials:** Determines whether the player sends authentication cookies. Note that this requires CORS response headers to be set.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Sync on switch:** If enabled, the media server stream will adopt the same enabled state as the stream source when the scheduled start time is triggered. Note both the media server stream name & the source name need to have the same exact name.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Schedule start:** Schedules a background job to automatically enable the source. If already enabled, a countdown timer will be displayed.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Schedule end:** Schedules a background job to automatically disable the source.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Sort priority:** The numeric sort priority used to display streams in ascending order.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Load balancing rules:**
  ### Load balancing setup

  Set up your child instances on a subdomain (e.g., `lb(n).domain`), using the same auth token across all instances. Then enable sending metrics from each load balancing instance to the master instance domain.

  ### Load balancing modes

  ### 1. Instance count

  Distribute traffic evenly across a fixed number of instances.

  **Example:** balance across 5 instances (`lb1` through `lb5`):  
  Set `load balancing rules` to `5`
  

  > **Note:** All child instances must produce identical HLS output for this to work correctly.

  ---

  ### 2. Instance count with exclusions

  Distribute traffic across a range of instances while skipping specific ones.

  **Example:** balance across 5 instances, excluding `lb1` and `lb5` (uses `lb2`, `lb3`, `lb4`):<br />
  Set `load balancing rules` to `ei5_1,5`
  
  ---

  ### 3. Weighted distribution

  Steer traffic to specific instances by percentage.
  **Example:** 50% to `lb1`, 20% to `lb2`, 10% each to `lb3`, `lb4`, and `lb5`: <br />
  Set `load balancing rules` to `w50,20,10,10,10`

#### Poll
<img width="1370" height="624" alt="image" src="https://github.com/user-attachments/assets/cb1daa0f-8513-4c86-a47b-30db22723498" />

- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Show poll:** Controls the visibility of the poll.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Accept new options:** Determines whether new options can be added to an existing poll.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Accept new votes:** Specifies whether new votes are allowed after a poll has started.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Make votes public:** Makes votes visible to all users.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Enable vote skipping:** Determines whether the `!voteskip` command is enabled or disabled.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Max vote skip time (mins):**  Maximum time threshold on which a media item can be skipped. Set 0 for unlimited.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Minimum sent to participate:** Sets the minimum number of messages a user must have sent to participate in a poll.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Poll title:** Specifies the title or topic of the poll being conducted.

#### Tor and VPNs
![image)](https://github.com/user-attachments/assets/f8aee1d3-524a-4fb5-b31c-d094ea051da3)
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Block TOR connections site-wide:** Blocks access to the site for TOR users.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Block TOR connections (chat only):** Prevents TOR users from chatting, but they can still access the site.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Block VPN connections site-wide:** Blocks access to the site for VPN users.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Block VPN connections (chat only):** Prevents VPN users from chatting, but they can still access the site.
- <img src="https://img.shields.io/badge/private-green" align="absmiddle"> **API URL for IP detection service (private):** The third-party service used for IP detection (default: ip-api.com).
- <img src="https://img.shields.io/badge/private-green" align="absmiddle"> **API key for VPN detection service (private):** Optional field for a header token if the IP detection service requires one.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Optional header for sending the API key:** Header to send the API key.
- <img src="https://img.shields.io/badge/private-green" align="absmiddle"> **VPN detection match criteria (private):** Customize how the JSON response is matched <br>
  (e.g., `{"proxy": true, "hosting": true)}`) matches to `[proxy:true][hosting:true]` <br>
  can also use child elements, (e.g., `{"security": { proxy: true } }`) matches to `[security:proxy~true]`

#### Bingo 
![image](https://github.com/user-attachments/assets/32a9a460-d2ac-4724-b426-d8a8dd3b22d6)
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Show bingo:** Determines whether the bingo is displayed.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Enable auto marking:** Specifies whether automatic marking of options is enabled once a certain threshold is met.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Auto marking seconds threshold:** The number of seconds during which simultaneous suggestions are considered.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Auto marking unique user threshold:** The minimum number of unique user suggestions required to trigger auto-marking.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Bingo title:** A title for the bingo (self-explanatory).

#### OBS
![image](https://github.com/user-attachments/assets/72f665d9-1c13-44b9-b779-ea8546af281e)
> [!TIP]
> You don't need any of these configurations unless you're using a cloud OBS instance and you want to control it remotely. If you're going to use them, make sure that your OBS has WebSockets enabled and is accepting incoming connections. See more on [cloud OBS](#cloud-obs)
- <img src="https://img.shields.io/badge/private-green" align="absmiddle">  **Host:** Specifies the host for OBS connection. Format: (ws://[IP]:4455)
- <img src="https://img.shields.io/badge/private-green" align="absmiddle">  **Password:** Provides the password required for authentication when connecting to OBS.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Main scene:** Specifies the main scene to be displayed in the OBS interface.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Main source:** Specifies the main video source to be displayed within the main scene.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Kino source:** Specifies the video source to be displayed in the "Kino" scene.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Music source:** Specifies the audio source to be optionally played during the broadcast.

#### Theme
![image](https://github.com/user-attachments/assets/7bd254ed-84d3-42c3-bf40-2abd8cdb4a76)
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Enable fireworks:** Toggles the display of fireworks animations.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Enable Christmas theme:** Enables or disables the Christmas theme.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Enable Halloween theme:** Enables or disables the Halloween theme.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Christmas theme snowflake count:** Specifies how many snowflakes are shown in the Christmas theme.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Primary color:** Sets the default primary palette color (default: blueGrey).
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Secondary color:** Sets the secondary palette color (default: orange).

#### Vapid
![image](https://github.com/user-attachments/assets/40642056-f6e7-45f5-b55a-643c1e22c998)
> [!CAUTION]
> Do not change these values unless you know what you're doing. These values are used for the PWA's push notifications.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **VAPID Public Key:** Specifies the public key for VAPID authentication.
- <img src="https://img.shields.io/badge/private-green" align="absmiddle"> **VAPID Private Key:** Specifies the private key for VAPID authentication.
- <img src="https://img.shields.io/badge/private-green" align="absmiddle"> **VAPID Mail:** Provides the email address associated with VAPID authentication.

#### Golden pass
![image](https://github.com/user-attachments/assets/7621cd84-1fe5-45ce-80f9-99098e01e17b)
- Fully automated integrations with BTCPayServer & Stripe, 

#### Turnstile
![image](https://github.com/user-attachments/assets/072a8c57-a9f8-413e-ac10-2325ba83d86f)
- Requires [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) verification for new users.

#### Load balancing
<img width="1273" height="349" alt="image" src="https://github.com/user-attachments/assets/e0935596-9a45-46d0-866d-c0a34b48a906" /><br>
- <img src="https://img.shields.io/badge/public-red" align="absmiddle">  **Send metrics:** Specifies whether instance resource usage statistics are sent.
- <img src="https://img.shields.io/badge/public-red" align="absmiddle">  **Master instance domain:** The domain to which metrics are reported. Format should be `domain.tld`. Do not include protocols or slashes.
- <img src="https://img.shields.io/badge/private-green" align="absmiddle">  **Auth token:** The auth token used for metrics reporting. Must be the same on both master and slave instances.

#### Backups 
<img width="1370" height="416" alt="image" src="https://github.com/user-attachments/assets/3d1f72b0-f23a-4f60-86b0-24dfb7b736de" />

This service allows you to automatically backup your database every 10 minutes and send it to a private GitHub repo

- <img src="https://img.shields.io/badge/public-red" align="absmiddle"> **Enable database backups:** Specifies whether the database backup service is enabled or not.
- <img src="https://img.shields.io/badge/private-green" align="absmiddle"> **GitHub personal token:** Your private fine grained personal GitHub token.
- <img src="https://img.shields.io/badge/private-green" align="absmiddle"> **GitHub repository name:** The full name of your respository i.e. `your_username/your_repo`
- <img src="https://img.shields.io/badge/private-green" align="absmiddle"> **GitHub release id:** To allow the software to upload the backups, you need to create a release and get its corresponding id.

## Media server

<img width="1522" height="855" alt="localhost_44421_ (3)" src="https://github.com/user-attachments/assets/db7e427f-cad6-4134-8b53-f02c0570c517" />

### RTMP Endpoints
Defines RTMP ingress and egress points. For example, you can configure an RTMP endpoint to receive a stream directly from **OBS**.

### Outputs
Generates high-performance **HLS** streams. Accepts a wide range of input formats including HLS sources, RTMP/SRT egress endpoints, **VOD**, and **FLV** - essentially any video-compatible source.  
If you intend to stream from an RTMP input, use the corresponding **RTMP egress URL**.

### Probe
Configures input settings. Supports **H264/AAC** transcoding and custom audio sources.  
While transcoding is CPU-intensive, it ensures your input is properly encoded for playback across all devices.  
This is particularly useful for **VOD** inputs or sources that may contain corrupted or incompatible media.

  
  <img width="600" height="622" alt="image" src="https://github.com/user-attachments/assets/71f379f1-e0d7-4327-b44a-c761cb3fb176" />

# How to set up your first stream

Go to the [media server](#media-server) and set up a stream: <br>

<img width="1464" height="190" alt="image" src="https://github.com/user-attachments/assets/af5c3b7d-7388-42ad-9ff6-f10a24bdbfec" />

- **Enabled:** Specifies whether the stream is enabled.
- **Name:** The name of the stream.
- **Ingress URL:** The input media URL. Can be any supported media type, including VOD. To read from RTMP (for example if you'd like to use OBS), you must first set up an RTMP endpoint (see [RTMP endpoints](#rtmp-endpoints)).
- **Watermark URL:** A watermark that is hard-burned into the top-right of the stream. Requires transcoding to be enabled.
- **Subtitles URL:** Subtitles that are hard-burned into the stream. Requires transcoding to be enabled.
- **Start time:** The timestamp at which media playback starts. Useful for VOD.
- **Reset on fail:** Specifies whether the process will automatically restart when a protocol error occurs. Obligatory for non-http sources.
- **Download VOD:** Specifies whether the media item will be downloaded to disk before playback begins.
- **Show VOD info:** Specifies whether the media item name (playlists only) and/or time tracking will be hardburned into the stream. Requires transcoding to be enabled.

Then, click `RUN PROBE` to probe the URL: <br> <br>
<img width="600" height="417" alt="image" src="https://github.com/user-attachments/assets/b03f48b8-4d00-4344-be5f-791c0aa08c49" /><br>
- **Treat input as HLS:** Specifies whether to force the input to be treated as HLS when the content type cannot be automatically determined. Useful, for example, when using a plain-text M3U8 file with a different extension.
- **Custom headers:** Custom HTTP headers to include with the request (for example, `Referer`).

Once your stream is up and running, go to the active stream processes panel and click `Preview`.<br><br>
<img width="1150" height="122" alt="image" src="https://github.com/user-attachments/assets/51029f71-011f-49cc-bd14-b13c887d13c2" />
Then click on `copy` <br><br>
<img width="900" height="65" alt="image" src="https://github.com/user-attachments/assets/4bb1efe7-c5c3-4991-9997-f5ecbb8be996" />

You now have a stream up and running. You can now go to [sources](#stream) and use your URL as the input.

# Playlists
<img width="1464" height="201" alt="localhost_44421_ (6)" src="https://github.com/user-attachments/assets/1c857bd5-558a-4294-9800-36378a0ebd17" />
<img width="600" height="189" alt="image" src="https://github.com/user-attachments/assets/a60f65fb-4446-462b-a663-ec3cbd947734" />

You can create playlists from media streams. For example, given sources like movie1, movie2, and movie3, you can add them as a comma-separated list to a playlist ( ``movie1,movie2,movie3`` ). 
<br>
Or you can also use unprobed inputs (direct URLs) with source presets: i.e. playlist `movies` with source preset `movie`, so that every item in `movies` will use the configuration of `movie` 
<br>
- **Playlist on finish**: Switches to the specified playlist once the last queued item completes
- **Randomize:** Randomizes the playlist items
- **Special URL params:**
  - **filename**: if you're building a playlist with multiple unprobed URLs that use source presets, you can specify their respective names with the URL query param `(?|&)filename=name`
  - **vip**: disables `!voteskip` for the media item `(?|&)vip=true`

### Bans
<img width="1200" height="370" alt="image" src="https://github.com/user-attachments/assets/78160f66-00b6-41c6-a7ac-9f521f095eca" />

Shows the list of banned users. Use the button on the right to unban a user.  
Format: `{[M]/[A] (manual/automod)} {name} {creation date} [all known token IPs]`

### Mutes
<img width="600" height="256" alt="image" src="https://github.com/user-attachments/assets/127f7fa0-804f-4378-ac10-66c32e0b8f99" />

Shows the list of currently muted users. To remove a mute, use the button on the right.

### Auto-mod filters
<img width="600" height="267" alt="image" src="https://github.com/user-attachments/assets/b945836a-4a53-469d-bf4b-287c8cbf8eaf" /> 

Shows the list of active auto-mod filters. Use the button on the right to remove them.
- **Ignore case**: ignores letter casing in the given string. For example, for `test`, `TEST` and `tEsT` will all match.  
- **Ignore accents**: ignores diacritics in the given string. For example, for `test`, `tést` and `teśt` will all match.

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
<img width="319" height="40" alt="image" src="https://github.com/user-attachments/assets/9ec8a14d-2342-40a7-9c7e-0c52225bee81" />

While authenticated as an admin, hover over a message and you will have the options to:
1. Remove the message (by clicking on the remove button)
   
   ![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/7e718ae2-ed98-43e7-bd64-261e7383d030)
   
2. Manage the user (by clicking on the user button)
   
<img width="600" height="667" alt="image)" src="https://github.com/user-attachments/assets/eb4abbdc-0a6d-4888-bba9-f14974e5d0aa" />

   The following moderation options will be available:
   - **Make mod**: Grants the user moderator privileges.
   - **Verify**: Verifies the user.
   - **Ignore**: Ignores the user. This option is available to all users.
   - **Temporary mute**: mutes the user for the amount of time dettermined in the chat [configuration](#chat)
   - **Permanent mute**: Self explanatory
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
- `!resetallsavedvpnrecords` — Clears all saved VPN-related IP records.
- `!tryipservice [IP?]` — Tests the IP service. If no IP is provided, it defaults to the requester’s IP.
- `!redirectsource [FROM] [TO]` — Redirects users watching source `FROM` to source `TO`.
- `!runrestartdocker` — Restarts docker if installed.
- `!runtruncatelogs` — Truncates existing logs to save disk space.
- `!userlabel [SessionId] [Content]` — Sets user label for target session.
  
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
