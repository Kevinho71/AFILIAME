import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Compass, Filter, Search, ShieldCheck, SlidersHorizontal, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OfferCard } from "@/components/shared/OfferCard";
import { EmptyState, PageHeader } from "@/components/shared/pieces";
import { useAppStore } from "@/store/useAppStore";
import { CATEGORY_LABEL } from "@/lib/data";
import { publicOffers, available, cupoPrice } from "@/lib/selectors";
import { bob } from "@/lib/format";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORIES: (Category | "todos")[] = [
  "todos",
  "gimnasio",
  "coworking",
  "club",
  "academia",
  "parqueo",
  "otros",
];

export function Explore() {
  const offers = useAppStore((state) => state.offers);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "todos">("todos");
  const [city, setCity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [onlyProtected, setOnlyProtected] = useState(false);
  const [sort, setSort] = useState<"cierre" | "precio" | "progreso">("cierre");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const list = useMemo(() => {
    const term = query.trim().toLowerCase();
    const filtered = publicOffers(offers).filter((offer) => {
      if (category !== "todos" && offer.category !== category) return false;
      if (city && offer.city !== city) return false;
      if (maxPrice && cupoPrice(offer) > Number(maxPrice)) return false;
      if (onlyAvailable && available(offer) === 0) return false;
      if (onlyProtected && offer.releaseType !== "escalonada") return false;
      if (!term) return true;
      return (
        offer.business.toLowerCase().includes(term) ||
        offer.title.toLowerCase().includes(term) ||
        offer.tagline.toLowerCase().includes(term)
      );
    });

    return filtered.toSorted((a, b) => {
      const rank = (offer: (typeof filtered)[number]) =>
        ["reembolsada", "finalizada", "en_curso"].includes(offer.status) ? 1 : 0;
      const byRank = rank(a) - rank(b);
      if (byRank !== 0) return byRank;
      if (sort === "precio") return cupoPrice(a) - cupoPrice(b);
      if (sort === "progreso") return available(a) - available(b);
      return a.deadline.localeCompare(b.deadline);
    });
  }, [offers, query, category, city, maxPrice, onlyAvailable, onlyProtected, sort]);

  const activeFilters =
    (city ? 1 : 0) + (maxPrice ? 1 : 0) + (onlyAvailable ? 1 : 0) + (onlyProtected ? 1 : 0);

  const clearFilters = () => {
    setCity("");
    setMaxPrice("");
    setOnlyAvailable(false);
    setOnlyProtected(false);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Explora ofertas"
        subtitle="Anualidades divididas en cupos. Paga solo tu parte y deja el resto del año para otras personas."
      />

      <div className="space-y-3">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Busca gimnasio, coworking, academia…"
            aria-label="Buscar ofertas"
            className="pl-9"
          />
        </div>

        <div className="scrollbar-thin -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {CATEGORIES.map((item) => {
            const active = category === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={active}
                className={cn(
                  "shrink-0 cursor-pointer rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-ink",
                )}
              >
                {item === "todos" ? "Todos" : CATEGORY_LABEL[item]}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setFiltersOpen(true)}>
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            Filtros
            {activeFilters > 0 && (
              <Badge variant="soft" className="ml-0.5">
                {activeFilters}
              </Badge>
            )}
          </Button>
          <span className="text-[12.5px] text-muted-foreground">
            {list.length} {list.length === 1 ? "oferta" : "ofertas"}
          </span>
          {activeFilters > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto inline-flex cursor-pointer items-center gap-1 text-[12.5px] font-medium text-muted-foreground hover:text-ink"
            >
              <X className="size-3.5" aria-hidden="true" />
              Limpiar
            </button>
          )}
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No encontramos ofertas con esos filtros"
          description="Prueba con otra categoría, sube el precio máximo o quita el filtro de Pago Protegido."
          action={
            <Button variant="outline" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-card/70 px-3.5 py-3">
        <ShieldCheck className="size-4 shrink-0 text-brand/70" aria-hidden="true" />
        <p className="text-[11.5px] leading-relaxed text-muted-foreground">
          En todas las ofertas tu pago queda en garantía. Si el grupo no se completa antes del
          plazo, se devuelve automáticamente a tu cuenta de origen.
        </p>
      </div>

      <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filtros</DialogTitle>
            <DialogDescription>
              Ajusta la búsqueda para encontrar el cupo que necesitas.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <select
                id="city"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-card px-3 text-[15px]"
              >
                <option value="">Todas las ciudades</option>
                <option value="Tarija">Tarija</option>
                <option value="Santa Cruz">Santa Cruz</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Precio máximo por cupo (Bs)</Label>
              <Input
                id="price"
                inputMode="numeric"
                placeholder="Ej. 1000"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value.replace(/\D/g, ""))}
              />
              <p className="text-[11.5px] text-muted-foreground">
                Rango disponible: {bob(400)} a {bob(1200)}
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-xl border border-border/80 px-3.5 py-3">
              <div>
                <p className="text-[13.5px] font-medium text-ink">Solo con cupos disponibles</p>
                <p className="text-[11.5px] text-muted-foreground">Oculta ofertas completas</p>
              </div>
              <Switch checked={onlyAvailable} onCheckedChange={setOnlyAvailable} />
            </div>

            <div className="flex items-center justify-between gap-3 rounded-xl border border-border/80 px-3.5 py-3">
              <div>
                <p className="text-[13.5px] font-medium text-ink">Sello Pago Protegido</p>
                <p className="text-[11.5px] text-muted-foreground">
                  Liberación al negocio al inicio de cada periodo
                </p>
              </div>
              <Switch checked={onlyProtected} onCheckedChange={setOnlyProtected} />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 space-y-2">
                <Label htmlFor="sort">Ordenar por</Label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(event) => setSort(event.target.value as typeof sort)}
                  className="h-11 w-full rounded-xl border border-input bg-card px-3 text-[15px]"
                >
                  <option value="cierre">Cierra antes</option>
                  <option value="precio">Menor precio por cupo</option>
                  <option value="progreso">Cupos más libres</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={clearFilters}>
              Limpiar
            </Button>
            <Button className="ml-auto" onClick={() => setFiltersOpen(false)}>
              <Filter className="size-4" aria-hidden="true" />
              Ver {list.length} ofertas
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <p className="text-center text-[11.5px] text-muted-foreground">
        ¿No sabes por dónde empezar?{" "}
        <Link to="/oferta/powerfit" className="font-medium text-brand hover:underline">
          Mira el ejemplo de PowerFit
        </Link>
      </p>
    </div>
  );
}
