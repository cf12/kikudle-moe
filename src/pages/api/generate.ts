import { createClient } from "@supabase/supabase-js"
import { gql, GraphQLClient } from "graphql-request"
import type { NextApiRequest, NextApiResponse } from "next"
import fetch from "node-fetch"
import qs from "qs"
import dayjs from "dayjs"
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

// Ensure env variables are set
if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY ||
  !process.env.API_SECRET_KEY
) {
  console.error("Environment vars missing")
  process.exit(-1)
}

// Constants
const ANILIST_API_URL = "https://graphql.anilist.co"
const ANIMETHEMES_API_URL = "https://staging.animethemes.moe/api"
const ANIMETHEMES_VIDEO_URL = "https://animethemes.moe/video"

const GROUP_BLACKLIST = ["english", "dub"]
const MAX_RETRIES = process.env.MAX_RETRIES || 5

// Client helpers
const anilist = new GraphQLClient(ANILIST_API_URL)
const animethemes = async (path: string, params: Object) => {
  return (
    await fetch(`${ANIMETHEMES_API_URL}${path}?${qs.stringify(params)}`)
  ).json()
}
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Helper functions
const getTopAnilist = async (pages = 1) => {
  let ret = []

  for (let i = 1; i <= pages; i++) {
    const res = await anilist.request(gql`
      {
        Page(page: ${i}, perPage: 50) {
          media(type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
            title {
              romaji
            }
            id
          }
        }
      }
    `)

    ret = [...ret, ...res.Page.media]
  }

  return ret
}

const getAnime = async (anime: any[]) => {
  const find = async (external_id: number) => {
    return (
      await animethemes("/resource", {
        include: "anime",
        filter: {
          external_id,
          site: "Anilist",
        },
      })
    ).resources.find(({ anime }) => anime.length === 1)?.anime?.[0]
  }

  const { id } = anime[Math.floor(Math.random() * anime.length)]
  let ret

  ret = await find(id)

  return { ...ret, anilist_id: id }
}

const getVideo = async (slug: string, existingThemeIds: number[]) => {
  if (!slug) return null

  let videos = []

  const themes = (
    await animethemes(`/anime/${slug}`, {
      include: "animethemes.animethemeentries.videos",
    })
  )?.anime?.animethemes

  for (const theme of themes) {
    if (
      theme.type !== "OP" ||
      theme.nsfw ||
      theme.spoiler ||
      GROUP_BLACKLIST.find((term) =>
        theme.group?.toLowerCase().includes(term)
      ) ||
      existingThemeIds.includes(theme.id)
    )
      continue

    for (const entry of theme.animethemeentries) {
      // Get best video based on resolution & size
      const video = entry.videos.sort((a, b) => {
        return b.resolution - a.resolution || b.size - a.size
      })[0]

      if (!video) continue

      videos.push({
        url: `${ANIMETHEMES_VIDEO_URL}/${video.basename}`,
        video_id: video.id,
        theme_id: theme.id,
        theme_slug: theme.slug,
      })
    }
  }

  // Find candidate
  const candidate = videos[Math.floor(Math.random() * videos.length)]
  if (!candidate) return null

  // Check if video is valid
  const testRes = await fetch(candidate.url)
  return testRes.status === 200 && candidate
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.headers.authorization !== `Bearer ${process.env.API_SECRET_KEY}`) {
      res.status(401).json({ error: "Unauthorized" })
      return
    }

    const date = dayjs.utc().format('YYYY-MM-DD')

    // Check if solution for today already exists
    const { data: existingData } = await supabase
      .from("solutions_today")
      .select("*")
      .eq("date", date)

    if (existingData?.length) {
      console.log(`[i] Found existing entry for ${date}`)
      res.status(409).json({ data: `Found existing entry for ${date}` })
      return
    }

    // Get existing theme ids
    const existingThemeIds = (
      await supabase.from("solutions_today").select("theme_id")
    ).data?.map((entry) => entry.theme_id)

    // Generate new solution
    const topAnilist = await getTopAnilist(10) // 10 * 50 = top 500 anime
    let retries = MAX_RETRIES
    let anime, video

    do {
      anime = await getAnime(topAnilist)
      console.log(`[i] Retries remaining: ${retries}`)
      video = await getVideo(anime?.slug, existingThemeIds)
      // console.log(anime)
      // console.log(video)
      retries--
    } while (!video && retries > 0)

    if (!video) throw new Error("Could not find theme")

    const { anilist_id, anime_id } = anime
    const { url, video_id, theme_id, theme_slug } = video
    const data = {
      date,
      anilist_id,
      theme_id,
      theme_slug,
      video_id,
      url,
    }

    console.log(`[i] Found valid anime: #${anilist_id}`)
    console.log(`[i] Found valid theme: #${theme_id}`)

    // Commit to Supabase
    const { error } = await supabase.from("solutions_today").insert(data)
    if (error) throw error

    console.log("[i] Committed to Supabase")

    res.status(200).json({
      data,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "An unexpected error has occurred" })
  }
}

export default handler
