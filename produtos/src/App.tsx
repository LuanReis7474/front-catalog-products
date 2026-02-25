import { useState, useEffect } from 'react';
import { ProductService, type Product } from './services/products';
import { OrderService, type CreateOrderData } from './services/orders';
import './App.css';

interface CartItem extends Product {
  quantity: number;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentView, setCurrentView] = useState<'catalog' | 'checkout'>('catalog');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<{ id: string; total: number } | null>(null);

  const [formData, setFormData] = useState({
    nameCustomer: '',
    paymentMethod: 'Cartão de Crédito',
    street: '',
    number: '',
    neighborhood: '',
    city: ''
  });

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await ProductService.getAll();
        setProducts(data);
      } catch (error) {
        console.error("Erro ao carregar produtos.", error);
      }
    }
    loadProducts();
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const orderData: CreateOrderData = {
        nameCustomer: formData.nameCustomer,
        paymentMethod: formData.paymentMethod,
        street: formData.street,
        number: formData.number,
        neighborhood: formData.neighborhood,
        city: formData.city,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };

      const result = await OrderService.create(orderData);


      setLastOrder(result);
      setIsModalOpen(true);


      setCart([]);
      setFormData({ nameCustomer: '', paymentMethod: 'Cartão de Crédito', street: '', number: '', neighborhood: '', city: '' });

    } catch (error) {
      console.error("Erro no checkout:", error);
      alert("Erro ao processar o pedido. Verifique o terminal do backend para mais detalhes.");
    }
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentView('catalog');
  };

  return (
    <div className="app-container">
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon">✅</div>
            <h2>Pedido Realizado!</h2>
            <p>Obrigado pela compra, <strong>{lastOrder?.id.split('-')[0]}...</strong></p>
            <div className="modal-details">
              <span>Protocolo: {lastOrder?.id}</span>
              <span>Total Pago: <strong>R$ {lastOrder?.total.toFixed(2)}</strong></span>
            </div>
            <button className="modal-close-btn" onClick={handleCloseModal}>
              Voltar para a Vitrine
            </button>
          </div>
        </div>
      )}

      {currentView === 'checkout' ? (
        <div className="checkout-container">
          <h1>Finalizar Pedido</h1>
          <button className="back-btn" onClick={() => setCurrentView('catalog')}>← Voltar para a Loja</button>

          <div className="checkout-content">
            <form className="checkout-form" onSubmit={handleCheckoutSubmit}>
              <h2>Dados de Entrega e Pagamento</h2>
              <input required placeholder="Nome Completo" value={formData.nameCustomer} onChange={e => setFormData({ ...formData, nameCustomer: e.target.value })} />
              <select value={formData.paymentMethod} onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="PIX">PIX</option>
                <option value="Boleto">Boleto</option>
              </select>
              <input required placeholder="Rua" value={formData.street} onChange={e => setFormData({ ...formData, street: e.target.value })} />
              <input required placeholder="Número" value={formData.number} onChange={e => setFormData({ ...formData, number: e.target.value })} />
              <input required placeholder="Bairro" value={formData.neighborhood} onChange={e => setFormData({ ...formData, neighborhood: e.target.value })} />
              <input required placeholder="Cidade" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />

              <button type="submit" className="submit-btn">Confirmar Compra</button>
            </form>

            <div className="checkout-summary">
              <h2>Resumo ({cart.length} itens)</h2>
              <ul>
                {cart.map((item) => (
                  <li key={item.id}>{item.quantity}x {item.title} - R$ {(item.price * item.quantity).toFixed(2)}</li>
                ))}
              </ul>
              <h3>Total: R$ {cartTotal.toFixed(2)}</h3>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="main-content">
            <h1>Produtos</h1>
            <div className="products-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <img src={product.image} alt={product.title} />
                  <h3 className="product-title">{product.title}</h3>
                  <p className="price">R$ {product.price.toFixed(2)}</p>
                  <button onClick={() => addToCart(product)}>Adicionar</button>
                </div>
              ))}
            </div>
          </div>

          <aside className="sidebar-cart">
            <h2>Meu Carrinho</h2>
            {cart.length === 0 ? (
              <p>Seu carrinho está vazio.</p>
            ) : (
              <>
                <ul className="cart-list">
                  {cart.map(item => (
                    <li key={item.id} className="cart-item">
                      <div>
                        <span className="cart-item-title">{item.title}</span>
                        <span className="cart-item-qtd">Qtd: {item.quantity}</span>
                      </div>
                      <strong>R$ {(item.price * item.quantity).toFixed(2)}</strong>
                    </li>
                  ))}
                </ul>
                <div className="cart-footer">
                  <h3>Total: R$ {cartTotal.toFixed(2)}</h3>
                  <button className="checkout-btn" onClick={() => setCurrentView('checkout')}>
                    Finalizar Compra
                  </button>
                </div>
              </>
            )}
          </aside>
        </>
      )}
    </div>
  );
}

export default App;