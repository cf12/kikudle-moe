import { createClient } from "@supabase/supabase-js"
import fetch from "node-fetch"
import { GraphQLClient, gql } from "graphql-request"
import mysql from "mysql2/promise"
import dotenv from "dotenv"

type Anime = {
  id: number
  name: string
  url: string
  date?: Date
}

dotenv.config()

function shuffle(array: any[]) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

const client = new GraphQLClient("https://graphql.anilist.co/")

const supabaseUrl = "https://fiztxwdqgnunsppccyti.supabase.co"
const supabaseKey = process.env.SUPABASE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

;(async () => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "root",
  })

  let anime: Anime[] = []

  const topAnilist = (
    await client.request(gql`
      {
        Page(page: 1, perPage: 100) {
          media(type: ANIME, sort: POPULARITY_DESC) {
            id
            idMal
          }
        }
      }
    `)
  ).Page.media

  for (const entry of topAnilist) {
    const { id, idMal }: { id: number; idMal: number } = entry

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

    let hash = new Set()

    Object.values(rows)
      .sort((a, b) => {
        return b.resolution - a.resolution || b.size - a.size
      })
      .forEach(({ slug, basename }: { basename: string; slug: string }) => {
        if (!hash.has(slug)) {
          hash.add(slug)
          anime.push({
            id,
            name: slug,
            url: `https://animethemes.moe/video/${basename}`,
          })
        }
      })
  }

  let date = new Date()
  anime = shuffle(anime).map((anime: Anime) => {
    anime.date = date

    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() + 1)
    date = newDate

    return anime
  })

  console.log(anime)

  const { data, error } = await supabase.from("solutions").upsert(anime)

  if (error) console.error(error)
  else console.log(data)

  await connection.end()
})()
