"use client";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  className?: string;
  children?: ReactNode;
  handleClick?: () => void;
  buttonText?: string;
  instantMeeting?: boolean;
  image?: string;
  buttonClassName?: string;
  buttonIcon?: string;
}

const Modal = ({
  isOpen,
  onClose = () => {},
  title,
  className,
  children,
  handleClick = () => {},
  buttonText,
  instantMeeting,
  image,
  buttonClassName,
  buttonIcon,
}: ModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex-center flex w-full max-w-[520px] flex-col gap-6 border-none bg-white px-6 py-9 text-white">
        <div className="flex w-full flex-col gap-6">
          {image && (
            <div className="flex justify-center">
              <Image src={image} alt="checked" width={72} height={72} />
            </div>
          )}
          <h1
            className={cn(
              "text-3xl font-bold leading-[42px] text-dark100_light900",
              className
            )}
          >
            {title}
          </h1>
          {children}
          {buttonText && (
            <Button
              type="submit"
              className="primary-gradient w-fit text-white"
              disabled={false}
              onClick={handleClick}
            >
              {buttonText}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
