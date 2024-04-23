import './style.css'
export enum ButtonVariant {
    SUCCESS = 'success',
    ERROR = 'error',
    DEFAULT = 'default',
    SELECTED = 'selected'
}

type CapitalButtonProps = {
    label: string
    variant?: ButtonVariant
    onClick: (evt: React.MouseEvent) => void
    style?: React.CSSProperties | undefined
}

const CapitalButton = ({
    label,
    onClick,
    variant = ButtonVariant.DEFAULT,
    style
}: CapitalButtonProps) => {
    return <button
        onClick={onClick}
        className={variant} 
        style={style} disabled={variant === 'success'}>
            {label}
    </button>
}

export default CapitalButton