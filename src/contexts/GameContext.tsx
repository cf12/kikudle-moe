import { createContext } from "react"

const GameContext = createContext({
  // Game stage:
  // 0 - 2 seconds
  // 1 - 5 seconds
  // 2 - 10 seconds
  // 3 - 20 seconds
  // 4 - 35 seconds
  stage: 0,
})

export default GameContext