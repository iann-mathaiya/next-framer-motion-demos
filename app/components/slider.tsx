"use client"
import { useEffect, useState } from "react"
import useMeasure from "react-use-measure"
import { MotionConfig, motion, useMotionValue, useTransform } from "framer-motion"
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/20/solid"

export default function AnimatedSlider() {

    let initialHeight = 4
    let height = 12
    let buffer = 12
    let [ref, bounds] = useMeasure()
    let progress = useMotionValue(0.5)
    let [hovered, setHovered] = useState(false)
    let [panning, setPanning] = useState(false)
    let width = useTransform(progress, (v) => `${v * 100}%`)
    let roundedProgress = useTransform(progress, (v) => `${roundTo(v * 100, 0)}%`)

    let [progressState, setProgressState] = useState(roundedProgress.get())

    let state = panning ? "panning" : hovered ? "hovered" : "idle"

    useEffect(() => {
        roundedProgress.onChange((v) => setProgressState(v))
    }, [roundedProgress])

    return (
        <MotionConfig transition={{ type: "spring", bounce: 0, duration: 0.3 }}>
            <div className="flex items-center justify-center h-full">
                <div className="w-[390px] h-[200px] px-8 bg-gray-800 rounded flex flex-col justify-center">
                    <div className="flex flex-1 flex-col items-center justify-center">
                        <div className="flex items-center justify-center w-full">
                            <motion.div
                                initial={false}
                                animate={{ color: hovered || panning ? "rgb(255,255,255)" : "rgb(120,113,108)" }}
                                className="flex justify-start shrink-0 w-6"
                            >
                                <SpeakerXMarkIcon className="w-4 h-4" />
                            </motion.div>

                            <motion.div
                                ref={ref}
                                animate={state}
                                onPointerEnter={() => setHovered(true)}
                                onPointerDown={() => setPanning(true)}
                                onPointerLeave={() => setHovered(false)}
                                onPan={(event, info) => {
                                    let deltaInPercent = info.delta.x / bounds.width
                                    let newPercent = clamp(progress.get() + deltaInPercent, 0, 1)
                                    progress.set(newPercent)
                                }}
                                onPanEnd={() => setPanning(false)}
                                style={{ height: height + buffer }}
                                className="relative w-full flex items-center justify-center"
                            >
                                <motion.div
                                    initial={false}
                                    variants={{
                                        idle: { width: "90%", height: initialHeight },
                                        hovered: { height, width: "100%" },
                                        panning: { height, width: "100%" },
                                    }}
                                    className="relative w-full rounded-full overflow-hidden"
                                >
                                    <div className="h-full bg-white/20" />
                                    <motion.div
                                        style={{ width }}
                                        className="absolute inset-0 bg-white w-[20%]" />
                                </motion.div>
                            </motion.div>

                            <motion.div
                                initial={false}
                                animate={{ color: hovered || panning ? "rgb(255,255,255)" : "rgb(120,113,108)" }}
                                className="flex justify-end shrink-0 w-6"
                            >
                                <SpeakerWaveIcon className="w-4 h-4" />
                            </motion.div>

                        </div>

                        <motion.div
                            animate={{ color: hovered || panning ? "rgb(255,255,255)" : "rgb(120,113,108)" }}
                            className={`mt-4 text-center text-sm font-semibold tabular-nums ${panning ? "select-none" : ""} `}>
                            {progressState}
                        </motion.div>

                    </div>
                </div>
            </div>
        </MotionConfig>
    )
}

let clamp = (num: number, min: number, max: number) => Math.max(Math.min(num, max), min)

function roundTo(number: number, decimals: number): number {
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals)
}
