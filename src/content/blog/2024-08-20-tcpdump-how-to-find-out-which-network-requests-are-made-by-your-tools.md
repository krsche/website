---
title: "TCPDump: How to find out which network requests are made by your tools?"
image: 2024-08-20-tcpdump-askubuntu.png
timetoreadmins: 5
slug: tcpdump-observe-network-requests
date: 20.08.2024
tags: 
  - tcpdump
  - firewall
  - whitelisting
---

I have a locked-down Linux Server where I want to pull and run a docker container from DockerHub. 
_Locked-down_ means here, that the egress traffic of that server is restricted by a firewall.
Therefore the server cannot access everything on the internet, only the sites I have explictly allowed.

Therefore I need to find out which URLs are used when I call `docker pull`.
Google might give me an answer, but I want to exactly see what is tried to be accessed, on my machine, by inspecting the network traffic.

This would also be very useful in other situations, like debugging network issues, etc.

How?

1. Capture the requests made by `docker pull`
2. Check where it tries to connect to

On Linux, with tcpdump, easy enough.

1. Run sudo __`sudo tcpdump -i any -w /tmp/http.log`__ to capture any network interface and write everything in a log file.
2. Now your terminal is blocked, so hit __`Ctrl + Z`__ to halt the current process and then continue it in the background by running the __`bg`__ command
3. Then run the command where we want to capture the packets from, __`docker pull nginx`__ for example and abort it with __`Ctrl + C`__ once you think the network requests have been made.
4. Stop the packet capture by bringing the background process back into the foreground with __`fg`__ and stopping it with __`Ctrl + C`__
5. Finally we can read the captured packets with __`sudo tcpdump -r /tmp/http2.log | less`__ or directly filter them for the process we're interested in with __`sudo tcpdump -r /tmp/http2.log | grep docker`__. If we want to look at the payload of the packets add the __`-A`__ flag to tcpdump, but usually this is neither required, nor readable with TLS.

Now it's just a matter of you looking through the requests for the URLs you can spot. For my docker example, I could identify:

- registry-1.docker.io
- docker.io
- production.cloudflare.docker.com

From the internet I then learned that the following URLs are also relevant for docker:

- index.docker.io for the API
- auth.docker.io for Authentication

So the final list of URLs I added to my Firewall were these five, as you can see in the screenshot.

![2024-08-20-pfsense-screenshot.png](./images/2024-08-20-pfsense-screenshot.png)

Hope that helped, I'll definitely make use of this more often.

Credit [AskUbuntu](https://askubuntu.com/questions/252179/how-to-inspect-outgoing-http-requests-of-a-single-application) 