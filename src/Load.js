import React from 'react'
import { Oval } from 'react-loader-spinner'

export default function Load() {
  return (
    <div className="height-50 flex-column justify-content-center align-items-center">
        <Oval
            height={60}
            width={60}
            color="#4fa94d"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor="#4fa94d"
            strokeWidth={2}
            strokeWidthSecondary={2}
        />
    </div>
  )
}
