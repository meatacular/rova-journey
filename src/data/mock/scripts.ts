import { Chapter } from '@/lib/types';

export const scripts = {
  traffic: {
    auckland: `Good morning Auckland. Your commute from Grey Lynn to the CBD is looking a bit slow this morning — about 27 minutes, that's roughly 9 minutes longer than usual. There's heavy congestion at the K Road and Ponsonby Road intersection as traffic merges onto the motorway. And heads up — Grafton Bridge still has that lane closure for roadworks, so give yourself a bit of extra time through there. On the way home tonight, expect the usual Spaghetti Junction slowdown heading northbound, and there's been a minor fender-bender on the Northwestern near Te Atatu that could add about 5 minutes.`,
    wellington: `Kia ora Wellington. If you're heading from Johnsonville into the CBD this morning, allow about 22 minutes — a bit longer than the usual 15 thanks to those seismic strengthening works in Ngauranga Gorge. They've got it down to a single lane, so patience is key through there. For the trip home this evening, Hutt Road will be the usual bottleneck heading north from the CBD. Allow about 25 minutes.`,
    christchurch: `Morning Christchurch! Your run from Riccarton into the CBD is sitting at about 15 minutes — not too bad, just 3 minutes over the norm. The cycleway construction on Riccarton Road has things down to one lane, so you might want to cut through Hagley Park if you're in a hurry. The drive home should be pretty smooth — just some moderate traffic on Moorhouse Avenue around 5 o'clock.`,
  },
  weather: {
    auckland: `Auckland weather this morning: 24 degrees and partly cloudy. Humidity sitting at 68 percent with a southwest breeze at 15 k's an hour. Looking ahead, it'll warm up to 26 by this afternoon with the sun breaking through. Tonight should be clear and dropping to about 20 degrees — lovely evening for the drive home.`,
    wellington: `Wellington's doing its thing — 19 degrees and windy, with northerlies gusting to 40 k's an hour. Bit of a hold-onto-your-hat kind of morning. The good news? Wind should ease off this afternoon and we might see some sun, reaching 21. This evening, expect cloud and about 15 degrees. A jacket won't go amiss for the walk to the car.`,
    christchurch: `Beautiful morning in Christchurch — 27 degrees and sunny, humidity nice and low at 45 percent. Classic Canterbury summer day ahead with temperatures pushing 29 this afternoon. Evening will be clear and still warm around 23 degrees. Gorgeous conditions for the drive home tonight.`,
    hamilton: `Hamilton's sitting at 25 degrees this morning and feeling humid — 78 percent humidity with light easterlies. Watch out this afternoon though, thunderstorms are likely around 3pm with temperatures up at 27 before dropping to 22 once the rain hits. Keep your wipers ready for the drive home.`,
  },
  news: {
    brief: `Here are today's top stories. The government has announced a two-and-a-half billion dollar transport package for Auckland, including new rapid transit corridors. In sport, Kane Williamson is back to captain the Black Caps for the England test series. And Fonterra has posted a record half-year profit as dairy prices surge.`,
    standard: `Here's your news update. Leading the headlines — the government has announced a two-and-a-half billion dollar transport package for Auckland. The funding includes new rapid transit corridors and motorway upgrades expected to cut commute times by up to 20 percent. In sport, the Black Caps have named their squad for the upcoming test series in England, with Kane Williamson returning as captain and uncapped Canterbury quick Zak Thompson earning a surprise call-up. On the business front, Fonterra has posted a record half-year profit — earnings up 22 percent, driven by strong demand from Asian markets. And in entertainment, Six60 have announced a massive stadium tour for next summer, including a return to Eden Park.`,
    detailed: `Here's your comprehensive news wrap. The government has today announced a major two-and-a-half billion dollar transport package for Auckland, featuring new rapid transit corridors and significant motorway upgrades. Officials say commute times could be reduced by up to 20 percent across the city. The opposition has called for more detail on funding sources. In education, te reo Māori immersion schools are reporting record enrolments, with a 15 percent increase for 2026 and growing waitlists in urban areas. Sport now — Cricket New Zealand has named the Black Caps squad for the upcoming test series in England. Kane Williamson returns to captain the side, and there's an exciting debut call-up for Canterbury quick Zak Thompson. Staying with sport, the Silver Ferns have claimed the Constellation Cup with a dramatic 58-56 win over Australia in Melbourne. Business — Fonterra has posted a record half-year profit, with earnings up 22 percent driven by surging Asian demand. And Auckland AI startup RouteSmart has raised 50 million dollars in Series B funding to expand across the Tasman. In entertainment, Six60 have announced a massive stadium tour across Aotearoa for next summer, and Lorde has teased a surprise new album dropping in March.`,
  },
  newsChapters: {
    brief: [
      { title: 'Auckland transport package', duration: 10, script: `Here are today's top stories. The government has announced a two-and-a-half billion dollar transport package for Auckland, including new rapid transit corridors.` },
      { title: 'Black Caps squad named', duration: 10, script: `In sport, Kane Williamson is back to captain the Black Caps for the England test series.` },
      { title: 'Fonterra record profit', duration: 10, script: `And Fonterra has posted a record half-year profit as dairy prices surge.` },
    ] as Chapter[],
    standard: [
      { title: 'Auckland transport package', duration: 15, script: `Here's your news update. Leading the headlines — the government has announced a two-and-a-half billion dollar transport package for Auckland. The funding includes new rapid transit corridors and motorway upgrades expected to cut commute times by up to 20 percent.` },
      { title: 'Black Caps squad named', duration: 15, script: `In sport, the Black Caps have named their squad for the upcoming test series in England, with Kane Williamson returning as captain and uncapped Canterbury quick Zak Thompson earning a surprise call-up.` },
      { title: 'Fonterra record profit', duration: 15, script: `On the business front, Fonterra has posted a record half-year profit — earnings up 22 percent, driven by strong demand from Asian markets.` },
      { title: 'Six60 stadium tour', duration: 15, script: `And in entertainment, Six60 have announced a massive stadium tour for next summer, including a return to Eden Park.` },
    ] as Chapter[],
    detailed: [
      { title: 'Auckland transport package', duration: 18, script: `Here's your comprehensive news wrap. The government has today announced a major two-and-a-half billion dollar transport package for Auckland, featuring new rapid transit corridors and significant motorway upgrades. Officials say commute times could be reduced by up to 20 percent across the city. The opposition has called for more detail on funding sources.` },
      { title: 'Te reo Māori schools', duration: 12, script: `In education, te reo Māori immersion schools are reporting record enrolments, with a 15 percent increase for 2026 and growing waitlists in urban areas.` },
      { title: 'Black Caps squad named', duration: 15, script: `Sport now — Cricket New Zealand has named the Black Caps squad for the upcoming test series in England. Kane Williamson returns to captain the side, and there's an exciting debut call-up for Canterbury quick Zak Thompson.` },
      { title: 'Silver Ferns win', duration: 12, script: `Staying with sport, the Silver Ferns have claimed the Constellation Cup with a dramatic 58-56 win over Australia in Melbourne.` },
      { title: 'Fonterra record profit', duration: 15, script: `Business — Fonterra has posted a record half-year profit, with earnings up 22 percent driven by surging Asian demand. And Auckland AI startup RouteSmart has raised 50 million dollars in Series B funding to expand across the Tasman.` },
      { title: 'Six60 & Lorde', duration: 18, script: `In entertainment, Six60 have announced a massive stadium tour across Aotearoa for next summer, and Lorde has teased a surprise new album dropping in March.` },
    ] as Chapter[],
  },
  sportChapters: [
    { title: 'Black Caps squad named for England', duration: 20, script: `Sport now — Cricket New Zealand has named the Black Caps squad for the upcoming test series in England. Kane Williamson returns to captain the side, with an exciting debut call-up for Canterbury quick Zak Thompson. The squad departs next week for a three-test series starting at Lord's.` },
    { title: 'Silver Ferns claim Constellation Cup', duration: 20, script: `And the Silver Ferns have claimed the Constellation Cup with a dramatic 58-56 win over Australia in Melbourne. Captain Ameliaranne Ekenasio was outstanding, scoring 42 goals from 45 attempts. It's New Zealand's first Constellation Cup since 2020.` },
    { title: 'Super Rugby preview', duration: 20, script: `Looking ahead to Super Rugby Pacific this weekend — the Blues host the Hurricanes at Eden Park in what shapes as a top-of-the-table clash. The Crusaders travel to Canberra to take on the Brumbies looking to bounce back from last week's loss to the Chiefs.` },
  ] as Chapter[],
  podcastChapters: {
    'wheres-my-money': [
      { title: 'Markets this week', duration: 60, script: `Welcome back to Where's My Money. This week we're diving into what's been happening in the markets. The NZX 50 has had a solid week, up 1.2 percent driven by strong gains from Fisher and Paykel Healthcare and Mainfreight. The Kiwi dollar is sitting at 62 US cents after the Fed held rates steady overnight.` },
      { title: 'Housing market update', duration: 60, script: `Now onto the housing market. The latest data from REINZ shows national median prices are up 3.5 percent year on year. Auckland is leading the recovery with sales volumes picking up significantly. First home buyers are back in the market in numbers we haven't seen since 2021.` },
      { title: 'KiwiSaver deep dive', duration: 60, script: `Time for our KiwiSaver deep dive. If you've been in a growth fund, you'll be happy — the average return over the past 12 months has been around 11 percent. But here's the thing — most people under 40 should still be in growth and if you're in conservative you could be leaving serious money on the table.` },
      { title: 'Listener questions', duration: 60, script: `Let's get into your questions. Sarah from Christchurch asks about investing in index funds versus actively managed funds. Great question Sarah. The data consistently shows that index funds outperform most active managers over the long term, and the fees are a fraction of what you'd pay for active management.` },
      { title: 'Wrap up', duration: 60, script: `That's all for this week on Where's My Money. Remember — time in the market beats timing the market. If you enjoyed the show, leave us a review on Apple Podcasts and share it with a friend who needs to sort their finances out. We'll see you next week.` },
    ] as Chapter[],
    'joe-rogan-experience': [
      { title: 'Opening chat', duration: 60, script: `What's up everybody. So today's guest is absolutely fascinating. We got into some wild topics — everything from AI consciousness to what's happening with space exploration. Before we get into it, this episode is brought to you by our sponsors.` },
      { title: 'AI and consciousness', duration: 60, script: `So the thing about AI that blows my mind is this question of consciousness. Like, at what point does a machine become aware? My guest was saying that we might not even recognise it when it happens because our definition of consciousness is so human-centric.` },
      { title: 'Space exploration', duration: 60, script: `And then we got into space. SpaceX is doing some incredible things with Starship. The idea that we could have people on Mars within the next decade — I mean, think about that. Twenty years ago that was pure science fiction and now it's a genuine engineering timeline.` },
      { title: 'Health and fitness', duration: 60, script: `We also talked about the latest research on zone 2 cardio. Turns out the benefits are even more significant than we thought. Just 45 minutes of zone 2 three to four times a week dramatically improves your metabolic health, mitochondrial function, and longevity markers.` },
      { title: 'Closing thoughts', duration: 60, script: `Alright that's the show. What an incredible conversation. If you enjoyed it, share it with your friends, subscribe if you haven't already, and check out the full three-hour version on Spotify. Peace.` },
    ] as Chapter[],
    'a-little-bit-extra': [
      { title: 'Weekend highlights', duration: 60, script: `Welcome to A Little Bit Extra! What a weekend it's been. We're kicking off with the biggest talking points from the past few days. First up — that drama at the awards show. Did anyone else think the speeches went on way too long? Let's get into it.` },
      { title: 'Celebrity news', duration: 60, script: `So Lorde has dropped the biggest hint yet about her new album. She posted a cryptic photo on Instagram with the caption "March" and fans are absolutely losing it. If the rumours are true, this could be her most experimental work yet.` },
      { title: 'Reality TV recap', duration: 60, script: `Now let's talk reality TV. The latest season of The Block NZ wrapped up and the results were dramatic. The winning couple took home over 200 thousand dollars in profit. But the real story was the controversy around the landscaping budget — some fans are calling it the biggest scandal in Block history.` },
      { title: "What we're watching", duration: 60, script: `Our pick of the week — if you haven't started watching the new series on TVNZ Plus, you're missing out. It's a Kiwi-made thriller set in Queenstown and the reviews are absolutely glowing. Think Top of the Lake meets Broadchurch with stunning New Zealand scenery.` },
      { title: 'Sign off', duration: 60, script: `That's your lot for today. Thanks for hanging out with us. Don't forget to follow us on all the socials and hit subscribe so you never miss an episode. Catch you next time!` },
    ] as Chapter[],
  },
  ad: [
    'Brought to you by Woolworths — everyone deserves quality.',
    'This journey is powered by Z Energy — feel the good energy.',
    'Thanks to ASB Bank — here for your ambition.',
  ],
};
