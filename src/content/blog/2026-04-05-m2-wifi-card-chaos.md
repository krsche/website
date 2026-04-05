---
title: "Buying the right M.2 WiFi Card for your PC is more complicated than you think!"
image: 2026-04-05-notebook-sketch.jpg
timetoreadmins: 2
slug: m2-wifi-card-chaos
date: 05.04.2026
tags: 
  - wifi
  - m.2
  - intel
  - ax210
  - ax211
  - ax201
  - be200
  - be202
  - be201
  - ai-assisted
---

I needed to add WiFi to my second home (backup-) server. Simple enough, right? Just grab the next best M.2 WiFi card off Amazon, plug it in, done.

40 minutes later...

## Step 1: Picking the actual card

Turns out not every WiFi card works with every platform. Here's what I found out, not even from the product pages, but reddit:

- **Intel BE200** — the latest and greatest (WiFi 7, 320 MHz), but reportedly has compatibility issues with AMD, and doesn't work. People even report AMD systems not even booting anymore.
- **Intel BE202** — a safer bet for AMD, but capped at 160 MHz instead of 320 MHz.
- **Intel AX211, AX201, BE201** — these use **CNVio** (v2, BE201 v3), a proprietary Intel interface. That means they _only_ work on Intel platforms. AMD? Nope.
- **Intel AX210** — the sweet spot. PCIe-based, widely compatible, works on AMD. ✅ But WIFI 6E, not 7 and a bit older.

I went with the AX210.
And for the comparison price is not even a factor, they're under 20 Euros currently. I got the AX210 from Jacob for 13 Euros incl. shipping.
## Step 2: The cables nobody tells you about

We have the card, but there are no cables included! You'd think that would be mentioned somewhere, right? No.
Also, no bundles available. Great.

You can usually buy the antenna + cable as a set. Not on Jacob, but luckily on Amazon. But there we have many options again, mostly no-name brands, but for an antenna thats ok.

But which cables do I even need? After some digging:

- **PCIe WiFi cards** use **MHF2** connectors on the card side.
- **M.2 WiFi cards** (also called NGFF — _Next Generation Form Factor_) use **MHF4** connectors. Technically M.2 is also PCIe, right, but yeah.
- The antenna side typically uses **RP-SMA** (RP = Reversed Polarity) connectors.

Buying the antenna and cables as a set, should in theory give you matching connectors on both ends. 
_In theory._ One Amazon reviewer reported his set came with an RP-SMA cable but regular SMA antennas — two male connectors, completely incompatible. Good times. :D
But thats the exception (I hope).

## Step 3: Which antenna?

Once you've figured out the cables, there's still the antenna quality to consider. Common options are **3 dBi** and **8 dBi** — higher dBi generally means better range and signal strength, so I want 8 dBi.

## The result

Total cost: **€13** for the card + **€9** for the antenna/cable set = **€22**.

Not bad at all. But for something this simple, the overhead was... a lot. Hopefully this made you laugh and maybe, just maybe some IT shop-owner reads this and creates a kit (and guide). :)

Yes there are other manufacturers, but I believe Intel WiFi chips are still the most compatible. Let me know if I'm wrong and I'll update this.

Lets see if it's plug-and-play when it arrives, or if there's more to this story :)