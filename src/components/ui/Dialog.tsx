import {
  Dialog as BaseDialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/shadcn/dialog";

interface Props {
  title: string;
  description?: string;
  open: boolean;
  onClose: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog = ({ title, description, open, onClose, children }: Props) => {
  return (
    <BaseDialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </BaseDialog>
  );
};

export default Dialog;
