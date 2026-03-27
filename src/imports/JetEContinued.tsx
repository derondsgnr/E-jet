import clsx from "clsx";
import svgPaths from "./svg-9lxduz5ot3";
import imgContainer from "figma:asset/0e889f70402faee1946496e71d23211f80960ecc.png";

function LauncherBackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="flex-[1_0_0] h-[18.195px] min-h-px min-w-px relative">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">{children}</div>
    </div>
  );
}
type ContainerBackgroundImage2Props = {
  additionalClassNames?: string;
};

function ContainerBackgroundImage2({ children, additionalClassNames = "" }: React.PropsWithChildren<ContainerBackgroundImage2Props>) {
  return (
    <div className={clsx("bg-[rgba(255,255,255,0.04)] relative rounded-[16px] w-[464px]", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">{children}</div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}
type ContainerBackgroundImage1Props = {
  additionalClassNames?: string;
};

function ContainerBackgroundImage1({ children, additionalClassNames = "" }: React.PropsWithChildren<ContainerBackgroundImage1Props>) {
  return (
    <div className={clsx("h-[42px] relative shrink-0", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">{children}</div>
    </div>
  );
}
type ContainerBackgroundImageProps = {
  additionalClassNames?: string;
};

function ContainerBackgroundImage({ children, additionalClassNames = "" }: React.PropsWithChildren<ContainerBackgroundImageProps>) {
  return (
    <div className={clsx("relative rounded-[16px] shrink-0 size-[40px]", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">{children}</div>
    </div>
  );
}
type BackgroundImage3Props = {
  additionalClassNames?: string;
};

function BackgroundImage3({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage3Props>) {
  return (
    <div className={clsx("h-[19.594px] relative shrink-0", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">{children}</div>
    </div>
  );
}

function BackgroundImage2({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute content-stretch flex h-[16.797px] items-start left-[16px] top-[85.5px] w-[192px]">
      <p className="flex-[1_0_0] font-['Manrope:Regular',sans-serif] leading-[16.8px] min-h-px min-w-px not-italic relative text-[12px] text-[rgba(255,255,255,0.35)] tracking-[-0.24px]">{children}</p>
    </div>
  );
}

function BackgroundImage1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[16px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        {children}
      </svg>
    </div>
  );
}

function IconBackgroundImage1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[14px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">{children}</g>
      </svg>
    </div>
  );
}

function IconBackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[20px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">{children}</g>
      </svg>
    </div>
  );
}

function BackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <BackgroundImage1>
      <g id="Icon">{children}</g>
    </BackgroundImage1>
  );
}
type LauncherBackgroundImageAndText2Props = {
  text: string;
};

function LauncherBackgroundImageAndText2({ text }: LauncherBackgroundImageAndText2Props) {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.06)] content-stretch flex h-[18px] items-start left-[172.92px] px-[8px] py-[2px] rounded-[4px] top-[12px] w-[39.078px]">
      <p className="font-['Manrope:Medium',sans-serif] leading-[14px] not-italic relative shrink-0 text-[10px] text-[rgba(255,255,255,0.35)] tracking-[-0.32px] whitespace-nowrap">{text}</p>
    </div>
  );
}
type LauncherBackgroundImageAndText1Props = {
  text: string;
};

function LauncherBackgroundImageAndText1({ text }: LauncherBackgroundImageAndText1Props) {
  return <BackgroundImage2>{text}</BackgroundImage2>;
}
type LauncherBackgroundImageAndTextProps = {
  text: string;
};

function LauncherBackgroundImageAndText({ text }: LauncherBackgroundImageAndTextProps) {
  return (
    <div className="absolute h-[19.5px] left-[16px] top-[64px] w-[192px]">
      <p className="absolute font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[19.5px] left-0 text-[15px] text-white top-[-0.5px] tracking-[-0.3px] whitespace-nowrap">{text}</p>
    </div>
  );
}

function ButtonBackgroundImage1() {
  return (
    <div className="bg-[rgba(255,255,255,0.06)] flex-[1_0_0] h-[45.594px] min-h-px min-w-px relative rounded-[16px]">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center justify-center pl-px pr-[1.008px] py-px relative size-full">
          <BackgroundImage3 additionalClassNames="w-[76.742px]">
            <p className="-translate-x-1/2 absolute font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[19.6px] left-[38px] text-[14px] text-[rgba(255,255,255,0.7)] text-center top-0 tracking-[-0.28px] whitespace-nowrap">{"Dashboard"}</p>
          </BackgroundImage3>
          <BackgroundImage>
            <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" strokeWidth="1.33333" />
            <path d={svgPaths.p1d405500} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" strokeWidth="1.33333" />
          </BackgroundImage>
        </div>
      </div>
    </div>
  );
}
type ButtonBackgroundImageProps = {
  additionalClassNames?: string;
};

function ButtonBackgroundImage({ additionalClassNames = "" }: ButtonBackgroundImageProps) {
  return (
    <div className={clsx("flex-[1_0_0] h-[45.594px] min-h-px min-w-px relative rounded-[16px]", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center justify-center relative size-full">
        <BackgroundImage>
          <path d={svgPaths.p15efa800} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 12H8.00667" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </BackgroundImage>
        <BackgroundImage3 additionalClassNames="w-[84.359px]">
          <p className="-translate-x-1/2 absolute font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[19.6px] left-[42.5px] text-[14px] text-center text-white top-0 tracking-[-0.28px] whitespace-nowrap">{"Onboarding"}</p>
        </BackgroundImage3>
      </div>
    </div>
  );
}
type ParagraphBackgroundImageAndTextProps = {
  text: string;
};

function ParagraphBackgroundImageAndText({ text }: ParagraphBackgroundImageAndTextProps) {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full">
      <p className="absolute font-['Manrope:Regular',sans-serif] leading-[19.5px] left-0 not-italic text-[13px] text-[rgba(255,255,255,0.4)] top-[-0.5px] tracking-[-0.26px] whitespace-nowrap">{text}</p>
    </div>
  );
}
type HeadingBackgroundImageAndTextProps = {
  text: string;
};

function HeadingBackgroundImageAndText({ text }: HeadingBackgroundImageAndTextProps) {
  return (
    <div className="content-stretch flex h-[22.5px] items-start relative shrink-0 w-full">
      <p className="flex-[1_0_0] font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[22.5px] min-h-px min-w-px relative text-[18px] text-white tracking-[-0.36px]">{text}</p>
    </div>
  );
}
type ContainerBackgroundImageAndTextProps = {
  text: string;
  additionalClassNames?: string;
};

function ContainerBackgroundImageAndText({ text, additionalClassNames = "" }: ContainerBackgroundImageAndTextProps) {
  return (
    <div className={clsx("absolute h-[24px] left-[24px] w-[464px]", additionalClassNames)}>
      <p className="absolute font-['Manrope:Medium',sans-serif] leading-[16.5px] left-0 not-italic text-[11px] text-[rgba(255,255,255,0.3)] top-[5.5px] tracking-[0.66px] uppercase whitespace-nowrap">{text}</p>
    </div>
  );
}

export default function JetEContinued() {
  return (
    <div className="bg-[#fafafa] content-stretch flex flex-col items-start relative size-full" data-name="Jet e continued">
      <div className="bg-[#0b0b0d] h-[1142.266px] overflow-clip relative shrink-0 w-full" data-name="Launcher">
        <div className="absolute h-[400px] left-[219.5px] top-[742.27px] w-[500px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 500 400\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0 -28.284 -35.355 0 250 200)\\'><stop stop-color=\\'rgba(29,185,84,0.07)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(0,0,0,0)\\' offset=\\'0.7\\'/></radialGradient></defs></svg>')" }} />
        <div className="absolute left-[719px] size-[300px] top-[-80px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 300 300\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0 -21.213 -21.213 0 150 150)\\'><stop stop-color=\\'rgba(29,185,84,0.03)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(0,0,0,0)\\' offset=\\'0.6\\'/></radialGradient></defs></svg>')" }} />
        <div className="absolute h-[1142.266px] left-0 top-0 w-[939px]" data-name="Container">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute h-[13.13%] left-0 max-w-none top-0 w-[15.97%]" src={imgContainer} />
          </div>
        </div>
        <div className="absolute h-[1142.266px] left-[213.5px] top-0 w-[512px]" data-name="Container">
          <div className="absolute h-[116.094px] left-[161.2px] top-[64px] w-[189.586px]" data-name="Container">
            <div className="absolute h-[40px] left-[75.68px] top-0 w-[38.227px]" data-name="JetLogo" />
            <div className="absolute h-[33.594px] left-[70.86px] top-[56px] w-[47.859px]" data-name="Launcher">
              <p className="absolute font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[33.6px] left-0 text-[28px] text-white top-[-0.5px] tracking-[-0.84px] whitespace-nowrap">JET</p>
            </div>
            <div className="absolute h-[22.5px] left-0 top-[93.59px] w-[189.586px]" data-name="Launcher">
              <p className="-translate-x-1/2 absolute font-['Manrope:Regular',sans-serif] leading-[22.5px] left-[95px] not-italic text-[15px] text-[rgba(255,255,255,0.45)] text-center top-0 tracking-[-0.3px] whitespace-nowrap">Premium e-hailing for Nigeria</p>
            </div>
          </div>
          <ContainerBackgroundImageAndText text="Mobile apps" additionalClassNames="top-[220.09px]" />
          <div className="absolute content-stretch flex flex-col gap-[16px] h-[315.188px] items-start left-[24px] top-[256.09px] w-[464px]" data-name="Container">
            <ContainerBackgroundImage2 additionalClassNames="h-[149.594px] shrink-0">
              <div className="absolute content-stretch flex gap-[12px] h-[42px] items-center left-[21px] top-[21px] w-[422px]" data-name="Launcher">
                <ContainerBackgroundImage additionalClassNames="bg-[rgba(29,185,84,0.08)]">
                  <IconBackgroundImage>
                    <path d={svgPaths.p3b004e00} id="Vector" stroke="var(--stroke-0, #1DB954)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                  </IconBackgroundImage>
                </ContainerBackgroundImage>
                <ContainerBackgroundImage1 additionalClassNames="w-[216.414px]">
                  <HeadingBackgroundImageAndText text="Rider App" />
                  <ParagraphBackgroundImageAndText text="Book rides, track drivers, manage trips" />
                </ContainerBackgroundImage1>
              </div>
              <div className="absolute content-stretch flex gap-[8px] h-[65.594px] items-start left-px px-[20px] top-[83px] w-[462px]" data-name="Launcher">
                <ButtonBackgroundImage additionalClassNames="bg-[#1db954]" />
                <ButtonBackgroundImage1 />
              </div>
            </ContainerBackgroundImage2>
            <ContainerBackgroundImage2 additionalClassNames="flex-[1_0_0] min-h-px min-w-px">
              <div className="absolute content-stretch flex gap-[12px] h-[42px] items-center left-[21px] top-[21px] w-[422px]" data-name="Launcher">
                <ContainerBackgroundImage additionalClassNames="bg-[rgba(59,130,246,0.08)]">
                  <IconBackgroundImage>
                    <path d={svgPaths.p382997c0} id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d={svgPaths.p2ad65a80} id="Vector_2" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d="M7.5 14.1667H12.5" id="Vector_3" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d={svgPaths.p3849af00} id="Vector_4" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                  </IconBackgroundImage>
                </ContainerBackgroundImage>
                <ContainerBackgroundImage1 additionalClassNames="w-[252.117px]">
                  <HeadingBackgroundImageAndText text="Driver App" />
                  <ParagraphBackgroundImageAndText text="Accept trips, track earnings, manage vehicle" />
                </ContainerBackgroundImage1>
              </div>
              <div className="absolute content-stretch flex gap-[8px] h-[65.594px] items-start left-px px-[20px] top-[83px] w-[462px]" data-name="Launcher">
                <ButtonBackgroundImage additionalClassNames="bg-[#3b82f6]" />
                <ButtonBackgroundImage1 />
              </div>
            </ContainerBackgroundImage2>
          </div>
          <ContainerBackgroundImageAndText text="Web surfaces" additionalClassNames="top-[603.28px]" />
          <div className="absolute h-[252.594px] left-[24px] top-[639.28px] w-[464px]" data-name="Container">
            <div className="absolute bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] border-solid h-[120.297px] left-0 overflow-clip rounded-[16px] top-0 w-[226px]" data-name="Button">
              <div className="absolute bg-[rgba(29,185,84,0.07)] content-stretch flex items-center justify-center left-[16px] rounded-[12px] size-[36px] top-[16px]" data-name="Launcher">
                <BackgroundImage1>
                  <g clipPath="url(#clip0_18_401)" id="Icon">
                    <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #1DB954)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    <path d={svgPaths.p14d10c00} id="Vector_2" stroke="var(--stroke-0, #1DB954)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    <path d="M1.33333 8H14.6667" id="Vector_3" stroke="var(--stroke-0, #1DB954)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  </g>
                  <defs>
                    <clipPath id="clip0_18_401">
                      <rect fill="white" height="16" width="16" />
                    </clipPath>
                  </defs>
                </BackgroundImage1>
              </div>
              <LauncherBackgroundImageAndText text="Marketing Website" />
              <LauncherBackgroundImageAndText1 text="Public-facing landing page" />
            </div>
            <div className="absolute bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] border-solid h-[120.297px] left-[238px] opacity-55 overflow-clip rounded-[16px] top-0 w-[226px]" data-name="Button">
              <div className="absolute bg-[rgba(245,158,11,0.07)] content-stretch flex items-center justify-center left-[16px] rounded-[12px] size-[36px] top-[16px]" data-name="Launcher">
                <BackgroundImage>
                  <path d={svgPaths.pea6a680} id="Vector" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  <path d={svgPaths.p3155f180} id="Vector_2" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                </BackgroundImage>
              </div>
              <LauncherBackgroundImageAndText text="Fleet Owner" />
              <BackgroundImage2>{`Vehicle & driver management`}</BackgroundImage2>
              <LauncherBackgroundImageAndText2 text="Soon" />
            </div>
            <div className="absolute bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] border-solid h-[120.297px] left-0 opacity-55 overflow-clip rounded-[16px] top-[132.3px] w-[226px]" data-name="Button">
              <div className="absolute bg-[rgba(139,92,246,0.07)] content-stretch flex items-center justify-center left-[16px] rounded-[12px] size-[36px] top-[16px]" data-name="Launcher">
                <BackgroundImage1>
                  <g clipPath="url(#clip0_18_386)" id="Icon">
                    <path d={svgPaths.pda21400} id="Vector" stroke="var(--stroke-0, #8B5CF6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    <path d={svgPaths.p1be36900} id="Vector_2" stroke="var(--stroke-0, #8B5CF6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    <path d={svgPaths.pa8d100} id="Vector_3" stroke="var(--stroke-0, #8B5CF6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    <path d="M6.66667 4H9.33333" id="Vector_4" stroke="var(--stroke-0, #8B5CF6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    <path d="M6.66667 6.66667H9.33333" id="Vector_5" stroke="var(--stroke-0, #8B5CF6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    <path d="M6.66667 9.33333H9.33333" id="Vector_6" stroke="var(--stroke-0, #8B5CF6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    <path d="M6.66667 12H9.33333" id="Vector_7" stroke="var(--stroke-0, #8B5CF6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  </g>
                  <defs>
                    <clipPath id="clip0_18_386">
                      <rect fill="white" height="16" width="16" />
                    </clipPath>
                  </defs>
                </BackgroundImage1>
              </div>
              <LauncherBackgroundImageAndText text="Hotel Portal" />
              <LauncherBackgroundImageAndText1 text="Guest transport booking" />
              <LauncherBackgroundImageAndText2 text="Soon" />
            </div>
            <div className="absolute bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] border-solid h-[120.297px] left-[238px] overflow-clip rounded-[16px] top-[132.3px] w-[226px]" data-name="Button">
              <div className="absolute bg-[rgba(239,68,68,0.07)] content-stretch flex items-center justify-center left-[16px] rounded-[12px] size-[36px] top-[16px]" data-name="Launcher">
                <BackgroundImage>
                  <path d={svgPaths.p37f49070} id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  <path d={svgPaths.p17134c00} id="Vector_2" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                </BackgroundImage>
              </div>
              <LauncherBackgroundImageAndText text="Admin Dashboard" />
              <BackgroundImage2>{`Platform management & ops`}</BackgroundImage2>
            </div>
          </div>
          <div className="absolute bg-[rgba(255,255,255,0.03)] content-stretch flex gap-[8px] h-[40.195px] items-center left-[162.98px] px-[17px] py-px rounded-[16px] top-[923.88px] w-[186.039px]" data-name="Button">
            <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.06)] border-solid inset-0 pointer-events-none rounded-[16px]" />
            <IconBackgroundImage1>
              <path d={svgPaths.p33035500} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.3" strokeWidth="1.16667" />
            </IconBackgroundImage1>
            <LauncherBackgroundImage>
              <p className="font-['Manrope:Medium',sans-serif] leading-[18.2px] not-italic relative shrink-0 text-[13px] text-[rgba(255,255,255,0.35)] text-center tracking-[-0.26px] whitespace-nowrap">Driver verification flow</p>
            </LauncherBackgroundImage>
          </div>
          <div className="absolute bg-[rgba(29,185,84,0.03)] content-stretch flex gap-[8px] h-[40.195px] items-center left-[185.55px] px-[17px] py-px rounded-[16px] top-[972.07px] w-[140.883px]" data-name="Button">
            <div aria-hidden="true" className="absolute border border-[rgba(29,185,84,0.13)] border-solid inset-0 pointer-events-none rounded-[16px]" />
            <IconBackgroundImage1>
              <path d={svgPaths.pd1f0180} id="Vector" stroke="var(--stroke-0, #1DB954)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
              <path d={svgPaths.p1c197ec0} id="Vector_2" stroke="var(--stroke-0, #1DB954)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
              <path d="M5.83333 5.25H4.66667" id="Vector_3" stroke="var(--stroke-0, #1DB954)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
              <path d="M9.33333 7.58333H4.66667" id="Vector_4" stroke="var(--stroke-0, #1DB954)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
              <path d="M9.33333 9.91667H4.66667" id="Vector_5" stroke="var(--stroke-0, #1DB954)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
            </IconBackgroundImage1>
            <LauncherBackgroundImage>
              <p className="font-['Manrope:Medium',sans-serif] leading-[18.2px] not-italic relative shrink-0 text-[13px] text-[rgba(29,185,84,0.67)] text-center tracking-[-0.26px] whitespace-nowrap">Admin briefing</p>
            </LauncherBackgroundImage>
          </div>
          <div className="absolute h-[66px] left-[162.25px] top-[1012.27px] w-[187.5px]" data-name="Paragraph">
            <p className="-translate-x-1/2 absolute font-['Manrope:Regular',sans-serif] leading-[18px] left-[94px] not-italic text-[12px] text-[rgba(255,255,255,0.2)] text-center top-[31.5px] tracking-[-0.32px] whitespace-nowrap">Demo prototype · Not for production</p>
          </div>
        </div>
      </div>
    </div>
  );
}