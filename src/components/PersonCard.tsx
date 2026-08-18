

interface PersonCardProps {
    name: string;
}

export default function PersonCard (props: PersonCardProps) {

    return (

        <div>
            <h1>{props.name}</h1>
        </div>

    );

}