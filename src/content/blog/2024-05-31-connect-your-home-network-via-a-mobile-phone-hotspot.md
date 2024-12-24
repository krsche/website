---
title: "Transparent Wifi <-> Ethernet Forwarding: Connect Your Home Network via a Mobile Phone Hotspot"
image: 2024-05-31.excalidraw.png
timetoreadmins: 5
slug: transparent-wifi-eth-forwarding
date: 05.01.2024
tags: 
  - scratchpad
  - git
  - workflow
---

Alright, so you're internet at home just went down, or you're in between internet contracts, just moved in or just want
the possibility to run you're entire home network off of you're mobile phones connection for whatever reason. 
Then you're exactly right here.

When trying to do this you'll immediatly face a problem, you're router wants an ethernet cable for the WAN (/internet)
connection, but you're phone can only share it's internet connection via WiFi (or USB in some cases).

To solve this we insert a `middleman` device in the form of a Raspberry PI with Ubuntu and iptables. But any other
device that runs Linux and has an Ethernet and WiFi interface should work too.

## The Full Config

Here you'll find the full config of the Raspberry Pi.
If you want to know more, you can always expand the `Details` collapsible in each section.

To summarize we need to connect both the router and phone, set up a dhcp server for the ethernet connection so that the
router receives a ipv4 address from our Raspberry, and then configure to forward whatever arrives at the ethernet port
to the WiFi interface connected to the phone.

### 1. DHCP Server Setup

1. Install the dhcp server via `apt install isc-dhcp-server`
2. Modify its configuration under `/etc/dhcp/dhcpd.conf` to include:
   ```
   authoritative;
   subnet 10.5.5.0 netmask 255.255.255.224 {
       range 10.5.5.26 10.5.5.30;
       option broadcast-address 10.5.5.31;
       option routers 10.5.5.1;
       option domain-name "local";
       option domain-name-servers 8.8.8.8, 8.8.4.4;
   }
   ```
3. Set up the listening device for the DHCP server in `/etc/default/isc-dhcp-server` via:
   ```
   INTERFACESv4="eth0"
   ```

#### Configure Traffic Forwarding

Configure iptables and network stack:  

```bash 
sudo bash -c "echo 1 > /proc/sys/net/ipv4/ip_forward"
iptables -A FORWARD -i eth0 -o wlan0 -j ACCEPT
iptables -A FORWARD -i wlan0 -o eth0 -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -t nat -A POSTROUTING -o wlan0 -j MASQUERADE
```

For me it actually was a bit hard to find the correct Ubuntu Download for my Raspberry Pi 3 B+ as almost all pages
refer to the 24.04 version only compatible with the everything newer than the 3 or the Ubuntu Core variant.
The link for Ubuntu 22.04 Prebuild Arm64 for the Raspberry Pi 2,3,4 is here:
https://cdimage.ubuntu.com/ubuntu/releases/22.04/release/

## 1. WiFi Interface Setup

Best to do this via UI --> Connect to your Phones WiFi (where you are connected to the internet)

## 2. Ethernet Interface Setup

### 2.1 Network Selection

From the perspective of the home network the Bridge replaces the ISPs router, so it needs to define the network and assign IP addresses to the home networks router (via DHCP).

We can define an arbitrary network for this usecase as long as it does not overlap with the network address range of the phones WiFi network.
We can check the network config on the WiFi interface with `ip addr` and look for a line similar with `inet` under the wifi interface (e.g. `wlan0`). In my case it is `inet 192.168.0.129/24`. So what does that mean?

- `inet` means we're looking at IPv4 and not IPv6, which would be `inet6`. We want IPv4 here.
- `192.168.0.129` is the IP address of WiFi interface in the phones network
- `/24` denotes that the phones network has 256 IP addresses available
- `192.168.0.129/24` finally states that the network goes from `192.168.0.0` to `192.168.0.255` where `.0` and `.255` are reserved for the _Network ID_ and the _Broadcast IP_

--> That means we can pick any network, in the private IP address ranges for our ethernet interface.

The private IP address ranges are:

- `192.168.0.0/16` ranging from `192.168.0.0` to `192.168.255.255`
- `172.16.0.0/12` ranging from `172.16.0.0` to `172.31.255.255`
- `10.0.0.0/8` ranging from `10.0.0.0` to `10.255.255.255`

So to prevent overlaps of addresses of the home network too we can pick a network towards the end of the most uncommon private range `172.29.0.0/24` to define a network from `172.29.0.0` to `172.29.0.255` with our Bridge getting the IP address `172.29.0.255`.

### 2.2 Interface Setup

First we only set up the ethernet interface with our chosen network settings, the DHCP server that assigns an IP address to other clients (home network router) is set up in the next step.

1. Get the interface name by inspecting the output of `ip addr`. You're looking for something like `eth0` or `enxf8e43b4f57b1`.  
   The latter being named by the new [PredictableNetworkInterfaceNames](https://www.freedesktop.org/wiki/Software/systemd/PredictableNetworkInterfaceNames/). Which, in my case `enxf8e43b4f57b1`, incorporates the interfaces's MAC address.

2. Edit the `/etc/network/interfaces` file to include the following condiguration for your interface, for me `enxf8e43b4f57b1`:  
    
    ```text
    auto enxf8e43b4f57b1
    allow-hotplug enxf8e43b4f57b1
    iface enxf8e43b4f57b1 inet static
        address 172.29.0.1
        network 172.29.0.0
        netmask 255.255.255.0
        broadcast 172.29.0.255
    ```

### 2.3 DHCP Server Setup

We need a DHCP Server to assign an IP address to our home networks router. In almost all cases our home networks router expects this. Alternatively we could configure our home network router with a static IP address in our chosen network, but that makes things more complicated when switching back to the normal WAN connection etc.

So the DHCP Server needs to know which on which interfaces it should operate/listen on, and which network we chose, so that it can assign IP addresses to clients inside that network. We do this with two config files.

1. Install the DHCP Server with `sudo apt install isc-dhcp-server`

2. To configure on which device it listens, edit the `/etc/default/isc-dhcp-server` file to include the interface name of your ethernet interface:
   
   ```text
    INTERFACES="enxf8e43b4f57b1"
   ```

3. Edit the `/etc/dhcp/dhcpd.conf` file to include the following network configuration:

    ```text
    authoritative;
    subnet 172.29.0.0 netmask 255.255.255.0 {
        range 172.29.0.2 172.29.0.254;
        option broadcast-address 172.29.0.255;
        option routers 172.29.0.1;
        option domain-name "local";
        option domain-name-servers 1.1.1.1, 8.8.8.8;
    }
    ```

    The DHCP Server also tells the clients which DNS Servers to use to look up domain names. This is what the IP Addresses `1.1.1.1` and `8.8.8.8` are used for. These refer to Cloudflare's and Google's Public DNS Servers respectively. You can choose different ones of course.

4. Check the _isc-dhcp-server_ service status and restart the service if necessary with the following commands
   - `sudo service isc-dhcp-server status`
   - `sudo service isc-dhcp-server reload`
   - `sudo service isc-dhcp-server restart`

## 3. Set up the Routing

Alright, so the first part of the routing is the _gateway_ we've set in the DHCP server config. That tells the home networks router to come to our bridge for anything outside the network.

Lets quickly imagine how the traffic would flow from our home networks router to a destination, lets say the dns server 1.1.1.1.

1. Home Network Router wants to reach 1.1.1.1
   1. This is not in the home network address range --> Go to WAN interface --> Configured Gateway is 172.29.0.1
   2. Send Packet with destination 1.1.1.1 to __MAC Address__ of 172.29.0.1
2. Our Bridge receives this Packet on the Ethernet Interface and notices that the destination IP is not equal to the interfaces own IP address.
   1. Normally this packet would therefore be dropped (ignored).
   2. In our case usecase though we want to forward the packet via the WiFi interface to our phone etc.
   3. We need to configure our Bridge to not drop this packet.
   4. --> __Step 1: Enable IP-Packet Forwarding__
3. Okay, now the packet isn't dropped, but we still need to define what happens with it
   1. We want to send it out on the WiFi interface.
   2. We also want to keep track of what we've been forwarding from the ethernet interface to the WiFi interface and only forward those back to the home networks router.
   3. Otherwise we would need to forward everything we get on the WiFi interface to the home network, even packets that we might've sent from the bridge doing updates or so.
   4. --> __Step 2: Configure Forward Path__
4. The packet was sent out and we received a response on the WiFi interface.
   1. We need to forward it back to the home network, but only for established (or related) connections, i.e. initiated by the home networks router (or clients behind it).
   2. --> __Step 3: Configure Return Path__

For the routing setup we can use _iptables_. _iptables_ can be very complex, but what we're doing here isn't too bad.

_iptables_ works with tables, where each table contains some and chains:

- table: _filter_
  - chain: INPUT
  - chain: FORWARD
  - chain: OUTPUT
- table: _nat_
  - chain: PREROUTING
  - chain: INPUT
  - chain: OUTPUT
  - chain: POSTROUTING
- table: _mangle_
  - chain: PREROUTING
  - chain: INPUT
  - chain: FORWARD
  - chain: OUTPUT
  - chain: POSTROUTING
- table: _raw_
  - chain: PREROUTING
  - chain: OUTPUT

Now lets look at how we can use it.

### 3.1 Step 1: Enable IP-Packet Forwarding

1. On the fly config with:

   ```bash
    sudo bash -c "echo 1 > /proc/sys/net/ipv4/ip_forward"
   ```

2. Make change permanent by updating `/etc/sysctl.conf` to include the following:
   
   ```text
   net.ipv4.ip_forward = 1
   ```

### 3.2 Step 2: Configure Forward Path

1. Configure packets which arrive at the ethernet interface, and are destined for another machine, to be forwarded to the WiFi interface

   ```bash
   iptables -A FORWARD -i eth0 -o wlan0 -j ACCEPT
   ```

   - `-t` is ommitted so the default _filter_ table is selected
   - `-A` selects the chain
   - `-i` selects the input interface of the packet
   - `-o` sets the output interface for the packet
   - `-j` sets the action, so that the packet is accepted (and forwarded)


2. Set up NAT to replace the "Source IP Address" in the Packet with the IP address of the WiFi interface and make a note in the local nat table for later, so that the real source is known when a response returns.

   ```bash
   iptables -t nat -A POSTROUTING -o wlan0 -j MASQUERADE
   ```

   - `-t` selects the _nat_ table
   - `-A` selects the chain
   - `-o` selects the output interface of the packet
   - `-j` sets the action, so that the source IP address is masqueraded/replaced with the WiFi interfaces IP address.

### 3.3 Step 3: Configure Return Path

1. Right after a return packet arrives at the WiFi interface our NAT configuration picks it up and changes the destination IP address back to the home network router on the ethernet interface, automatically.
2. Now we still need to configure that packets which arrive at the WiFi interface, destined for another machine (now the home network router again), to be forwarded on the ethernet interface.
   This should only happen thoug for established and related connections, since we don't want to allow new connections to our home network router to be initiated from the outside. 
   For this we can use the _state_ module.

   ```bash
   iptables -A FORWARD -i wlan0 -o eth0 -m state --state ESTABLISHED,RELATED -j ACCEPT
   ```

   - `-t` is ommitted so the default _filter_ table is selected
   - `-A` selects the chain
   - `-i` selects the input interface of the packet
   - `-o` sets the output interface for the packet
   - `-m` loads an additional module required for this rule
   - `--state` defines under which circumstances, wrt. to the connection state, the rule applies
   - `-j` sets the action, so that the packet is accepted (and forwarded)

### Routing Summary

```bash
sudo bash -c "echo 1 > /proc/sys/net/ipv4/ip_forward" # only temporary, edit /etc/sysctl.conf to make change permanent

iptables -A FORWARD -i eth0 -o wlan0 -j ACCEPT
iptables -t nat -A POSTROUTING -o wlan0 -j MASQUERADE
iptables -A FORWARD -i wlan0 -o eth0 -m state --state ESTABLISHED,RELATED -j ACCEPT
```

- `-t` selects the table, _filter_ is the default if the option is not specified
- `-A` selects the chain
- `-i` the input interface of the packet
- `-o` the output interface of the packet
- `-j` the action
- `-m` loads an additional module required for this rule
- `--state` defines under which circumstances wrt to the connection state the rule applies

---

Now that should be it!  

You can monitor the traffic flowing across the Bridge via `iftop`, or by opening the System Monitor.
