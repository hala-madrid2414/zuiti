"use client"

import * as React from "react"
import Lottie from "lottie-react"

interface LottieIconProps {
  src: string
  className?: string
}

function LottieIcon({ src, className }: LottieIconProps) {
  const [animationData, setAnimationData] = React.useState<unknown>(null)

  React.useEffect(() => {
    fetch(src)
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Failed to load lottie:", err))
  }, [src])

  if (!animationData) {
    return <div className={className} />
  }

  return (
    <Lottie
      animationData={animationData}
      loop={true}
      autoplay={true}
      className={className}
    />
  )
}

export { LottieIcon }
