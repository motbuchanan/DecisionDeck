GARRETT'S CREATURE GUIDE
========================

A field guide + creature maker for Garrett's invented creatures.
Single self-contained web app. No build step, no install, no accounts.

FILES
-----
creature-guide.html   The whole app (icon is baked in, so this one file is all you need)
icon-180.png          App icon, 180px (optional - already embedded in the HTML)
icon-512.png          App icon, 512px (optional)

PUT IT ONLINE
-------------
Drop creature-guide.html into your GitHub the same way as your other pages,
e.g. motbuchanan.github.io/creatures/ . It needs a real web address (not a file
opened from Files) for the home-screen install to work right.

ADD TO THE IPAD HOME SCREEN
---------------------------
1. Open the link in SAFARI on the iPad (Safari specifically - this is what reads
   the app icon and full-screen behavior).
2. Tap Share, then "Add to Home Screen."
3. It shows the strawberry icon and the name "Creatures." Tap Add.
It opens full screen with no browser bars, like a real app.

SAVING / BACKUP
---------------
Creatures save on that one iPad, in the app's own storage. iOS can clear that
storage if the device gets tight on space or sits unused a long time, so treat
the iPad as the working copy, not the vault.
- Tap "Backup" now and then to download a .json of everything (saves to Files).
- "Restore" loads a backup .json back in.
The backup format is the same shape a future Firebase sync would read, like
Garrett's Buddy.

WHAT'S IN IT
------------
- Gallery / field guide with one page per creature.
- Maker with a live creature that reacts as he builds it.
- Body Shape editor: drag the 12 dots to sculpt the silhouette, plus width/height
  sliders and starting shapes. Stays a smooth creature no matter what.
- Colors, eyes, mouth, arms, markings, accessories.
- Hairstyles (14 styles: bowl, braids, spiky, pigtails, curly, mohawk, long, buns,
  bangs, pony, tuft, swoosh, wavy) the hair base always matches the body color, with a separate tip color for combos
  like purple braids with yellow tips. A soft shadow keeps the hair readable.
- Two toppings per creature (a matching pair), big categorized flavor emoji library.
- Birthday: tap a big kid-friendly calendar (future days are blocked). The guide page
  and the live maker show the creature's current age ("5 days old", "2 months old").
- Personality traits that change how the creature idles and what floats around it.
- Skills it knows, each with "taught by" linking to another creature (the lineage).
- Loves / dislikes / sound (tap the creature to hear it) / story.
- Collapsible form sections so it stays short.

NOTES FOR NEXT PASS
-------------------
- Eyes/mouth sit lower-center of any shape; adding draggable face placement is the
  natural next control if matching his creatures needs it.
- A real drawn "jelly" topping (and other signature flavors) would beat leaning on
  emoji for his key flavors.
- Watch which form sections and slots he actually uses, then trim/reorder.
