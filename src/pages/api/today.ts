import { createClient } from "@supabase/supabase-js"
import type { NextApiRequest, NextApiResponse } from "next"
import fetch from "node-fetch"
import qs from "qs"

// Ensure env variables are set
if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY
) {
  console.error("Environment vars missing")
  process.exit(-1)
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { data, error } = await supabase
      .from("solutions_today")
      .select("*")
      .order("date", { ascending: false })
      .limit(1)

    if (error) {
      throw error
    } else if (!data[0]) {
      res.status(404).json({ error: "No entries found" })
    } else {
      res.status(200).json({ data: data[0] })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "An unexpected error has occurred" })
  }
}

export default handler
