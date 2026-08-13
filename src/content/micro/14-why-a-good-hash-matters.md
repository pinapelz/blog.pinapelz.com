---
title: "An interesting hashing logical bug (why you should pick a good hash to use)"
description: 'Also an example of how bugs may only appear once all the pieces come together'
pubDate: Aug 13 2026
---
This isn't an extraordinary or crazy bug, but it was interesting enough that I'd like to record it down here.

I've recently been building a Wordle like game but for music. You start with a 1 second clip, with the clip getting longer and longer with more attempts to guess the song. While there are already a lot of apps like this, a lot of them don't quite fit the use case I was looking for.

One of the big requirements I wanted to meet was keeping the core logic for the game stateless, effectively making it run like a big serverless function. Obviously the first thing you would need to tackle in this scenario is how to make it so that the correct answer for each day persists across different sessions.

Since the list of possible songs sits as a JSON in memory, for me, my first intuition would be to take the current date as a hash and then pick an index from there. So for August 13th 2026, I'd get a string that's something like this `08-13-2026` then convert that into an index.

```ts
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
}
```

As a little bit of a dependency freak, I try not to introduce deps from npm for just a single small use. I could've also used `Web Crypto API`, but honestly there's still some compatability issues with that as a non-Chromium user. In case you don't recognize the hash function above, its pretty much a copy of the Java's hashcode implementation otherwise sometimes called a Polynomial Hash.

---

The first day I deployed this project, everything went perfectly, and the same was true for the next. However, on the 3rd day I noticed something strange... For some reason, I was repeatedly getting songs from the same album.

```
Day 1: { artist: "STAYC", name: "2:LOVE", youtubeId: "HgewvBTOJwU" }
Day 2: { artist: "STAYC", name: "I WANT IT", youtubeId: "W8ml4ryPwic" }
Day 3: { artist: "STAYC", name: "STEREOTYPE", youtubeId: "Xmxcnf2v_gs" }
```

My first thought was that somehow the date wasn't changing and it had been hashing to the same date this entire time, meaning it was effectively tripping the guard I had written for duplicates

```ts
export function getDailySong(today: string): Song {
  const recentSongs = new Set(
    getLastNDates(30).map(d => pickSong(d).youtubeId)
  );
  let candidate = pickSong(today);
  let guard = 0;
  while (recentSongs.has(candidate.youtubeId) && guard < songs.length) {
    const rerollSeed = hashString(today + ":" + guard);
    const index = rerollSeed % songs.length;
    candidate = songs[index];
    guard++;
  }
  return candidate;
```

But I quickly realized that this wasn't possible since simulating the behavior of the guard locally in Python didn't yield the same order as what I had expected.

While theoretically it could have been a statistical anomaly, I knew something else had been at play here rather than the forces of the RNG gods somehow picking songs from the same album 3 days in a row. I'll save you the couple hours of scouring I did for the source of the bug, but here's how this issue happened.

First I have a seperate Python script that adds songs into this `.ts` file which stores all the potential songs.

The core logic is something like this:
```py
def extract(self, urls: list) -> list[dict[str]]:
    info = {}
    ydl_opts = {
    }
    errors = []
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        for url in urls:
            try:
                url_info = ydl.sanitize_info(ydl.extract_info(url, download=False))
                if url_info["_type"] == "video":
                    info[url_info["id"]] = url_info
                if url_info["_type"] == "playlist":
                    for entry in url_info["entries"]:
                        info[entry["id"]] = entry
            except yt_dlp.utils.DownloadError:
                errors.append(url)
    print(f"{errors=}")
    return list(info.values())
```

The processed data then gets written into `.ts` file in that order. Now that you have the full context, try to take a guess at why this was happening...

# Solution

If problem isn't apparent yet, consider the hashed date string for 3 consecutive days:
```
08-01-2026
08-02-2026
08-03-2026
```

Across all 3 days only a single character is different, and **NUMERIC** nonetheless, meaning that there is only a single difference in ascii code as well. Combine that with the polynomial hash function (which is based on shifting the charCode), this would mean that the resulting hash would be a similar number each day (like maybe 210, 212, 209).

Then, because I processed the songs album by album using the Python script, it would also mean that songs from the same album would be in consecutive indicies. This would result in the strange behavior that songs from the same album were being chosen on consecutive days!

The fix to avoid this sort of thing is also relatively easy. You can determinsitically shuffle the list of songs or choose a better hash function that results in a more varied distribution of hashcodes (i.e SHA-256).
