import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { UserShell } from "@/components/layout/UserShell";
import { MerchantShell } from "@/components/layout/MerchantShell";

import { Welcome } from "@/pages/Welcome";
import { Register } from "@/pages/Register";
import { NotFound } from "@/pages/NotFound";

import { Explore } from "@/pages/user/Explore";
import { OfferDetail } from "@/pages/user/OfferDetail";
import { ChooseCupo } from "@/pages/user/ChooseCupo";
import { Payment } from "@/pages/user/Payment";
import { Reserved } from "@/pages/user/Reserved";
import { Waiting } from "@/pages/user/Waiting";
import { Pass } from "@/pages/user/Pass";
import { MyCupos } from "@/pages/user/MyCupos";
import { Refund } from "@/pages/user/Refund";
import { Transfer } from "@/pages/user/Transfer";
import { Receipt } from "@/pages/user/Receipt";
import { Guarantee } from "@/pages/user/Guarantee";
import { Notices } from "@/pages/user/Notices";
import { Profile } from "@/pages/user/Profile";

import { Dashboard } from "@/pages/merchant/Dashboard";
import { Verification } from "@/pages/merchant/Verification";
import { NewOffer } from "@/pages/merchant/NewOffer";
import { Offers } from "@/pages/merchant/Offers";
import { OfferManage } from "@/pages/merchant/OfferManage";
import { WalletPage } from "@/pages/merchant/WalletPage";
import { Deposit } from "@/pages/merchant/Deposit";
import { Withdraw } from "@/pages/merchant/Withdraw";
import { PayQr } from "@/pages/merchant/PayQr";
import { Validate } from "@/pages/merchant/Validate";
import { Reports } from "@/pages/merchant/Reports";
import { Yield } from "@/pages/merchant/Yield";
import { Settings } from "@/pages/merchant/Settings";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <div className="flex min-h-dvh flex-col bg-paper-deep">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/bienvenida" element={<Welcome />} />
            <Route path="/registro" element={<Register />} />

            <Route element={<UserShell />}>
              <Route path="/explorar" element={<Explore />} />
              <Route path="/oferta/:offerId" element={<OfferDetail />} />
              <Route path="/oferta/:offerId/reservar" element={<ChooseCupo />} />
              <Route path="/pago/:cupoId" element={<Payment />} />
              <Route path="/reservado/:cupoId" element={<Reserved />} />
              <Route path="/esperando/:offerId" element={<Waiting />} />
              <Route path="/pase/:cupoId" element={<Pass />} />
              <Route path="/mis-cupos" element={<MyCupos />} />
              <Route path="/reembolso/:cupoId" element={<Refund />} />
              <Route path="/ceder/:cupoId" element={<Transfer />} />
              <Route path="/comprobante/:cupoId" element={<Receipt />} />
              <Route path="/garantia/:offerId" element={<Guarantee />} />
              <Route path="/avisos" element={<Notices />} />
              <Route path="/perfil" element={<Profile />} />
            </Route>

            <Route element={<MerchantShell />}>
              <Route path="/panel" element={<Dashboard />} />
              <Route path="/panel/ofertas" element={<Offers />} />
              <Route path="/panel/ofertas/nueva" element={<NewOffer />} />
              <Route path="/panel/ofertas/:offerId" element={<OfferManage />} />
              <Route path="/panel/billetera" element={<WalletPage />} />
              <Route path="/panel/billetera/depositar" element={<Deposit />} />
              <Route path="/panel/billetera/retirar" element={<Withdraw />} />
              <Route path="/panel/billetera/pagar-qr" element={<PayQr />} />
              <Route path="/panel/validar" element={<Validate />} />
              <Route path="/panel/reportes" element={<Reports />} />
              <Route path="/panel/rendimiento" element={<Yield />} />
              <Route path="/panel/configuracion" element={<Settings />} />
              <Route path="/panel/verificacion" element={<Verification />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
      <Toaster />
    </BrowserRouter>
  );
}
