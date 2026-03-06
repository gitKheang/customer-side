import { ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
}

const PhoneFrame = ({ children }: PhoneFrameProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="phone-frame bg-background relative">
        <div className="phone-notch" />
        <div className="h-full w-full overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PhoneFrame;
