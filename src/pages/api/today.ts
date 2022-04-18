import { createClient } from "@supabase/supabase-js"
import type { NextApiRequest, NextApiResponse } from "next"
import { GraphQLClient, gql } from "graphql-request"
import fetch from "node-fetch"
import { URLSearchParams } from "url"
import qs from "qs"

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY
) {
  console.error("Environment vars missing")
  process.exit(-1)
}

const ANILIST_BASE_URL = "https://graphql.anilist.co"
const ANIMETHEMES_BASE_URL = "https://staging.animethemes.moe/api"
const GROUP_BLACKLIST = ["english", "dub"]
const MAX_RETRIES = process.env.MAX_RETRIES || 5

const anilist = new GraphQLClient(ANILIST_BASE_URL)
const animethemes = async (path: string, params: Object) => {
  return (
    await fetch(`${ANIMETHEMES_BASE_URL}${path}?${qs.stringify(params)}`)
  ).json()
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

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
            idMal
          }
        }
      }
    `)

    ret = [...ret, ...res.Page.media]
  }

  return ret
}

const getAnime = async (anime: any[]) => {
  const find = async (external_id: number, site: string) => {
    return (
      await animethemes("/resource", {
        include: "anime",
        filter: {
          external_id,
          site,
        },
      })
    ).resources.find(({ anime }) => anime.length === 1)?.anime?.[0]
  }

  const { id, idMal } = anime[Math.floor(Math.random() * anime.length)]
  let ret

  ret = await find(id, "Anilist")

  // Fallback to MyAnimeList
  if (!ret) ret = await find(idMal, "MyAnimeList")

  return ret
}

const getVideo = async (slug: string) => {
  if (!slug) return null

  console.log("===")
  const videos = (
    await animethemes(`/anime/${slug}`, {
      include: "animethemes.animethemeentries.videos",
    })
  )?.anime?.animethemes
    ?.map((theme) => {
      if (
        theme.type !== "OP" ||
        theme.nsfw ||
        theme.spoiler ||
        GROUP_BLACKLIST.find((term) =>
          theme.group?.toLowerCase().includes(term)
        )
      )
        return []

      console.log(theme)

      const videos = theme.animethemeentries
        .map((entry) => {
          const entryVideos = entry.videos.sort((a, b) => {
            return b.resolution - a.resolution || b.size - a.size
          })

          return entryVideos.length
            ? { ...entryVideos[0], theme_id: theme.id, theme_slug: theme.slug }
            : []
        })
        .flat()
      // TODO: Filter out unavailables
      // TODO: Filter out already done

      return videos
    })
    .flat()

  console.log("===")

  console.log(videos)
  return videos && videos.length
    ? videos[Math.floor(Math.random() * videos.length)]
    : null
}

const getDatesFromToday = (days: number) => {
  const today = (new Date()).setUTCHours(0, 0, 0, 0)
  const dates = [today]

  for (let i = 1; i <= days; i++) {
    dates.push(new Date(dates[0] - i * 24 * 60 * 60 * 1000))
  }

  return dates
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.headers.authorization !== `Bearer ${process.env.API_SECRET_KEY}`) {
      res.status(401).json({ error: "Unauthorized" })
      return
    }

    const dates = []
    dates.push((new Date()).setUTCHours(0, 0, 0, 0))
    dates.push(new Date())

    const today = new Date()
    today.setTime(0)

    console.log(today)

    // const topAnilist = await getTopAnilist(10) // 10 * 50 = top 500 anime
    const topAnilist = [
      {
        id: 21,
      },
    ]
    let retries = MAX_RETRIES
    let anime, video

    do {
      anime = await getAnime(topAnilist)
      console.log(`retry ${retries}`)
      console.log(anime)
      video = await getVideo(anime?.slug)
      retries--
    } while (!video && retries > 0)

    if (!video) throw new Error("Could not find theme")

    console.log(anime)
    console.log(video)

    const { id: anime_id } = anime
    const { link: url, id: video_id, theme_id, theme_slug } = video

    res.status(200).json({ anime_id, theme_id, theme_slug, video_id, url })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "An unexpected error has occurred" })
  }
}

export default handler
