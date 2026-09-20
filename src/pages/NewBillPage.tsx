import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import { calculateBillSplit, draftToCreateBillRequest } from '../utils/utils.ts';

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
    const [searchParams] = useSearchParams();

    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

    const split = calculateBillSplit(draft);
    const currentStep = !draft.title.trim()
        ? 1
        : draft.persons.length === 0 || draft.products.length === 0 || !split.success
          ? 2
          : 3;

    const canSave =
        draft.title.trim().length > 0 &&
        draft.products.length > 0 &&
        draft.persons.length > 0 &&
        split.success;

    async function handleSave() {
        if (!canSave) {
            toast.error('Informe um título e vincule pelo menos uma pessoa a cada item');
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
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Nova conta</h1>
                    <p className="page-subtitle">
                        Monte a conta em três passos rápidos.
                    </p>
                </div>

                <div className="page-header-actions">
                    <Button variant="ghost" onClick={reset} disabled={isCreating}>
                        Limpar
                    </Button>

                    <Button size="lg" onClick={handleSave} loading={isCreating} disabled={!canSave}>
                        Salvar conta
                    </Button>
                </div>
            </div>

            <div className="flow-steps" aria-label="Etapas da nova conta">
                <span className={`flow-step ${currentStep >= 1 ? 'is-done' : ''} ${currentStep === 1 ? 'is-current' : ''}`}>
                    <b>1</b><span><small>Passo 1</small>Identifique a conta</span>
                </span>
                <span className={`flow-step ${currentStep >= 2 ? 'is-done' : ''} ${currentStep === 2 ? 'is-current' : ''}`}>
                    <b>2</b><span><small>Passo 2</small>Pessoas e itens</span>
                </span>
                <span className={`flow-step ${currentStep === 3 ? 'is-done is-current' : ''}`}>
                    <b>3</b><span><small>Passo 3</small>Confira e salve</span>
                </span>
            </div>

            <section className="panel flow-card">
                <div className="section-heading"><h2>Como vamos chamar?</h2></div>
                <Input
                    label="Título da conta"
                    value={draft.title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Ex: Churrasco de sábado"
                    maxLength={255}
                />
            </section>

            <div className="app-grid">
                <section className="panel">
                    <div className="section-heading"><h2>Pessoas</h2><span className="section-count">{draft.persons.length}</span></div>

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

                <section className="panel">
                    <div className="panel-header-row">
                        <h2>Itens</h2>

                        <ReceiptScanButton onConfirm={addProducts} autoOpen={searchParams.get('scan') === '1'} />
                    </div>

                    <ProductForm onAddProduct={addProduct} />

                    <div className="card-list">
                        {draft.products.length === 0 && (
                            <p className="panel-empty">Nenhum item cadastrado ainda.</p>
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
            </div>

            {draft.products.length > 0 && (
                <section className="panel">
                    <div className="panel-header-row">
                        <h2>Confira a divisão</h2>

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
        </div>
    );
}
