import { z } from "zod";

// Schema de detalles adicionales del pedido
export const pedidoDetailsSchema = z.object({
  email: z.string().email("Email inválido").optional().or(z.literal('')),
  payment_method: z.enum(['EFECTIVO', 'BANCO', 'CUENTA_CORRIENTE'], {
    errorMap: () => ({ message: "Selecciona un método de pago" })
  }),
  financing: z.boolean().optional(),
  notes: z.string().max(500, "Las notas no pueden exceder 500 caracteres").optional(),
  account_info: z.string().optional(),
});

// Schema principal del pedido para formulario
export const pedidoFormSchema = z.object({
  name: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo"),
  user_phone: z.string()
    .min(6, "El teléfono debe tener al menos 6 caracteres")
    .max(20, "El teléfono es demasiado largo"),
  operation: z.enum(['compra', 'venta', 'cashout'], {
    errorMap: () => ({ message: "Tipo de operación inválido" })
  }),
  platform: z.string()
    .min(2, "Selecciona una plataforma")
    .max(50, "El nombre de la plataforma es demasiado largo"),
  amount: z.coerce.number()
    .positive("El monto debe ser mayor a 0")
    .finite("El monto debe ser un número válido")
    .max(1000000, "El monto no puede exceder 1,000,000"),
  currency: z.string().default('USD'),
  comprobante_url: z.string().url("URL de comprobante inválida").optional().or(z.literal('')),
  details: pedidoDetailsSchema
});

export type PedidoFormData = z.infer<typeof pedidoFormSchema>;

// Valores por defecto
export const defaultPedidoValues: PedidoFormData = {
  name: "",
  user_phone: "",
  operation: "compra",
  platform: "",
  amount: 0,
  currency: "USD",
  comprobante_url: "",
  details: {
    email: "",
    payment_method: "BANCO",
    financing: false,
    notes: "",
    account_info: ""
  }
};

// Constantes para opciones
export const OPERATIONS = [
  { value: 'compra' as const, label: 'Comprar Fichas/Crypto', icon: '💰', color: 'bg-green-500', description: 'Compra activos digitales' },
  { value: 'venta' as const, label: 'Vender Fichas/Crypto', icon: '💸', color: 'bg-blue-500', description: 'Vende tus activos' },
  { value: 'cashout' as const, label: 'Cashout', icon: '🏦', color: 'bg-purple-500', description: 'Retira tu dinero' }
];

export const PAYMENT_METHODS = [
  { value: 'EFECTIVO' as const, label: 'Efectivo', icon: '💵', description: 'Pago en efectivo' },
  { value: 'BANCO' as const, label: 'Transferencia Bancaria', icon: '🏦', description: 'Transferencia o depósito bancario' },
  { value: 'CUENTA_CORRIENTE' as const, label: 'Cuenta Corriente', icon: '📋', description: 'Financiamiento disponible' }
];

export const PLATFORMS = [
  // Fichas de Póker
  { value: 'GGPoker', label: 'GGPoker', category: 'fichas', emoji: '♠️' },
  { value: 'PokerStars', label: 'PokerStars', category: 'fichas', emoji: '♦️' },
  { value: 'ACR', label: 'Americas Cardroom (ACR)', category: 'fichas', emoji: '♣️' },
  { value: 'PartyPoker', label: 'PartyPoker', category: 'fichas', emoji: '♥️' },
  { value: 'WPN', label: 'Winning Poker Network', category: 'fichas', emoji: '🎰' },
  
  // Criptomonedas
  { value: 'BTC', label: 'Bitcoin (BTC)', category: 'crypto', emoji: '₿' },
  { value: 'USDT', label: 'Tether (USDT)', category: 'crypto', emoji: '₮' },
  { value: 'ETH', label: 'Ethereum (ETH)', category: 'crypto', emoji: 'Ξ' },
  { value: 'USDC', label: 'USD Coin (USDC)', category: 'crypto', emoji: '🪙' },
  
  // Otros
  { value: 'OTRO', label: 'Otra plataforma', category: 'other', emoji: '🔧' }
];
