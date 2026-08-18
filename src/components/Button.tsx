

interface ButtonProps {
    text: string;
    type: "button" | "submit";
    onClick?: () => void;
}

export default function Button(props: ButtonProps) {

    return (

        <div>
            <button type={props.type ?? "button"} onClick={props.onClick}>
                {props.text}
            </button>
        </div>

    )

}