import { NextRequest, NextResponse } from 'next/server';

/**
 * Social Media Stats API Endpoint
 *
 * Aggregates followers and viewer counts across:
 * - YouTube
 * - TikTok
 * - Facebook
 * - Kick
 *
 * Each fetch* function below is stubbed with 0s and a commented-out real
 * API call. To go live, add the relevant keys to your environment
 * (Vercel → Project Settings → Environment Variables) and uncomment the
 * fetch call in each function:
 *
 *   YOUTUBE_API_KEY        — Google Cloud Console → enable YouTube Data API v3
 *   TIKTOK_ACCESS_TOKEN     — TikTok for Developers → Display API
 *   FACEBOOK_PAGE_ID        — your Facebook Page's numeric ID
 *   FACEBOOK_ACCESS_TOKEN   — Meta for Developers → Page Access Token
 *   KICK_CHANNEL_SLUG       — e.g. "goldenboy" from kick.com/goldenboy
 *
 * Kick's public API doesn't require a token for basic channel stats.
 */

interface SocialStats {
  platform: 'youtube' | 'tiktok' | 'facebook' | 'kick';
  followers: number;
  viewers: number;
  handle: string;
  verified: boolean;
  lastUpdated: string;
}

async function fetchYouTubeStats(): Promise<SocialStats> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return { platform: "youtube", followers: 0, viewers: 0, handle: "@goldenboy_mj", verified: true, lastUpdated: new Date().toISOString() };
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&forHandle=goldenboy_mj&key=${apiKey}`,
      { next: { revalidate: 300 } }
    );
    const json = await res.json();
    const stats = json.items?.[0]?.statistics;

    return {
      platform: "youtube",
      followers: Number(stats?.subscriberCount ?? 0),
      viewers: Number(stats?.viewCount ?? 0),
      handle: "@goldenboy_mj",
      verified: true,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("YouTube stats fetch failed:", error);
    return { platform: "youtube", followers: 0, viewers: 0, handle: "@goldenboy_mj", verified: true, lastUpdated: new Date().toISOString() };
  }
}
async function fetchTikTokStats(): Promise<SocialStats> {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  const refreshToken = process.env.TIKTOK_REFRESH_TOKEN;

  if (!clientKey || !clientSecret || !refreshToken) {
    return { platform: "tiktok", followers: 0, viewers: 0, handle: "@goldenboy_za", verified: true, lastUpdated: new Date().toISOString() };
  }

  try {
    const tokenRes = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });
    const tokenJson = await tokenRes.json();
    const accessToken = tokenJson.access_token;

    const userRes = await fetch("https://open.tiktokapis.com/v2/user/info/?fields=follower_count", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userJson = await userRes.json();
    const followers = Number(userJson.data?.user?.follower_count ?? 0);

    // Sum view counts across videos. TikTok returns up to 20 videos per
    // page; we page through with the cursor until there's no more data,
    // capped at 10 pages (200 videos) so a very large account can't cause
    // this request to run indefinitely.
    let viewers = 0;
    let cursor = 0;
    let hasMore = true;
    let pageCount = 0;

    while (hasMore && pageCount < 10) {
      const videoRes = await fetch(
        `https://open.tiktokapis.com/v2/video/list/?fields=view_count`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ max_count: 20, cursor }),
        }
      );
      const videoJson = await videoRes.json();
      const videos = videoJson.data?.videos ?? [];

      for (const video of videos) {
        viewers += Number(video.view_count ?? 0);
      }

      hasMore = Boolean(videoJson.data?.has_more);
      cursor = Number(videoJson.data?.cursor ?? 0);
      pageCount += 1;

      if (videos.length === 0) break;
    }

    return { platform: "tiktok", followers, viewers, handle: "@goldenboy_za", verified: true, lastUpdated: new Date().toISOString() };
  } catch (error) {
    console.error("TikTok stats fetch failed:", error);
    return { platform: "tiktok", followers: 0, viewers: 0, handle: "@goldenboy_za", verified: true, lastUpdated: new Date().toISOString() };
  }
}

async function fetchFacebookStats(): Promise<SocialStats> {
  // const res = await fetch(
  //   `https://graph.facebook.com/v19.0/${process.env.FACEBOOK_PAGE_ID}?fields=followers_count&access_token=${process.env.FACEBOOK_ACCESS_TOKEN}`
  // );
  // const json = await res.json();
  // const followers = Number(json.followers_count ?? 0);

  return {
    platform: 'facebook',
    followers: 0, // Replace with real data
    viewers: 0, // Replace with real data
    handle: 'goldenboy.creates.za',
    verified: true,
    lastUpdated: new Date().toISOString(),
  };
}

async function fetchKickStats(): Promise<SocialStats> {
  // const res = await fetch(`https://kick.com/api/v2/channels/${process.env.KICK_CHANNEL_SLUG}`);
  // const json = await res.json();
  // const followers = Number(json.followersCount ?? 0);

  return {
    platform: 'kick',
    followers: 0, // Replace with real data
    viewers: 0, // Replace with real data
    handle: '@Goldenboy_Mj',
    verified: false,
    lastUpdated: new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  try {
    const [youtube, tiktok, facebook, kick] = await Promise.all([
      fetchYouTubeStats(),
      fetchTikTokStats(),
      fetchFacebookStats(),
      fetchKickStats(),
    ]);

    const socialMedia = [youtube, tiktok, facebook, kick];

    const totalFollowers = socialMedia.reduce((sum, platform) => sum + platform.followers, 0);
    const totalViewers = socialMedia.reduce((sum, platform) => sum + platform.viewers, 0);
    const platforms = socialMedia.length;

    return NextResponse.json(
      {
        totalFollowers,
        platforms,
        socialMedia,
        totalViewers,
        brandDeals: 0, // Would come from a CRM or manual tracking
        lastSynced: new Date().toISOString(),
      },
      {
        headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=600' },
      }
    );
  } catch (error) {
    console.error('Failed to fetch social stats:', error);
    return NextResponse.json({ error: 'Failed to fetch social media stats' }, { status: 500 });
  }
}

/**
 * Manual sync endpoint — call this to refresh stats on demand.
 * POST /api/social-media
 */
export async function POST(request: NextRequest) {
  try {
    const syncResult = await fetch(`${request.nextUrl.origin}/api/social-media`, {
      method: 'GET',
    });
    const data = await syncResult.json();

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to sync social media stats' }, { status: 500 });
  }
}
