import { MouseEvent, useState, useCallback, useEffect, useMemo, useRef } from "react"
import CapitalButton, { ButtonVariant } from "../CapitalButton/CapitalButton"
import './style.css'
type GameWrapper = {
    data: { [country: string]: string },
    maxErrors?: number
}

type ButtonStructure = {
    label: string
    variant: ButtonVariant,
    rawObject: { [country: string]: string }
    order: number
}


const GameWrapper = ({ data, maxErrors = 3 }: GameWrapper) => {

    const [theButtons, setTheButtons] = useState<ButtonStructure[]>([])
    const [errors, setErrors] = useState<number>(0)

    const getRandomOrder = () => Math.floor(Math.random() * Object.keys(data).length * 2)

    const prepareGame = () => {
        const buttons: ButtonStructure[] = []
        setErrors(0)
        Object.keys(data).flatMap((key) => [
            buttons.push({
                label: key,
                variant: ButtonVariant.DEFAULT,
                order: getRandomOrder(),
                rawObject: { [key]: data[key] }
            }),
            buttons.push({
                label: data[key],
                variant: ButtonVariant.DEFAULT,
                order: getRandomOrder(),
                rawObject: { [key]: data[key] }
            })
        ])
        setTheButtons(buttons)
    }

    useEffect(() => {
        prepareGame()
    }, [data])

    const resetButtons = () => {
        setTheButtons((prev) => prev.map((button) => {
            if (button.variant !== ButtonVariant.SUCCESS)
                button.variant = ButtonVariant.DEFAULT
            return button
        }))
    }

    const selectButtonByIndex = (index: number) => {
        setTheButtons((prev) => prev.map((button, i) => {
            if (i === index) {
                button.variant = ButtonVariant.SELECTED
            }
            return button
        }))
    }

    const onButtonClicked = useCallback((evt: React.MouseEvent, index: number) => {
        // if there are buttons with errors, reset all buttons
        const errorButton = theButtons.find((button) => button.variant === ButtonVariant.ERROR)
        if (errorButton) {
            resetButtons()
        }

        // look for all buttons selected
        const selectedButton = theButtons.find((button) => button.variant === ButtonVariant.SELECTED)
        
        if(JSON.stringify(selectedButton) === JSON.stringify(theButtons[index]))
            return

        
        if (selectedButton) {
            // check if both selected buttons has the same rawObject
            if (JSON.stringify(selectedButton.rawObject) === JSON.stringify(theButtons[index].rawObject)) {
                setTheButtons((prev) => prev.map((button, idx) => {
                    if (button.variant === ButtonVariant.SELECTED || idx === index)
                        button.variant = ButtonVariant.SUCCESS
                    return button
                }))
            } else {
                setTheButtons((prev) => prev.map((button, idx) => {
                    if (button.variant === ButtonVariant.SELECTED || idx === index)
                        button.variant = ButtonVariant.ERROR
                    return button
                }))
                setErrors((prev) => prev + 1)
            }
            // set the new state with the current button pressed
        } else {
            selectButtonByIndex(index)
        }

    }, [theButtons])

    const goodAnswers = useMemo(() => theButtons.filter((button) => button.variant === ButtonVariant.SUCCESS).length, [theButtons])

    if (errors === maxErrors) {
        return <div className="game-over">
            <h1>Game Over</h1>
            <p>You have reached the maximum number of errors</p>
            <button onClick={prepareGame}>Try Again</button>
        </div>
    }


    if (goodAnswers === theButtons.length) {
        return (
            <div className="success-message">
                <h1>Well done!</h1>
                <p>You have found all the pairs</p>
                <button onClick={prepareGame}>Play Again</button>
            </div>
        )
    }



    return  <>
        <div className="buttons-container">
            {theButtons.map((button, index) =>
                <CapitalButton
                    key={index}
                    label={button.label}
                    variant={button.variant}
                    style={{ order: button.order }}
                    onClick={(evt) => onButtonClicked(evt, index)} />
            )}
        </div>
        <div className="errors">
            <p>Errors: <span>{errors}</span></p>
        </div>
    </>
}

export default GameWrapper