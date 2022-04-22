import request from "graphql-request"
import create from "zustand"
import { persist } from "zustand/middleware"

const MAX_STAGES = 5

export enum GameState {
  LOADING = "LOADING",
  PLAYING = "PLAYING",
  WIN = "WIN",
  LOSE = "LOSE",
}

const useStore = create(
  persist(
    (set, get) => ({
      answers: [],
      solution: null,
      gameState: GameState.LOADING,

      init: async () => {
        const { solution } = get()

        if (solution) return

        // TODO: Gamestate for no data / when this fails
        const { url, anilist_id } = (await (await fetch("/api/today")).json())
          .data
        const anilistData = await request(
          "https://graphql.anilist.co/",
          `
          {
            Media(type: ANIME, id: ${anilist_id}) {
              id
              title {
                romaji
                english
                native
              }
              seasonYear
              season
              genres
              popularity
              rankings {
                id
                rank
                type
                allTime
              }
              averageScore
            }
          }
          `
        )

        set({
          solution: { ...anilistData.Media, video: url },
          gameState: GameState.PLAYING,
        })
      },

      submit: (answer) => {
        set((state) => ({
          answers: [...state.answers, answer],
        }))

        const { solution, answers } = get()

        if (answer && answer.id === solution.id) {
          set({
            gameState: GameState.WIN,
          })
        } else if (answers.length === MAX_STAGES) {
          set({
            gameState: GameState.LOSE,
          })
        }
      },
    }),
    {
      name: "kikudle-store",
    }
  )
)

useStore.subscribe(console.log)

export default useStore
