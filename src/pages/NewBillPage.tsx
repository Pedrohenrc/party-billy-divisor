import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonForm from '../components/bill/PersonForm.tsx';
import PersonCard from '../components/bill/PersonCard.tsx';
import ProductCard from '../components/bill/ProductCard.tsx';
import ProductForm from '../components/bill/ProductForm.tsx';
import ReceiptScanButton from '../components/bill/ReceiptScanButton.tsx';
import { ShareButton } from '../components/bill/ShareButton.tsx';
import SplitPreview from '../components/bill/SplitPreview.tsx';
import { Button } from '../components/ui/Button.tsx';
import { Input } from '../components/ui/Input.tsx';
import { useBillDraft } from '../hooks/useBillDraft.ts';
import { useCreateBill } from '../hooks/useBills.ts';
import { useToast } from '../hooks/useToast.ts';
import { buildSplitShareData } from '../utils/shareText.ts';
import { calculateBillSplit, draftToCreateBillRequest, formatMoney } from '../utils/utils.ts';

export default function NewBillPage() {
    const {
        draft,
        setTitle,
        addPerson,
        removePerson,
        addProduct,
        addProducts,
        removeProduct,
        setProductParticipants,
        reset,
    } = useBillDraft();

    const { createBill, isCreating } = useCreateBill();
    const navigate = useNavigate();
    const toast = useToast();

    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

    const split = calculateBillSplit(draft);

    const canSave =
        draft.title.trim().length > 0 &&
        draft.products.length > 0 &&
        draft.persons.length > 0 &&
        split.success;

    async function handleSave() {
        if (!canSave) {
            toast.error('Falta um título e vincular pelo menos uma pessoa a cada item');
            return;
        }

        try {
            const bill = await createBill(draftToCreateBillRequest(draft));

            reset();
            navigate(`/bills/${bill.id}`, { replace: true });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Não foi possível salvar a conta');
        }
    }

    return (
        <div className="page has-save-bar">
            <div className="page-header">
                <div>
                    <h1>Nova conta</h1>
                    <p className="page-subtitle">
                        Escaneie a nota ou cadastre na mão, junte a galera e defina quem ficou com o quê.
                    </p>
                </div>

                <div className="page-header-actions hide-on-mobile">
                    <Button variant="ghost" onClick={reset} disabled={isCreating}>
                        Limpar
                    </Button>

                    <Button size="lg" onClick={handleSave} loading={isCreating} disabled={!canSave}>
                        Salvar conta
                    </Button>
                </div>
            </div>

            <section className="panel">
                <div className="panel-title">
                    <span className="step-badge">1</span>
                    <span>Título da conta</span>
                </div>

                <Input
                    value={draft.title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Ex: Churrasco de sábado"
                    aria-label="Título da conta"
                    maxLength={255}
                />
            </section>

            <section className="panel">
                <div className="panel-header-row">
                    <div className="panel-title">
                        <span className="step-badge">2</span>
                        <span>Itens da conta</span>
                    </div>

                    <ReceiptScanButton onConfirm={addProducts} />
                </div>

                <ProductForm onAddProduct={addProduct} />

                <div className="card-list">
                    {draft.products.length === 0 && (
                        <p className="panel-empty">
                            Nenhum item ainda. Fotografe a nota ou adicione um item acima.
                        </p>
                    )}

                    {draft.products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            persons={draft.persons}
                            relations={draft.relations}
                            isAddingPeople={selectedProductId === product.id}
                            onToggleAddPeople={(productId) =>
                                setSelectedProductId((current) =>
                                    current === productId ? null : productId
                                )
                            }
                            onCloseAddPeople={() => setSelectedProductId(null)}
                            onConfirmParticipants={setProductParticipants}
                            onRemove={removeProduct}
                        />
                    ))}
                </div>
            </section>

            <section className="panel">
                <div className="panel-title">
                    <span className="step-badge">3</span>
                    <span>Quem estava junto</span>
                </div>

                <PersonForm onAddPerson={addPerson} />

                <div className="card-list">
                    {draft.persons.length === 0 && (
                        <p className="panel-empty">Ninguém cadastrado ainda.</p>
                    )}

                    {draft.persons.map((person) => (
                        <PersonCard
                            key={person.id}
                            person={person}
                            products={draft.products}
                            relations={draft.relations}
                            onRemove={removePerson}
                        />
                    ))}
                </div>
            </section>

            {draft.products.length > 0 && (
                <section className="panel">
                    <div className="panel-header-row">
                        <div className="panel-title">
                            <span className="step-badge">4</span>
                            <span>Prévia da divisão</span>
                        </div>

                        {split.success && (
                            <ShareButton
                                data={buildSplitShareData(draft.title, split)}
                                variant="ghost"
                                size="sm"
                            />
                        )}
                    </div>

                    <SplitPreview result={split} />
                </section>
            )}

            <div className="save-bar">
                <div className="save-bar-info">
                    <span>Total</span>
                    <strong>R$ {split.success ? formatMoney(split.totalBill) : '0,00'}</strong>
                </div>

                <div className="save-bar-actions">
                    <Button variant="ghost" onClick={reset} disabled={isCreating} size="sm">
                        Limpar
                    </Button>

                    <Button onClick={handleSave} loading={isCreating} disabled={!canSave}>
                        Salvar conta
                    </Button>
                </div>
            </div>
        </div>
    );
}
