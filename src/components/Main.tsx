import React, { useState, useEffect, useRef } from 'react'
import { Widgets } from '../types'

type IProps = {
    widgets: Widgets[]
}

const Main = ({widgets}: IProps) => {

    const refWidgets = useRef<HTMLDivElement[] | null>([])

    console.log(refWidgets)
    useEffect(() => {
        if (widgets.length) {

            refWidgets.current = refWidgets.current.slice(0, widgets.length);
        }
    }, [widgets])

    return (
        <div className="header">
            {
                widgets.map((widget, index) => (
                    <div key={widget.id} ref={(ref) => refWidgets.current[index] = ref}  className="header__item">
                        {widget.text}
                    </div>
                ))
            }
        </div>
    )
}

export default Main
