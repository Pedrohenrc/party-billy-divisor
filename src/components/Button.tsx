

interface ButtonProps {
    text: string;
}

export default function Button(props: ButtonProps) {

    return (

        <div>
            <button type='submit'>
                {props.text}
            </button>
        </div>

    )

}