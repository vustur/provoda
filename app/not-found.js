'use client'
import WluffyError from "@/app/components/WluffyError"
import Button from "@/app/components/IconButton"

export default () => {
  return (
  <div className="w-[100vw] h-[80vh]">
        <WluffyError
            image="wluffy_with_box_light.png"
            textOne="404"
            textTwo="Looks like you lost..."
            buttonText="Return"
            buttonFunc={() => window.location = "/"}
        />
  </div>
  )
}