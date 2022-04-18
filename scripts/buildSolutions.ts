import { createClient } from "@supabase/supabase-js"
import fetch from "node-fetch"
import { GraphQLClient, gql } from "graphql-request"
import mysql from "mysql2/promise"
import dotenv from "dotenv"
import { Connection } from "mysql2"
import seedrandom from 'seedrandom'

type Anime = {
  id: number
  name: string
  url: string
  date?: Date
}

dotenv.config()
seedrandom(process.env.SEED || 'test_seed_do_not_use', {global: true})

const client = new GraphQLClient("https://graphql.anilist.co/")

const supabaseUrl = "https://fiztxwdqgnunsppccyti.supabase.co"
const supabaseKey = process.env.SUPABASE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

const NUM_PAGES = 5

function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

;(async () => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "root",
  })

  let anime: Anime[] = []

  for (let i = 1; i <= NUM_PAGES; i++) {
    const res = await client.request(gql`
      {
        Page(page: ${i}, perPage: 50) {
          media(type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
            id
            idMal
          }
        }
      }
    `)

    for (const entry of res.Page.media) {
      const { id, idMal }: { id: number; idMal: number } = entry

      let hash = new Set()
      let [rows, fields] = await connection.execute(
        `
        SELECT DISTINCT at2.slug, v.basename, v.size, v.resolution FROM resources r
          JOIN anime_resource ar ON r.resource_id = ar.resource_id 
          JOIN anime_themes at2 ON ar.anime_id = at2.anime_id 
          JOIN anime_theme_entries ate ON at2.theme_id = ate.theme_id 
          JOIN anime_theme_entry_video atev ON ate.entry_id = atev.entry_id 
          JOIN videos v ON atev.video_id = v.video_id 
        WHERE 
          (r.external_id = ? AND r.site = 3) OR
          (r.external_id = ? AND r.site = 7);
        `,
        [id, idMal]
      )

      Object.values(rows)
        .filter(({ slug }) => slug.includes('OP'))
        .sort((a, b) => {
          return b.resolution - a.resolution || b.size - a.size
        })
        .forEach(({ slug, basename }: { basename: string; slug: string }) => {
          if (!hash.has(slug)) {
            // Update hash
            hash.add(slug)

            // Push to ret
            anime.push({
              id,
              name: slug,
              url: `https://animethemes.moe/video/${basename}`,
            })
          }
        })
    }
  }

  // Shuffle by breakpoints
  shuffle(anime)

  // Populate dates
  let date = new Date()
  anime = anime.map((entry) => {
    entry.date = date

    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() + 1)
    date = newDate

    return entry
  })

  // const { data, error } = await supabase.from("solutions").upsert(anime)
  // if (error) console.error(error)
  // else console.log(data)

  await connection.end()
})()
