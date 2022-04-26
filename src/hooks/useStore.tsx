import request from "graphql-request"
import create from "zustand"
import { persist } from "zustand/middleware"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)

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
      solutionDate: null,
      gameState: GameState.LOADING,

      previous: {},

      reset: () => {
        const { previous, answers, gameState, solutionDate, solution } = get()

        if (solution) {
          previous[solutionDate] = {
            attempts: answers.length,
            solutionId: solution.id,
            gameState,
          }
        }

        set({
          answers: [],
          solution: null,
          solutionDate: null,
          gameState: GameState.LOADING,
          previous,
        })
      },

      init: async () => {
        const { solution, solutionDate, reset } = get()
        const { url, anilist_id, date } = (
          await (await fetch("/api/today")).json()
        ).data

        if (solution && solutionDate !== date) {
          console.log("[i] New day, new solution!")
          reset()
        } else if (solution) {
          return
        }

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
          solutionDate: date,
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
