import React, { useState, useEffect, useRef } from 'react'
import { Widgets } from '../types'

type IProps = {
    widgets: Widgets[]
}

type MouseDown = {
    isDown: boolean,
    x: number,
    y: number
}

type DropElements = {
    text?: string,
    className: string,
    height: number,
    left: number,
    top: number,
    width: number
}

const DropClass = "drop__element";
const HeaderClass = "header__item";
const redOver = "isOver"
const STATIC_WIDTH = 300;
const STATIC_HEIGHT = 150;


const Main = ({widgets}: IProps) => {

    const [currentDrag, setCurrentDrag] = useState<HTMLDivElement | null>(null) 
    const [dropElements, setDropElements] = useState<any[]>([])
    const [positionX, setPositionX] = useState<number>(500);
    const [positionY, setPositionY] = useState<number>(500);
    const [mouseDownXY, setMouseDownXY] = useState<MouseDown>({isDown: false, x: 0, y: 0})

    const [isPlaceholder, setIsPlaceholder] = useState<boolean>(false);
    const [isThrottled, setIsThrottled] = useState<boolean>(false)
    const [isResized, setIsResized] = useState<boolean>(false)
    const [isOver, setIsOver] = useState<any>()


    const refWidgets = useRef<any>([])
    const mainContent = useRef<any>()
    const dropItems = useRef<any[]>([])

    useEffect(() => {
        if (widgets.length) {
            refWidgets.current = refWidgets.current.slice(0, widgets.length);
        }
    }, [widgets])



    //update X,Y
    const setXY = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        const content = mainContent.current.getBoundingClientRect();
    

        if (e.clientX > Math.floor(content.left + (getContentSize().width / 3) / 2) && e.clientX < Math.floor(content.right - (getContentSize().width / 3) / 2)) {
            setPositionX(e.clientX)
        } 
        if (e.clientY > Math.floor(content.top + (getContentSize().height / 2) / 2)  && e.clientY < Math.floor(content.bottom - (getContentSize().height / 2) / 2)) {
            setPositionY(e.clientY)
        }  
    }

    const chekGhostDiv = () => {
        const content = mainContent.current.getBoundingClientRect();

        if (positionY < Math.floor(content.top +  (getContentSize().height / 2) / 2)) return false
        if (positionY > Math.floor(content.bottom - (getContentSize().height / 2) / 2)) return false
        if (positionX < Math.floor(content.left + (getContentSize().width / 3) / 2)) return false
        if (positionX > Math.floor(content.right - (getContentSize().width / 3) / 2)) return false



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
        e.dataTransfer.setDragImage(ghost, Math.floor(STATIC_WIDTH / 2), Math.floor(STATIC_HEIGHT / 2))

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

        if(!isThrottled) {
            setIsThrottled(true);
            checkIsAbove()
        if(!chekGhostDiv()) return

        if (div) {
            div.style.top = y + "px";
            div.style.left = x + "px";
        }
            setTimeout(() => {
                setIsThrottled(false)
            }, 50)
        }
    }


    const checkIsAbove = () => {
        const div = document.querySelector('.placeholder') as HTMLDivElement;
        const dropped = Array.from(dropItems.current)
        // const dropped = document.querySelectorAll('.drop__element')

        if (div && dropped?.length) {
            const getDimension = div.getBoundingClientRect();
            const currentX = Math.floor(getDimension.x);
            const currentY = Math.floor(getDimension.y);
            const currentWidth = Math.floor(getDimension.width);
            const currentHeight = Math.floor(getDimension.height);

            let elemIsOver;

            for(let i = 0; i < dropped.length; i++) {
                const placedX = Math.floor(dropped[i].getBoundingClientRect().x)
                const placedY = Math.floor(dropped[i].getBoundingClientRect().y)
                const placedWidth = Math.floor(dropped[i].getBoundingClientRect().width)
                const placedHeight = Math.floor(dropped[i].getBoundingClientRect().height)

                if ((currentX < placedX + placedWidth) &&
                    (currentX + currentWidth > placedX) &&
                    (currentY < placedY + placedHeight) &&
                    (currentY + currentHeight > placedY)) {
                        elemIsOver = true;
                       if(!dropped[i].classList.contains(redOver))
                        dropped[i].classList.toggle(redOver)
                    } else {
                        elemIsOver = false
                        dropped[i].classList.remove(redOver)
                    }
            }
            setIsOver(elemIsOver)
            console.log(isOver)
        }
    }

    //  console.log('CZy zachodzi ', isOver)
    const dragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()

            const contentX = Math.floor(getContentSize().x)
            const contentY = Math.floor(getContentSize().y)
    
            const placeX = Math.floor(positionX - contentX - ((getContentSize().width / 3) / 2));
            const placeY = Math.floor(positionY - contentY - ((getContentSize().height / 2) / 2));
    
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
       
        const contentX = Math.floor(getContentSize().x)
        const contentY = Math.floor(getContentSize().y)

        const left = Math.floor(positionX - contentX - ((getContentSize().width / 3) / 2))
        const top = Math.floor(positionY - contentY -  ((getContentSize().height / 2) / 2))
        const width = Math.floor(getContentSize().width / 3)
        const height = Math.floor(getContentSize().height / 2)

        if (mainContent?.current && currentDrag) {
            currentDrag.classList.remove(HeaderClass)

                setDropElements([...dropElements, 
                    {text: currentDrag.textContent,
                    className: DropClass,
                    top: top,
                    left: left,
                    width: width,
                    height: height
                    } as DropElements    
                ])
            
            
        }

        
        setCurrentDrag(null)
    }

    const resetMouse = () => {
        setMouseDownXY({...mouseDownXY, isDown: false})
    }
    const getMouseMoveXY = (e: any) => {
        if(!isResized) {
            setIsResized(true);
            if (mouseDownXY.isDown) {

          

                const currentX = e.clientX;
                const currentY = e.clientY;
                console.log(e.currentTarget.textContent)
                const current = dropElements.findIndex((item, index) => item.text === e.currentTarget.textContent);
 
       
                const prevWidth = dropElements[current].width;
                const drop = [...dropElements];


                    if (currentX > mouseDownXY.x ) {
                        drop[current].width = prevWidth + 10;
                        setDropElements([
                           ...drop
                        ])

                    } else { 
                        drop[current].width = prevWidth - 10;
                        setDropElements([
                           ...drop
                        ])
                    }
            }
            setTimeout(() => setIsResized(false), 100)
        } 
    }

    const resize = (e: any) => {
        setMouseDownXY({isDown: true, x: e.clientX, y: e.clientY})
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

            <div className="main" onMouseUp={resetMouse}>
                <div onDragOver={dragOver} onDrop={drop} className="main__content" ref={mainContent}>
                    {/* <div className="placeholder"></div> */}
                   {
                       dropElements.length ? dropElements.map((element: any, index: number) => (
                            <div key={`${element.text}_${index}`} 
                                className={element.className}
                                style={{top: `${element.top}px`, left: `${element.left}px`, width: `${element.width}px`}}
                                ref={(ref) => dropItems.current[index] = ref}
                                onMouseDown={resize}
                                onMouseMove={getMouseMoveXY}
                                
                            >{element.text}</div>
                       )) : null
                   }
                </div>
            </div>
        </>
    )
}

export default Main


/*
    //pobranie elementu ref do state


*/
