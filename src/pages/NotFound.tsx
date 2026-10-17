import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/pieces";
import { Compass } from "lucide-react";

export function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <EmptyState
        icon={Compass}
        title="Esta pantalla no existe"
        description="La dirección no corresponde a ninguna pantalla. Vuelve al inicio."
        action={
          <Button asChild>
            <Link to="/explorar">Ir a Explorar</Link>
          </Button>
        }
      />
    </div>
  );
}
