"use client"

import { useMemo, useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import {
  pedidoFormSchema,
  defaultPedidoValues,
  OPERATIONS,
  PAYMENT_METHODS,
  PLATFORMS,
  type PedidoFormData,
} from '@/lib/schemas/pedido';
import { Check, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/header';
import { BlurPanel } from '@/components/blur-panel';

const STEPS = [
  { id: 1, name: 'Operación', description: 'Qué deseas hacer' },
  { id: 2, name: 'Activo', description: 'Selecciona la plataforma' },
  { id: 3, name: 'Monto', description: 'Cantidad a operar' },
  { id: 4, name: 'Pago', description: 'Método de pago' },
  { id: 5, name: 'Contacto', description: 'Tus datos' },
  { id: 6, name: 'Confirmación', description: 'Revisa tu pedido' },
];

// Componente interno que usa useSearchParams
function OrdenForm() {
  const searchParams = useSearchParams();
  const whatsappRef = searchParams.get('ref'); // Captura el ref de WhatsApp
  const sessionId = searchParams.get('session'); // Captura el session_id
  
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
    mode: 'onChange',
  });

  const formData = watch();
  const stepInfo = useMemo(() => STEPS[currentStep - 1], [currentStep]);

  const nextStep = () => {
    if (currentStep < STEPS.length) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = async (data: PedidoFormData) => {
    setIsSubmitting(true);

    try {
      const idempotencyKey = uuidv4();

      const payload = {
        ...data,
        idempotency_key: idempotencyKey,
        session_id: sessionId, // Agregar session_id
        details: {
          ...data.details,
          whatsapp_ref: whatsappRef, // Agregar referencia de WhatsApp
        },
        status: 'pendiente',
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
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-950 via-indigo-950 to-neutral-900">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Finex.Vector-9hy7UohQQyiREX1GaXcYkkkOPb8N26.png"
          alt=""
          fill
          priority
          className="pointer-events-none -z-10 object-cover opacity-[0.18] mix-blend-screen"
        />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black/45 via-transparent to-black/60" />
        <Header />
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 pt-28 pb-20 lg:pt-32">
          <BlurPanel className="w-full rounded-3xl border border-white/10 bg-white/5 px-6 py-10 text-white shadow-2xl">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#10B981]/20">
                <Check className="h-10 w-10 text-[#10B981]" />
              </div>
              <h1 className="mt-6 text-center text-3xl font-semibold md:text-4xl">¡Pedido confirmado!</h1>
              <p className="mt-2 text-center text-sm text-white/70">
              Ya recibimos tu solicitud. En breve nos pondremos en contacto para coordinar los próximos pasos.
            </p>
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                <div>
                  <span className="text-white/60">ID de pedido</span>
                  <p className="font-mono text-lg font-semibold font-tabular text-[#10B981]">
                    {pedidoCreado.id.slice(0, 8)}
                  </p>
                </div>
                <div>
                  <span className="text-white/60">Operación</span>
                  <p className="font-semibold capitalize text-white">{pedidoCreado.operation}</p>
                </div>
                <div>
                  <span className="text-white/60">Plataforma</span>
                  <p className="font-semibold text-white">{pedidoCreado.platform}</p>
                </div>
                <div>
                  <span className="text-white/60">Monto</span>
                  <p className="font-semibold font-tabular text-white">
                    ${pedidoCreado.amount} {pedidoCreado.currency}
                  </p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                window.location.href = '/';
              }}
              className="mt-8 inline-flex items-center justify-center rounded-2xl bg-[#0B5FFF] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0B5FFF]/30 transition-all hover:bg-[#0B5FFF]/90 focus:outline-none focus:ring-2 focus:ring-[#0B5FFF] focus:ring-offset-2 focus:ring-offset-black"
            >
              Volver al inicio
            </button>
          </BlurPanel>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-950 via-indigo-950 to-neutral-900">
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Finex.Vector-9hy7UohQQyiREX1GaXcYkkkOPb8N26.png"
        alt=""
        fill
        priority
        className="pointer-events-none -z-10 object-cover opacity-[0.18] mix-blend-screen"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black/45 via-transparent to-black/60" />
      <Header />
      <div className="mx-auto w-full max-w-4xl px-4 pt-28 pb-40 md:pb-24 lg:pt-32">
        <BlurPanel className="mb-6 w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-6 text-white shadow-2xl md:mb-10 md:px-6">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/90 backdrop-blur-sm">
              Paso {currentStep} de {STEPS.length}
            </span>
            <span className="text-xs font-medium text-white/70 md:hidden">{stepInfo.name}</span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold md:text-3xl">Orden de operación</h1>
            <p className="mt-1 max-w-xl text-sm text-white/70">
              Completá los datos para gestionar tu pedido con Finex.
            </p>
          </div>
        </BlurPanel>

        <div className="mb-8 hidden md:block">
          <BlurPanel className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-6 text-white shadow-2xl">
            <div className="flex items-center gap-4">
              {STEPS.map((step, index) => {
                const isCompleted = currentStep > step.id;
                const isActive = currentStep === step.id;

                return (
                  <div key={step.id} className="flex flex-1 items-center gap-4">
                    <div
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-all ${
                        isCompleted
                          ? 'border-[#10B981] bg-[#10B981] text-white'
                          : isActive
                          ? 'border-[#0B5FFF] bg-[#0B5FFF] text-white ring-2 ring-[#0B5FFF]/20'
                          : 'border-white/30 bg-white/5 text-white/70'
                      }`}
                    >
                      {isCompleted ? <Check className="h-5 w-5" /> : step.id}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span className="text-sm font-semibold text-white">{step.name}</span>
                      <span className="text-xs text-white/60">{step.description}</span>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div
                        className={`hidden h-px flex-1 md:block ${
                          currentStep > step.id ? 'bg-gradient-to-r from-[#10B981]/70 to-[#0B5FFF]/70' : 'bg-white/20'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </BlurPanel>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="min-h-[400px] rounded-3xl border border-white/10 bg-white/5 px-5 py-7 text-white shadow-2xl backdrop-blur md:px-10 md:py-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-semibold text-white">¿Qué deseas hacer?</h2>
                  <p className="text-sm text-white/70">Elige la operación para que podamos ayudarte mejor.</p>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {OPERATIONS.map((op) => (
                    <button
                      key={op.value}
                      type="button"
                      onClick={() => {
                        setValue('operation', op.value);
                        nextStep();
                      }}
                      className={`group flex h-full flex-col justify-between rounded-2xl border-2 p-6 text-left transition-all duration-200 ${
                        formData.operation === op.value
                          ? 'border-[#10B981] bg-[#10B981]/15 shadow-lg shadow-[#10B981]/20 ring-2 ring-[#10B981]/20'
                          : 'border-white/10 bg-white/5 hover:border-[#0B5FFF]/40 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-4xl text-white transition-transform duration-200 group-hover:scale-105">
                        {op.icon}
                      </div>
                      <div className="mt-4 space-y-1">
                        <h3 className="text-lg font-semibold text-white">{op.label}</h3>
                        <p className="text-sm text-white/70">{op.description}</p>
                      </div>
                      <span
                        className={`mt-4 inline-flex items-center text-xs font-semibold uppercase tracking-wide ${
                          formData.operation === op.value ? 'text-[#10B981]' : 'text-[#0B5FFF]'
                        }`}
                      >
                        Elegir &rarr;
                      </span>
                    </button>
                  ))}
                </div>
                {errors.operation && <p className="text-sm text-[#EF4444]">{errors.operation.message}</p>}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-semibold text-white">Selecciona la plataforma</h2>
                  <p className="text-sm text-white/70">
                    Elegí dónde querés que realicemos la operación. Podés cambiarla más adelante.
                  </p>
                </div>
                <div className="mx-auto grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                  {PLATFORMS.map((platform) => (
                    <button
                      key={platform.value}
                      type="button"
                      onClick={() => setValue('platform', platform.value)}
                      className={`flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
                        formData.platform === platform.value
                          ? 'border-[#10B981] bg-[#10B981]/15 shadow-lg shadow-[#10B981]/15 ring-2 ring-[#10B981]/20'
                          : 'border-white/10 bg-white/5 hover:border-[#0B5FFF]/40 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-2xl text-white">{platform.emoji}</span>
                      <div className="text-left flex-1">
                        <p className="font-semibold text-white">{platform.label}</p>
                        <p className="text-xs text-white/70 capitalize">{platform.category}</p>
                      </div>
                      {formData.platform === platform.value && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#10B981]/20 text-[#10B981]">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {errors.platform && <p className="text-sm text-[#EF4444]">{errors.platform.message}</p>}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-semibold text-white">¿Cuánto deseas operar?</h2>
                  <p className="text-sm text-white/70">
                    Indicá el monto estimado de tu operación. Podrás confirmar los detalles al final.
                  </p>
                </div>
                <div className="mx-auto max-w-md">
                  <label className="mb-2 block text-sm font-medium text-white/80">Monto en USD</label>
                  <div className="relative rounded-2xl border-2 border-white/15 bg-white/5">
                    <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-2xl text-white/40">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      {...register('amount')}
                      className="w-full rounded-2xl border-none bg-transparent py-5 pl-12 pr-4 text-3xl font-semibold font-tabular text-white focus:outline-none focus:ring-0"
                      placeholder="0.00"
                    />
                  </div>
                  {errors.amount && <p className="mt-2 text-sm text-[#EF4444]">{errors.amount.message}</p>}
                  <p className="mt-3 text-sm text-white/70">Ingresa el monto que deseas {formData.operation}</p>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-semibold text-white">Método de pago</h2>
                  <p className="text-sm text-white/70">
                    Seleccioná cómo preferís pagar. Ajustaremos el proceso a tus necesidades.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setValue('details.payment_method', method.value)}
                      className={`group h-full rounded-2xl border-2 p-6 text-left transition-all duration-200 ${
                        formData.details.payment_method === method.value
                          ? 'border-[#10B981] bg-[#10B981]/15 shadow-lg shadow-[#10B981]/20 ring-2 ring-[#10B981]/20'
                          : 'border-white/10 bg-white/5 hover:border-[#0B5FFF]/40 hover:bg-white/10'
                      }`}
                    >
                      <div className="mb-3 text-4xl transition-transform duration-200 group-hover:scale-110">
                        {method.icon}
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-white">{method.label}</h3>
                      <p className="text-sm text-white/70">{method.description}</p>
                    </button>
                  ))}
                </div>
                {errors.details?.payment_method && (
                  <p className="text-sm text-[#EF4444]">{errors.details.payment_method.message}</p>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">Información adicional (opcional)</label>
                  <input
                    type="text"
                    {...register('details.account_info')}
                    placeholder="Usuario de plataforma, cuenta bancaria, etc."
                    className="w-full rounded-2xl border-2 border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-[#0B5FFF] focus:outline-none focus:ring-2 focus:ring-[#0B5FFF]/20"
                  />
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-semibold text-white">Información de contacto</h2>
                  <p className="text-sm text-white/70">Necesitamos tus datos para coordinar y confirmar tu operación.</p>
                </div>
                <div className="mx-auto max-w-lg space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/80">Nombre completo *</label>
                    <input
                      type="text"
                      {...register('name')}
                      className="w-full rounded-2xl border-2 border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-[#0B5FFF] focus:outline-none focus:ring-2 focus:ring-[#0B5FFF]/20"
                      placeholder="Juan Pérez"
                    />
                    {errors.name && <p className="mt-1 text-sm text-[#EF4444]">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/80">Teléfono *</label>
                    <input
                      type="tel"
                      {...register('user_phone')}
                      className="w-full rounded-2xl border-2 border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-[#0B5FFF] focus:outline-none focus:ring-2 focus:ring-[#0B5FFF]/20"
                      placeholder="+598 99 123 456"
                    />
                    {errors.user_phone && <p className="mt-1 text-sm text-[#EF4444]">{errors.user_phone.message}</p>}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/80">Email (opcional)</label>
                    <input
                      type="email"
                      {...register('details.email')}
                      className="w-full rounded-2xl border-2 border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-[#0B5FFF] focus:outline-none focus:ring-2 focus:ring-[#0B5FFF]/20"
                      placeholder="tu@email.com"
                    />
                    {errors.details?.email && <p className="mt-1 text-sm text-[#EF4444]">{errors.details.email.message}</p>}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/80">Notas adicionales (opcional)</label>
                    <textarea
                      {...register('details.notes')}
                      rows={3}
                      className="w-full resize-none rounded-2xl border-2 border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-[#0B5FFF] focus:outline-none focus:ring-2 focus:ring-[#0B5FFF]/20"
                      placeholder="Información adicional sobre tu pedido..."
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-semibold text-white">Confirma tu pedido</h2>
                  <p className="text-sm text-white/70">Revisá los detalles antes de finalizar. Siempre podés volver a editar.</p>
                </div>
                <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-white/60">Operación</p>
                      <p className="font-semibold capitalize text-white">{formData.operation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white/60">Plataforma</p>
                      <p className="font-semibold text-white">{formData.platform}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white/60">Monto</p>
                      <p className="text-xl font-semibold font-tabular text-[#10B981]">${formData.amount} USD</p>
                    </div>
                    <div>
                      <p className="text-sm text-white/60">Método de pago</p>
                      <p className="font-semibold text-white">{formData.details.payment_method}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white/60">Nombre</p>
                      <p className="font-semibold text-white">{formData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white/60">Teléfono</p>
                      <p className="font-semibold text-white">{formData.user_phone}</p>
                    </div>
                    {formData.details.email && (
                      <div className="col-span-2">
                        <p className="text-sm text-white/60">Email</p>
                        <p className="font-semibold text-white">{formData.details.email}</p>
                      </div>
                    )}
                    {formData.details.notes && (
                      <div className="col-span-2">
                        <p className="text-sm text-white/60">Notas</p>
                        <p className="text-sm text-white/80">{formData.details.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-10 hidden items-center justify-between gap-4 md:flex">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-6 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
              Anterior
            </button>

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#0B5FFF] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0B5FFF]/30 transition-all hover:bg-[#0B5FFF]/90 focus:outline-none focus:ring-2 focus:ring-[#0B5FFF] focus:ring-offset-2 focus:ring-offset-black"
              >
                Siguiente
                <ChevronRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#10B981] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-[#10B981]/30 transition-all hover:bg-[#10B981]/90 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:ring-offset-2 focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5" />
                    Confirmar Pedido
                  </>
                )}
              </button>
            )}
          </div>

          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/60 px-4 py-3 shadow-[0_-10px_40px_-20px_rgba(0,0,0,0.8)] backdrop-blur md:hidden">
            <div className="mx-auto flex w-full max-w-lg items-center gap-3">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Atrás
              </button>
              {currentStep < STEPS.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0B5FFF] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0B5FFF]/30 transition-all hover:bg-[#0B5FFF]/90 focus:outline-none focus:ring-2 focus:ring-[#0B5FFF]"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#10B981] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#10B981]/30 transition-all hover:bg-[#10B981]/90 focus:outline-none focus:ring-2 focus:ring-[#10B981] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enviando
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Confirmar
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

// Export default con Suspense para evitar error de build
export default function OrdenPage() {
  return (
    <Suspense fallback={
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-950 via-indigo-950 to-neutral-900">
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      </main>
    }>
      <OrdenForm />
    </Suspense>
  );
}
