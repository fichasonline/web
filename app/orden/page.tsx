"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import { 
  pedidoFormSchema, 
  defaultPedidoValues, 
  OPERATIONS, 
  PAYMENT_METHODS, 
  PLATFORMS,
  type PedidoFormData 
} from '@/lib/schemas/pedido';
import { Check, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const STEPS = [
  { id: 1, name: 'Operación', description: 'Qué deseas hacer' },
  { id: 2, name: 'Activo', description: 'Selecciona la plataforma' },
  { id: 3, name: 'Monto', description: 'Cantidad a operar' },
  { id: 4, name: 'Pago', description: 'Método de pago' },
  { id: 5, name: 'Contacto', description: 'Tus datos' },
  { id: 6, name: 'Confirmación', description: 'Revisa tu pedido' }
];

export default function OrdenPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pedidoCreado, setPedidoCreado] = useState<any>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PedidoFormData>({
    resolver: zodResolver(pedidoFormSchema),
    defaultValues: defaultPedidoValues,
    mode: 'onChange'
  });

  const formData = watch();

  const nextStep = () => {
    if (currentStep < STEPS.length) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const onSubmit = async (data: PedidoFormData) => {
    setIsSubmitting(true);
    
    try {
      const idempotencyKey = uuidv4();
      
      const payload = {
        ...data,
        idempotency_key: idempotencyKey,
        details: data.details,
        status: 'pendiente'
      };

      const { data: result, error } = await supabase
        .from('pedidos')
        .insert([payload])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast.error('Este pedido ya fue procesado');
        } else {
          toast.error(`Error: ${error.message}`);
        }
        return;
      }

      setPedidoCreado(result);
      toast.success('¡Pedido creado exitosamente!');
      
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Error al crear el pedido');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (pedidoCreado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Pedido Confirmado!
          </h1>
          <p className="text-gray-600 mb-6">
            Tu pedido ha sido recibido y está siendo procesado. Te contactaremos pronto.
          </p>
          <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">ID de Pedido:</span>
                <p className="font-mono font-semibold">{pedidoCreado.id.slice(0, 8)}</p>
              </div>
              <div>
                <span className="text-gray-500">Operación:</span>
                <p className="font-semibold capitalize">{pedidoCreado.operation}</p>
              </div>
              <div>
                <span className="text-gray-500">Plataforma:</span>
                <p className="font-semibold">{pedidoCreado.platform}</p>
              </div>
              <div>
                <span className="text-gray-500">Monto:</span>
                <p className="font-semibold">{pedidoCreado.amount} {pedidoCreado.currency}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Crear Pedido</h1>
          <p className="text-gray-600">Completa el formulario para realizar tu operación</p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : currentStep === step.id
                        ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                  </div>
                  <span className="text-xs mt-2 font-medium text-gray-700 hidden sm:block">
                    {step.name}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 transition-all ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-2xl shadow-xl p-8 min-h-[400px]">
            {/* Step 1: Operación */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">¿Qué deseas hacer?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {OPERATIONS.map((op) => (
                    <button
                      key={op.value}
                      type="button"
                      onClick={() => {
                        setValue('operation', op.value);
                        nextStep();
                      }}
                      className={`p-6 border-2 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all ${
                        formData.operation === op.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="text-4xl mb-3">{op.icon}</div>
                      <h3 className="font-bold text-lg mb-2">{op.label}</h3>
                      <p className="text-sm text-gray-600">{op.description}</p>
                    </button>
                  ))}
                </div>
                {errors.operation && (
                  <p className="text-red-500 text-sm">{errors.operation.message}</p>
                )}
              </div>
            )}

            {/* Step 2: Plataforma */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Selecciona la plataforma</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PLATFORMS.map((platform) => (
                    <button
                      key={platform.value}
                      type="button"
                      onClick={() => setValue('platform', platform.value)}
                      className={`p-4 border-2 rounded-lg hover:border-blue-500 transition-all flex items-center gap-3 ${
                        formData.platform === platform.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <span className="text-2xl">{platform.emoji}</span>
                      <div className="text-left flex-1">
                        <p className="font-semibold">{platform.label}</p>
                        <p className="text-xs text-gray-500 capitalize">{platform.category}</p>
                      </div>
                      {formData.platform === platform.value && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
                {errors.platform && (
                  <p className="text-red-500 text-sm">{errors.platform.message}</p>
                )}
              </div>
            )}

            {/* Step 3: Monto */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">¿Cuánto deseas operar?</h2>
                <div className="max-w-md mx-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto en USD
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-2xl">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      {...register('amount')}
                      className="w-full pl-12 pr-4 py-4 text-3xl font-bold border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-2">{errors.amount.message}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-3">
                    Ingresa el monto que deseas {formData.operation}
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Método de Pago */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Método de pago</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setValue('details.payment_method', method.value)}
                      className={`p-6 border-2 rounded-xl hover:border-blue-500 transition-all ${
                        formData.details.payment_method === method.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="text-4xl mb-3">{method.icon}</div>
                      <h3 className="font-bold mb-2">{method.label}</h3>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </button>
                  ))}
                </div>
                {errors.details?.payment_method && (
                  <p className="text-red-500 text-sm">{errors.details.payment_method.message}</p>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Información adicional (opcional)
                  </label>
                  <input
                    type="text"
                    {...register('details.account_info')}
                    placeholder="Usuario de plataforma, cuenta bancaria, etc."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Contacto */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Información de contacto</h2>
                <div className="max-w-lg mx-auto space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      {...register('name')}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="Juan Pérez"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      {...register('user_phone')}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="+598 99 123 456"
                    />
                    {errors.user_phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.user_phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email (opcional)
                    </label>
                    <input
                      type="email"
                      {...register('details.email')}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="tu@email.com"
                    />
                    {errors.details?.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.details.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notas adicionales (opcional)
                    </label>
                    <textarea
                      {...register('details.notes')}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                      placeholder="Información adicional sobre tu pedido..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Confirmación */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Confirma tu pedido</h2>
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Operación</p>
                      <p className="font-semibold capitalize">{formData.operation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Plataforma</p>
                      <p className="font-semibold">{formData.platform}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Monto</p>
                      <p className="font-semibold text-xl">${formData.amount} USD</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Método de pago</p>
                      <p className="font-semibold">{formData.details.payment_method}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Nombre</p>
                      <p className="font-semibold">{formData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Teléfono</p>
                      <p className="font-semibold">{formData.user_phone}</p>
                    </div>
                    {formData.details.email && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-semibold">{formData.details.email}</p>
                      </div>
                    )}
                    {formData.details.notes && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Notas</p>
                        <p className="text-sm">{formData.details.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Anterior
            </button>

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
              >
                Siguiente
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Confirmar Pedido
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
