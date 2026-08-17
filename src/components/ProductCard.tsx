
interface ItemCardProps {
    name: string;
    price: number;
}

export default function ProductCard(props: ItemCardProps) {

    return (
        <div>
            <h1>{props.name}</h1>
            <p>{props.price}</p>
        </div>
    )

}