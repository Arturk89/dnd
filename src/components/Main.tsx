import React, { useState, useEffect, useRef } from 'react'
import { Widgets } from '../types'

type IProps = {
    widgets: Widgets[]
}

const DropClass = "drop__element";
const HeaderClass = "header__item";
const STATIC_WIDTH = 300;
const STATIC_HEIGHT = 150;


const Main = ({widgets}: IProps) => {

    const [currentDrag, setCurrentDrag] = useState<any | null>(null) 
    const [dropElements, setDropElements] = useState<any[]>([])
    const [positionX, setPositionX] = useState<number>(500);
    const [positionY, setPositionY] = useState<number>(500);
    const [isPlaceholder, setIsPlaceholder] = useState<boolean>(false);
    const refWidgets = useRef<any>([])
    const mainContent = useRef<any>()
    let REAL_WIDTH: number;
    let REAL_HEIGHT: number;

    useEffect(() => {
        if (widgets.length) {
            refWidgets.current = refWidgets.current.slice(0, widgets.length);
        }
    }, [widgets])

    //update X,Y
    const setXY = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        const content = mainContent.current.getBoundingClientRect();
        

        if (e.clientX > content.left + (getContentSize().width / 3) / 2 && e.clientX < content.right - (getContentSize().width / 3) / 2) {
            setPositionX(e.clientX)
        } 
        if (e.clientY > content.top + (getContentSize().height / 2) / 2  && e.clientY < content.bottom - (getContentSize().height / 2) / 2) {
            setPositionY(e.clientY)
        }  
    }

    const chekGhostDiv = () => {
        const content = mainContent.current.getBoundingClientRect();

        if (positionY < content.top +  (getContentSize().height / 2) / 2) return false
        if (positionY > content.bottom - (getContentSize().height / 2) / 2) return false
        if (positionX < content.left + (getContentSize().width / 3) / 2) return false
        if (positionX > content.right - (getContentSize().width / 3) / 2) return false



        return true
    }

    const getContentSize = () => {
        const content = mainContent.current.getBoundingClientRect();
        return content;
    }

    const dragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {

        const currentElement = refWidgets.current[index];
        setCurrentDrag(currentElement)
        // setCurrentDrag(currentElement)
        const copyElement = currentElement.cloneNode(true) as HTMLDivElement
        // copyElement.style.backgroundColor = 'red'
        if (copyElement) setCurrentDrag(copyElement)

        const ghost = document.createElement('div');
        ghost.classList.add('ghost__element');
        document.body.appendChild(ghost);
        e.dataTransfer.setDragImage(ghost, STATIC_WIDTH / 2, STATIC_HEIGHT / 2)

    }

    const createDiv = (x: number, y: number) => {
            const  placedDiv = document.createElement('div');
            placedDiv.classList.add('placeholder')
            placedDiv.classList.add('test')
            placedDiv.style.top = x + "px";
            placedDiv.style.left = y + "px";
            //@ts-ignore
            placedDiv.ref = "asd"
            mainContent.current.appendChild(placedDiv)
            setIsPlaceholder(true)
    }

    const updateDiv = (x: number, y: number) => {
        const div = document.querySelector('.test') as HTMLDivElement;

        

        if(!chekGhostDiv()) return

        if (div) {
            div.style.top = y + "px";
            div.style.left = x + "px";
        }
    }

    const dragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()


    
            const contentX = getContentSize().x
            const contentY = getContentSize().y
    
            const placeX = positionX - contentX - ((getContentSize().width / 3) / 2);
            const placeY = positionY - contentY - ((getContentSize().height / 2) / 2);
    
            if (!isPlaceholder) {
                createDiv(placeX, placeY)
            } else {
                updateDiv(placeX, placeY)
            }  
        } 
    

    const drop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const test = document.querySelector('.test') as HTMLDivElement;
        mainContent.current.removeChild(test)
        setIsPlaceholder(false)
       
        const contentX = getContentSize().x
        const contentY = getContentSize().y

        const left = positionX - contentX - ((getContentSize().width / 3) / 2)
        const top = positionY - contentY -  ((getContentSize().height / 2) / 2)

        if (mainContent?.current) {
            currentDrag.classList.remove(HeaderClass)
            currentDrag.classList.add(DropClass)
            currentDrag.style.top = top + "px"
            currentDrag.style.left = left + "px"
            currentDrag.onmousedown=(e: any) => resize(e);
            mainContent.current.appendChild(currentDrag)
        }

        setDropElements([...dropElements, currentDrag])
        setCurrentDrag(null)
    }

    const resize = (e: any) => {
        console.log('resize', e);
    }

       
    return (
        <>
            <div className="header">
                {
                    widgets.map((widget, index) => (
                        <div draggable 
                        // onDragCapture={(e: React.DragEvent<HTMLDivElement>) => calcXY(e)}
                        onDrag={(e: React.DragEvent<HTMLDivElement>) => setXY(e, index)} 
                        onDragStart={(e: React.DragEvent<HTMLDivElement>) => dragStart(e, index)} 
                        key={widget.id} 
                        ref={(ref) => refWidgets.current[index] = ref}  
                        className="header__item">
                            {widget.text}
                        </div>
                    ))
                }
            </div>

            <div className="main">
                <div onDragOver={dragOver} onDrop={drop} className="main__content" ref={mainContent}>
                    {/* <div className="placeholder"></div> */}
                </div>
            </div>
        </>
    )
}

export default Main


/*
    //pobranie elementu ref do state


*/
