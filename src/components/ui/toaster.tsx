import { Toaster as Sonner, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="light"
      position="top-center"
      gap={10}
      toastOptions={{
        classNames: {
          toast:
            "!rounded-xl !border !border-border !bg-card !text-ink !shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)]",
          title: "!text-[13.5px] !font-semibold",
          description: "!text-[12.5px] !text-muted-foreground",
          actionButton: "!rounded-lg !bg-primary !text-primary-foreground",
        },
      }}
      {...props}
    />
  );
}
