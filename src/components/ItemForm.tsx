import Button from "./Button.tsx";


export default function ItemForm() {

    return (

        <div>
            <h1>Cadastrar Item</h1>
            <input placeholder='Digite o nome do produto' type="text"/>
            <input placeholder='Digite o valor do produto' type="number"/>
            <Button text='Cadastrar produto'/>
        </div>

    );

}