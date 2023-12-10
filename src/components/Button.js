import React from 'react'
import { Oval } from 'react-loader-spinner'

export default function Button({loading, name, onClick}) {
    if(loading){
        return(
            <div 
                style={{ borderRadius: 5 }}
                className="padding-all-10 navy-blue-bg flex-column justify-content-center align-items-center"
            >
                <Oval
                    height={25}
                    width={25}
                    color="#fff"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel='oval-loading'
                    secondaryColor="#fff"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                />
            </div>
        )
    }
  return (
    <button onClick={()=>onClick ? onClick() : null} className="submit">{name ?? 'Button'}</button>
  )
}
