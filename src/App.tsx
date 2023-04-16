import { useState, useEffect } from "react"
import click_ from "./assets/click.mp3"
import break_ from "./assets/break.mp3"
import work_ from "./assets/work.mp3"

export const App = () => {
  const [isTime, setTime] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)
  const [currentState, setCurrentState] = useState("work")
  const [cycles, setCycles] = useState(0)

  useEffect(() => {
    let timerId: number
    if (isActive && isTime > 0) {
      timerId = setInterval(() => setTime(isTime - 1), 1000)
    } else if (isActive && isTime === 0) {
      if (currentState === "work") {
        setCycles(cycles + 1)
        if (cycles % 4 === 0 && cycles != 0) {
          setCurrentState("long break")
          setTime(15 * 60)
          playSound(work_)
        } else {
          setCurrentState("break")
          setTime(5 * 60)
          playSound(break_)
        }
      } else if (currentState === "break" || currentState === "long break") {
        setCurrentState("work")
        setTime(25 * 60)
        playSound(work_)
      }
    }
    return () => clearInterval(timerId)

  }, [isTime, isActive, cycles, currentState])

  const playSound = (soundPath: string) => {
    new Audio(soundPath).play()
  }

  function getTime(time: number) {
    const min = Math.floor(time / 60)
    const sec = time % 60
    return `${min < 10 ? "0" + min : min}:${sec < 10 ? "0" + sec : sec} `
  }
  const handleReset = () => {
    setCurrentState("work")
    setTime(25 * 60)
    setIsActive(false)
    setCycles(0)
  }

  return (
    <div className=" w-full h-screen bg-slate-950 text-slate-50 flex justify-center items-center flex-col space-y-10">
      <div className="text-5xl font-bold">Timer</div>
      <div className="flex space-x-5 bg-slate-800 p-2 rounded-full">
        {["work", "break", "long break"].map((type) => (
          <button
            key={type} className={`text-xl px-5 py-2 rounded-full duration-150 font-mono ${currentState === type ? "bg-slate-700" : "bg-transparent"}`}
            onClick={() => {
              setCurrentState(type)
              setIsActive(false)
              setTime(type === "work" ? 25 * 60 : type === "break" ? 5 * 60 : 15 * 60)
              playSound(click_)
            }}
          >
            {type.split(" ").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ")}
          </button>
        ))}
      </div>
      <div className="font-mono font-bold text-9xl ">
        {getTime(isTime)}
      </div>
      <div className="flex space-x-4">
        <button
          onClick={() => {
            setIsActive(!isActive)
            playSound(click_)
          }}
          className="bg-slate-800 px-10 py-5 rounded-xl text-3xl font-bold">
          {isActive ? "PAUSE" : "START"}
        </button>
        <button
          onClick={() => {
            handleReset()
            playSound(click_)
          }}
          className="bg-slate-800 px-10 py-5 rounded-xl text-3xl font-bold">
          RESET
        </button>
      </div>
      <div className="text-3xl text-slate-500">Number of cycles: {cycles}</div>
    </div>
  )
}
