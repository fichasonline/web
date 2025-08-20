// service-card.tsx (versión mejorada por separado)
"use client";

import { motion } from "framer-motion";

export function ServiceCard({
  service,
}: {
  service: {
    id: string;
    name: string;
    description: string;
    icon: any;
    features: string[];
    color: "purple" | "blue" | "green" | "orange";
  };
}) {
  const Icon = service.icon;

  const colorRing: Record<typeof service.color, string> = {
    purple: "from-purple-500/30 to-purple-500/0",
    blue: "from-blue-500/30 to-blue-500/0",
    green: "from-green-500/30 to-green-500/0",
    orange: "from-orange-500/30 to-orange-500/0",
  } as any;

  const badge: Record<typeof service.color, string> = {
    purple: "bg-purple-100 text-purple-600 border-purple-200",
    blue: "bg-blue-100 text-blue-600 border-blue-200",
    green: "bg-green-100 text-green-600 border-green-200",
    orange: "bg-orange-100 text-orange-600 border-orange-200",
  } as any;

  return (
    <motion.div
      whileHover={{ y: -6, rotateX: 0.6, rotateY: -0.6 }}
      transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative"
    >
      {/* Borde animado (aparece al hover) */}
      <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-[radial-gradient(120px_60px_at_20%_0%,rgba(139,92,246,0.25),transparent_70%)]" />

      <div className="group relative rounded-2xl border border-neutral-200 bg-white p-6 lg:p-7 shadow-sm hover:shadow-md transition-all">
        {/* Halo superior según color */}
        <div
          className={`pointer-events-none absolute -top-10 left-1/2 h-20 w-40 -translate-x-1/2 rounded-full bg-gradient-to-b ${colorRing[service.color]} blur-2xl`}
          aria-hidden
        />

        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-5 border ${badge[service.color]}`}>
          <Icon className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-display font-semibold text-neutral-900 mb-2">
          {service.name}
        </h3>
        <p className="text-neutral-600 mb-5 leading-relaxed min-h-[60px]">
          {service.description}
        </p>

        <ul className="space-y-2 mb-5">
          {service.features.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-neutral-600">
              <span className="block w-1.5 h-1.5 rounded-full bg-purple-600" />
              {f}
            </li>
          ))}
        </ul>

        <button className="inline-flex w-full items-center justify-center rounded-lg border border-purple-200 bg-purple-600/90 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-purple-600">
          Más información
        </button>
      </div>
    </motion.div>
  );
}
