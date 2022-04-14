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

        set({
          solution: {
            video:
              "https://animethemes.moe/video/ShingekiNoKyojinS4-OP1-NCBD1080.webm",
            id: 110277,
            title: {
              romaji: "Shingeki no Kyojin: The Final Season",
              english: "Attack on Titan Final Season",
              native: "進撃の巨人 The Final Season",
            },
            coverImage: {
              medium:
                "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx110277-qDRIhu50PXzz.jpg",
            },
            seasonYear: 2021,
            season: "WINTER",
            genres: ["Action", "Drama", "Fantasy", "Mystery"],
            averageScore: 88,
            rankings: [
              {
                rank: 13,
                type: "RATED",
                format: "TV",
                allTime: true,
              },
              {
                rank: 21,
                type: "POPULAR",
                format: "TV",
                allTime: true,
              },
              {
                rank: 1,
                type: "RATED",
                format: "TV",
                allTime: false,
              },
              {
                rank: 2,
                type: "POPULAR",
                format: "TV",
                allTime: false,
              },
            ],
          },
        })
        set({ gameState: GameState.PLAYING })
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
      name: "kikudle-store"
    }
  )
)

useStore.subscribe(console.log)

export default useStore
