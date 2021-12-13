# socket
An app for tranfering files in a local network between desktop devices

## Feautres
* Automatically connect to other sockets on a LAN
* Send multiple files at the same time
* Ultra high transfer speeds* since it is over the LAN
* Just run and that's all

*Limited by the socket with the lowest speed connection 

## Screens

![Dashboard]("https://i.imgur.com/qRhh6dK.png")
![Sockets connected]("https://i.imgur.com/uVPZRop.png")
![Sening multiple files]("https://i.imgur.com/KnHA9nZ.png")
![File sent]("https://i.imgur.com/NANIzaz.png")
![File recieved]("https://i.imgur.com/I8hHWel.png")

## Buy me a banana 🍌
You can help me donating in buymeacoffee [here](https://www.buymeacoffee.com/alethetwin)

# Intallation instructions

### Windows 
Download and excecute the socket-beta-setup-win32-x64.exe file, when asked choose to do an installation for the local user (otherwise you must run as administrator each time you launch the app).

### Linux
Download and extract the socket-beta-linux-x64.zip file, open a terminal and enter the folder extracted, then run `./socket`.

### Debian
Download and install the socket-beta-debian-x64.deb file, in this case due to an error you must edit the owner of the /usr/lib/socket/resources/app/ files to your own user using -`chown` command.

### Mac OSX
Download and unzip the socket-beta-mac-arm64.zip file, then drag the socket app to your applications folder. (Socket is only available on Apple Silicon, but if you want the intel version you can clone this repo and package it yourself).


