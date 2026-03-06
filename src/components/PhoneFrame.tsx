import { ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
}

const PhoneFrame = ({ children }: PhoneFrameProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-muted to-muted/80 p-4">
      <div className="phone-frame relative">
        <div className="phone-dynamic-island" />
        <div className="h-full w-full overflow-hidden">
          {children}
        </div>
        <div className="phone-home-indicator" />
      </div>
    </div>
  );
};

export default PhoneFrame;
