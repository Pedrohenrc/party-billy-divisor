

interface ButtonProps {
    text: string;
    type: "button" | "submit";
    variant?: "primary" | "secondary";
    onClick?: () => void;
}

export default function Button(props: ButtonProps) {

    const variant = props.variant ?? "primary";

    return (

        <div className="button-wrapper">
            <button
                type={props.type ?? "button"}
                className={variant === "secondary" ? "btn btn-secondary" : "btn"}
                onClick={props.onClick}
            >
                {props.text}
            </button>
        </div>

    )

}