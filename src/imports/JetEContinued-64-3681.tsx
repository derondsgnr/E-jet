import clsx from "clsx";
import svgPaths from "./svg-3yztndqx41";
type ContainerBackgroundImage1Props = {
  additionalClassNames?: string;
};

function ContainerBackgroundImage1({ children, additionalClassNames = "" }: React.PropsWithChildren<ContainerBackgroundImage1Props>) {
  return (
    <div style={{ backgroundImage: "linear-gradient(135deg, rgba(85, 85, 96, 0.082) 0%, rgba(85, 85, 96, 0.02) 100%)" }} className={clsx("absolute content-stretch flex items-center justify-center left-0 py-px rounded-[16px] top-0", additionalClassNames)}>
      {children}
    </div>
  );
}
type ContainerBackgroundImageProps = {
  additionalClassNames?: string;
};

function ContainerBackgroundImage({ children, additionalClassNames = "" }: React.PropsWithChildren<ContainerBackgroundImageProps>) {
  return (
    <div style={{ backgroundImage: "linear-gradient(135deg, rgba(59, 130, 246, 0.082) 0%, rgba(59, 130, 246, 0.02) 100%)" }} className={clsx("absolute content-stretch flex items-center justify-center left-0 py-px rounded-[16px] size-[36px] top-0", additionalClassNames)}>
      {children}
    </div>
  );
}
type ButtonBackgroundImage1Props = {
  additionalClassNames?: string;
};

function ButtonBackgroundImage1({ children, additionalClassNames = "" }: React.PropsWithChildren<ButtonBackgroundImage1Props>) {
  return (
    <div className={clsx("h-[36.398px] relative rounded-[16px]", additionalClassNames)}>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">{children}</div>
    </div>
  );
}

function BackgroundImage10({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="flex flex-row items-center size-full">
      <div className="content-stretch flex gap-[12px] items-center pl-[13px] pr-px py-px relative size-full">{children}</div>
    </div>
  );
}

function VectorBackgroundImage1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute inset-[6.25%_0_0_0]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 15">
        {children}
      </svg>
    </div>
  );
}
type BackgroundImage9Props = {
  additionalClassNames?: string;
};

function BackgroundImage9({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage9Props>) {
  return (
    <div className={clsx("flex-[1_0_0] min-h-px min-w-px relative", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">{children}</div>
    </div>
  );
}

function SparklineBackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="h-[16px] relative shrink-0 w-[40px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 16">
        {children}
      </svg>
    </div>
  );
}
type BackgroundImage8Props = {
  additionalClassNames?: string;
};

function BackgroundImage8({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage8Props>) {
  return (
    <div className={clsx("relative rounded-[12px] shrink-0", additionalClassNames)}>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">{children}</div>
    </div>
  );
}
type BackgroundImage7Props = {
  additionalClassNames?: string;
};

function BackgroundImage7({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage7Props>) {
  return (
    <div className={additionalClassNames}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">{children}</div>
    </div>
  );
}
type BackgroundImage6Props = {
  additionalClassNames?: string;
};

function BackgroundImage6({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage6Props>) {
  return <BackgroundImage7 additionalClassNames={clsx("flex-[1_0_0] min-h-px min-w-px relative", additionalClassNames)}>{children}</BackgroundImage7>;
}
type BackgroundImage5Props = {
  additionalClassNames?: string;
};

function BackgroundImage5({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage5Props>) {
  return <BackgroundImage7 additionalClassNames={clsx("relative shrink-0", additionalClassNames)}>{children}</BackgroundImage7>;
}
type BackgroundImage4Props = {
  additionalClassNames?: string;
};

function BackgroundImage4({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage4Props>) {
  return (
    <div className={clsx("bg-[rgba(255,255,255,0.03)] flex-[1_0_0] min-h-px min-w-px relative rounded-[16px]", additionalClassNames)}>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.04)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">{children}</div>
    </div>
  );
}
type BackgroundImage3Props = {
  additionalClassNames?: string;
};

function BackgroundImage3({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage3Props>) {
  return (
    <div className={additionalClassNames}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">{children}</div>
    </div>
  );
}
type BackgroundImage2Props = {
  additionalClassNames?: string;
};

function BackgroundImage2({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage2Props>) {
  return <BackgroundImage3 additionalClassNames={clsx("relative shrink-0", additionalClassNames)}>{children}</BackgroundImage3>;
}
type BackgroundImage1Props = {
  additionalClassNames?: string;
};

function BackgroundImage1({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage1Props>) {
  return (
    <div className={clsx("size-[12px]", additionalClassNames)}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        {children}
      </svg>
    </div>
  );
}

function Icon16VectorBackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute inset-1/4">
      <div className="absolute inset-[-8.33%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.16667 8.16667">
          {children}
        </svg>
      </div>
    </div>
  );
}
type ButtonBackgroundImageProps = {
  additionalClassNames?: string;
};

function ButtonBackgroundImage({ children, additionalClassNames = "" }: React.PropsWithChildren<ButtonBackgroundImageProps>) {
  return (
    <div className={clsx("h-[40px] relative rounded-[16px] shrink-0 w-full", additionalClassNames)}>
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[9.5px] relative size-full">{children}</div>
      </div>
    </div>
  );
}

function IconBackgroundImage2({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[16px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">{children}</g>
      </svg>
    </div>
  );
}

function VectorBackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute inset-[6.25%_0]">
      <div className="absolute inset-[-5.36%_-1.88%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 41.5004 15.5004">
          {children}
        </svg>
      </div>
    </div>
  );
}
type IconBackgroundImage1Props = {
  additionalClassNames?: string;
};

function IconBackgroundImage1({ children, additionalClassNames = "" }: React.PropsWithChildren<IconBackgroundImage1Props>) {
  return (
    <div className={clsx("size-[14px]", additionalClassNames)}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">{children}</g>
      </svg>
    </div>
  );
}
type BackgroundImageProps = {
  additionalClassNames?: string;
};

function BackgroundImage({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImageProps>) {
  return (
    <BackgroundImage1 additionalClassNames={additionalClassNames}>
      <g id="Icon">{children}</g>
    </BackgroundImage1>
  );
}
type TextBackgroundImageAndText9Props = {
  text: string;
};

function TextBackgroundImageAndText9({ text }: TextBackgroundImageAndText9Props) {
  return (
    <div className="content-stretch flex h-[12.594px] items-start relative shrink-0 w-full">
      <p className="flex-[1_0_0] font-['Manrope:Medium',sans-serif] leading-[12.6px] min-h-px min-w-px not-italic relative text-[9px] text-[rgba(255,255,255,0.25)] tracking-[0.54px] uppercase">{text}</p>
    </div>
  );
}
type TextBackgroundImageAndText8Props = {
  text: string;
  additionalClassNames?: string;
};

function TextBackgroundImageAndText8({ text, additionalClassNames = "" }: TextBackgroundImageAndText8Props) {
  return (
    <BackgroundImage3 additionalClassNames={clsx("h-[14.109px] relative shrink-0", additionalClassNames)}>
      <p className="font-['Manrope:Medium',sans-serif] leading-[14.112px] not-italic relative shrink-0 text-[#555560] text-[10.08px] tracking-[-0.2016px] whitespace-nowrap">{text}</p>
    </BackgroundImage3>
  );
}
type TextBackgroundImageAndText7Props = {
  text: string;
  additionalClassNames?: string;
};

function TextBackgroundImageAndText7({ text, additionalClassNames = "" }: TextBackgroundImageAndText7Props) {
  return (
    <BackgroundImage3 additionalClassNames={clsx("h-[14.109px] relative shrink-0", additionalClassNames)}>
      <p className="font-['Manrope:Medium',sans-serif] leading-[14.112px] not-italic relative shrink-0 text-[#3b82f6] text-[10.08px] tracking-[-0.2016px] whitespace-nowrap">{text}</p>
    </BackgroundImage3>
  );
}
type TextBackgroundImageAndText6Props = {
  text: string;
  additionalClassNames?: string;
};

function TextBackgroundImageAndText6({ text, additionalClassNames = "" }: TextBackgroundImageAndText6Props) {
  return (
    <div className={clsx("absolute h-[15px] top-0 w-[28.398px]", additionalClassNames)}>
      <p className="absolute font-['Manrope:Regular',sans-serif] leading-[15px] left-0 not-italic text-[#3b82f6] text-[10px] top-[0.5px] tracking-[-0.2px] whitespace-nowrap">{text}</p>
    </div>
  );
}

function IconBackgroundImage() {
  return (
    <BackgroundImage additionalClassNames="relative shrink-0">
      <path d="M4.5 9L7.5 6L4.5 3" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" />
    </BackgroundImage>
  );
}
type TextBackgroundImageAndText5Props = {
  text: string;
  additionalClassNames?: string;
};

function TextBackgroundImageAndText5({ text, additionalClassNames = "" }: TextBackgroundImageAndText5Props) {
  return (
    <div className={clsx("absolute content-stretch flex h-[15.398px] items-start left-0 top-0", additionalClassNames)}>
      <p className="font-['Manrope:Medium','Noto_Sans:Medium',sans-serif] leading-[15.4px] relative shrink-0 text-[11px] text-right text-white tracking-[-0.22px] whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 500" }}>
        {text}
      </p>
    </div>
  );
}
type TextBackgroundImageAndText4Props = {
  text: string;
  additionalClassNames?: string;
};

function TextBackgroundImageAndText4({ text, additionalClassNames = "" }: TextBackgroundImageAndText4Props) {
  return (
    <div className={clsx("absolute h-[15px] top-0 w-[2.07px]", additionalClassNames)}>
      <p className="absolute font-['Manrope:Regular',sans-serif] leading-[15px] left-0 not-italic text-[10px] text-[rgba(255,255,255,0.25)] top-[0.5px] tracking-[-0.2px] whitespace-nowrap">{text}</p>
    </div>
  );
}
type TextBackgroundImageAndText3Props = {
  text: string;
  additionalClassNames?: string;
};

function TextBackgroundImageAndText3({ text, additionalClassNames = "" }: TextBackgroundImageAndText3Props) {
  return (
    <div className={clsx("absolute h-[15px] left-0 top-0", additionalClassNames)}>
      <p className="absolute font-['Manrope:Regular',sans-serif] leading-[15px] left-0 not-italic text-[10px] text-[rgba(255,255,255,0.35)] top-[0.5px] tracking-[-0.2px] whitespace-nowrap">{text}</p>
    </div>
  );
}
type TextBackgroundImageAndText2Props = {
  text: string;
  additionalClassNames?: string;
};

function TextBackgroundImageAndText2({ text, additionalClassNames = "" }: TextBackgroundImageAndText2Props) {
  return (
    <div className={clsx("h-[16.797px] relative shrink-0", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start overflow-clip relative rounded-[inherit] size-full">
        <p className="font-['Manrope:Medium',sans-serif] leading-[16.8px] not-italic relative shrink-0 text-[12px] text-white tracking-[-0.24px] whitespace-nowrap">{text}</p>
      </div>
    </div>
  );
}
type TextBackgroundImageAndText1Props = {
  text: string;
  additionalClassNames?: string;
};

function TextBackgroundImageAndText1({ text, additionalClassNames = "" }: TextBackgroundImageAndText1Props) {
  return (
    <div className={clsx("absolute content-stretch flex h-[15px] items-start opacity-70 top-[7px]", additionalClassNames)}>
      <p className="font-['Manrope:Medium',sans-serif] leading-[15.4px] not-italic relative shrink-0 text-[11px] text-[rgba(255,255,255,0.35)] text-center tracking-[-0.22px] whitespace-nowrap">{text}</p>
    </div>
  );
}
type ButtonBackgroundImageAndTextProps = {
  text: string;
};

function ButtonBackgroundImageAndText({ text }: ButtonBackgroundImageAndTextProps) {
  return (
    <BackgroundImage4 additionalClassNames="h-[72.398px]">
      <KpiTileBackgroundImageAndText text="1" />
      <p className="absolute font-['Manrope:Regular',sans-serif] leading-[15px] left-[13px] not-italic text-[10px] text-[rgba(255,255,255,0.35)] top-[43.5px] tracking-[-0.2px] whitespace-nowrap">{text}</p>
    </BackgroundImage4>
  );
}
type KpiTileBackgroundImageAndTextProps = {
  text: string;
};

function KpiTileBackgroundImageAndText({ text }: KpiTileBackgroundImageAndTextProps) {
  return (
    <div className="absolute h-[24px] left-[13px] top-[13px] w-[179.75px]">
      <p className="absolute font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[24px] left-0 text-[20px] text-white top-[-0.5px] tracking-[-0.6px] whitespace-nowrap">{text}</p>
    </div>
  );
}
type TextBackgroundImageAndTextProps = {
  text: string;
};

function TextBackgroundImageAndText({ text }: TextBackgroundImageAndTextProps) {
  return (
    <BackgroundImage5 additionalClassNames="h-[13.5px] w-[13.375px]">
      <p className="absolute font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[13.5px] left-0 text-[9px] text-[rgba(255,255,255,0.35)] top-0 tracking-[-0.18px] whitespace-nowrap">{text}</p>
    </BackgroundImage5>
  );
}

export default function JetEContinued() {
  return (
    <div className="bg-white relative size-full" data-name="Jet e continued">
      <div className="absolute bg-[#08080a] h-[813px] left-0 overflow-clip top-0 w-[939px]" data-name="FleetShellInner">
        <div className="absolute h-[813px] left-0 top-0 w-[939px]" data-name="Container">
          <div className="absolute content-stretch flex flex-col h-[813px] items-start left-[48px] top-0 w-[891px]" data-name="Container">
            <div className="bg-gradient-to-b from-[rgba(255,255,255,0.02)] h-[52px] relative shrink-0 to-[rgba(0,0,0,0)] w-[891px]" data-name="FleetTopBar">
              <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.04)] border-b border-solid inset-0 pointer-events-none" />
              <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                <div className="absolute content-stretch flex gap-[6px] h-[27.5px] items-center left-[641.95px] px-[11px] py-px rounded-[12px] top-[11.75px] w-[141.047px]" data-name="Container">
                  <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.04)] border-solid inset-0 pointer-events-none rounded-[12px]" />
                  <BackgroundImage6 additionalClassNames="h-[13.5px]">
                    <p className="absolute font-['Manrope:Regular',sans-serif] leading-[13.5px] left-0 not-italic text-[9px] text-[rgba(255,255,255,0.25)] top-[-0.5px] tracking-[-0.18px] whitespace-nowrap">jet.ng/join/metro-express</p>
                  </BackgroundImage6>
                  <div className="relative shrink-0 size-[10px]" data-name="Icon">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
                      <g clipPath="url(#clip0_64_3792)" id="Icon">
                        <path d={svgPaths.p4df4780} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.25" strokeWidth="0.833333" />
                        <path d={svgPaths.p16e6ff40} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.25" strokeWidth="0.833333" />
                      </g>
                      <defs>
                        <clipPath id="clip0_64_3792">
                          <rect fill="white" height="10" width="10" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
                <div className="absolute bg-[rgba(255,255,255,0.04)] content-stretch flex items-center justify-center left-[839px] px-[9.313px] py-px rounded-[16777200px] size-[32px] top-[9.5px]" data-name="Container">
                  <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.06)] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
                  <TextBackgroundImageAndText text="CO" />
                </div>
                <div className="absolute content-stretch flex gap-[6px] h-[28.398px] items-center left-[20px] px-[9px] py-px rounded-[12px] top-[11.3px] w-[110.094px]" data-name="Button">
                  <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[12px]" />
                  <BackgroundImage6 additionalClassNames="h-[14.398px]">
                    <p className="-translate-x-1/2 absolute font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[14.4px] left-[37.5px] text-[12px] text-center text-white top-[-0.5px] tracking-[-0.24px] whitespace-nowrap">Metro Lagos</p>
                  </BackgroundImage6>
                  <BackgroundImage additionalClassNames="relative shrink-0">
                    <path d="M3 4.5L6 7.5L9 4.5" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.25" />
                  </BackgroundImage>
                </div>
                <div className="absolute border border-[rgba(255,255,255,0.04)] border-solid left-[795px] rounded-[12px] size-[32px] top-[9.5px]" data-name="Button">
                  <IconBackgroundImage1 additionalClassNames="absolute left-[8px] top-[8px]">
                    <path d={svgPaths.p29efa600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.25" strokeWidth="1.16667" />
                    <path d={svgPaths.p3042bc80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.25" strokeWidth="1.16667" />
                  </IconBackgroundImage1>
                  <div className="absolute bg-[#d4183d] border-2 border-[#08080a] border-solid left-[24px] rounded-[16777200px] size-[8px] top-[-2px]" data-name="Text" />
                </div>
              </div>
            </div>
            <div className="flex-[1_0_0] min-h-px min-w-px relative w-[891px]" data-name="Container">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
                <div className="content-stretch flex flex-col h-[761px] items-start overflow-clip relative shrink-0 w-full" data-name="FleetDrivers">
                  <div className="h-[156.398px] relative shrink-0 w-[891px]" data-name="Container">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start pt-[20px] px-[20px] relative size-full">
                      <div className="content-stretch flex gap-[10px] h-[76.398px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
                        <BackgroundImage6 additionalClassNames="h-[72.398px] rounded-[16px]">
                          <div className="absolute h-[24px] left-[12px] top-[13px] w-[179.75px]" data-name="KPITile">
                            <p className="absolute font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[24px] left-0 text-[20px] text-[rgba(255,255,255,0.7)] top-[-0.5px] tracking-[-0.6px] whitespace-nowrap">5</p>
                          </div>
                          <p className="absolute font-['Manrope:Regular',sans-serif] leading-[15px] left-[12px] not-italic text-[10px] text-[rgba(255,255,255,0.7)] top-[43.5px] tracking-[-0.2px] whitespace-nowrap">Total Drivers</p>
                        </BackgroundImage6>
                        <BackgroundImage4 additionalClassNames="h-[72.398px]">
                          <KpiTileBackgroundImageAndText text="2" />
                          <p className="absolute font-['Manrope:Regular',sans-serif] leading-[15px] left-[13px] not-italic text-[10px] text-[rgba(255,255,255,0.35)] top-[43.5px] tracking-[-0.2px] whitespace-nowrap">Online</p>
                        </BackgroundImage4>
                        <ButtonBackgroundImageAndText text="On Trip" />
                        <ButtonBackgroundImageAndText text="Pipeline" />
                      </div>
                      <div className="content-stretch flex gap-[4px] h-[32px] items-center relative shrink-0 w-full" data-name="Container">
                        <div className="flex-[1_0_0] h-[29.398px] min-h-px min-w-px relative" data-name="Container">
                          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center overflow-clip relative rounded-[inherit] size-full">
                            <div className="bg-[rgba(29,185,84,0.07)] h-[29.398px] relative rounded-[12px] shrink-0 w-[50.492px]" data-name="FilterPill">
                              <div aria-hidden="true" className="absolute border border-[rgba(29,185,84,0.14)] border-solid inset-0 pointer-events-none rounded-[12px]" />
                              <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                                <p className="-translate-x-1/2 absolute font-['Manrope:Medium',sans-serif] leading-[15.4px] left-[20px] not-italic text-[#1db954] text-[11px] text-center top-[7px] tracking-[-0.22px] whitespace-nowrap">{`All `}</p>
                                <div className="absolute content-stretch flex h-[15px] items-start left-[26.91px] opacity-70 top-[7px] w-[10.578px]" data-name="Text">
                                  <p className="font-['Manrope:Medium',sans-serif] leading-[15.4px] not-italic relative shrink-0 text-[#1db954] text-[11px] text-center tracking-[-0.22px] whitespace-nowrap">· 5</p>
                                </div>
                              </div>
                            </div>
                            <BackgroundImage8 additionalClassNames="h-[29.398px] w-[70.492px]">
                              <p className="-translate-x-1/2 absolute font-['Manrope:Medium',sans-serif] leading-[15.4px] left-[30px] not-italic text-[11px] text-[rgba(255,255,255,0.35)] text-center top-[7px] tracking-[-0.22px] whitespace-nowrap">{`Online `}</p>
                              <TextBackgroundImageAndText1 text="· 2" additionalClassNames="left-[46.94px] w-[10.555px]" />
                            </BackgroundImage8>
                            <BackgroundImage8 additionalClassNames="h-[29.398px] w-[71.5px]">
                              <p className="-translate-x-1/2 absolute font-['Manrope:Medium',sans-serif] leading-[15.4px] left-[31.5px] not-italic text-[11px] text-[rgba(255,255,255,0.35)] text-center top-[7px] tracking-[-0.22px] whitespace-nowrap">{`On Trip `}</p>
                              <TextBackgroundImageAndText1 text="· 1" additionalClassNames="left-[49.84px] w-[8.656px]" />
                            </BackgroundImage8>
                            <BackgroundImage8 additionalClassNames="h-[29.398px] w-[71.766px]">
                              <p className="-translate-x-1/2 absolute font-['Manrope:Medium',sans-serif] leading-[15.4px] left-[31px] not-italic text-[11px] text-[rgba(255,255,255,0.35)] text-center top-[7px] tracking-[-0.22px] whitespace-nowrap">{`Offline `}</p>
                              <TextBackgroundImageAndText1 text="· 2" additionalClassNames="left-[48.21px] w-[10.555px]" />
                            </BackgroundImage8>
                            <BackgroundImage8 additionalClassNames="h-[29.398px] w-[76.055px]">
                              <p className="-translate-x-1/2 absolute font-['Manrope:Medium',sans-serif] leading-[15.4px] left-[34px] not-italic text-[11px] text-[rgba(255,255,255,0.35)] text-center top-[7px] tracking-[-0.22px] whitespace-nowrap">{`Pipeline `}</p>
                              <TextBackgroundImageAndText1 text="· 1" additionalClassNames="left-[54.4px] w-[8.656px]" />
                            </BackgroundImage8>
                          </div>
                        </div>
                        <div className="relative rounded-[12px] shrink-0 size-[32px]" data-name="Button">
                          <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[12px]" />
                          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px pt-[9px] px-[9px] relative size-full">
                            <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
                              <div className="absolute inset-[12.5%_20.83%_20.83%_12.5%]" data-name="Vector">
                                <div className="absolute inset-[-6.25%]">
                                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                                    <path d={svgPaths.p30c27980} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="1.16667" />
                                  </svg>
                                </div>
                              </div>
                              <div className="absolute inset-[69.58%_12.5%_12.5%_69.58%]" data-name="Vector">
                                <div className="absolute inset-[-23.26%]">
                                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.675 3.675">
                                    <path d={svgPaths.p31a7b600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="1.16667" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <BackgroundImage8 additionalClassNames="size-[32px]">
                          <IconBackgroundImage1 additionalClassNames="absolute left-[9px] top-[9px]">
                            <path d="M12.25 2.33333H8.16667" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="1.16667" />
                            <path d="M5.83333 2.33333H1.75" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="1.16667" />
                            <path d="M12.25 7H7" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="1.16667" />
                            <path d="M4.66667 7H1.75" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="1.16667" />
                            <path d="M12.25 11.6667H9.33333" id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="1.16667" />
                            <path d="M7 11.6667H1.75" id="Vector_6" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="1.16667" />
                            <path d="M8.16667 1.16667V3.5" id="Vector_7" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="1.16667" />
                            <path d="M4.66667 5.83333V8.16667" id="Vector_8" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="1.16667" />
                            <path d="M9.33333 10.5V12.8333" id="Vector_9" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="1.16667" />
                          </IconBackgroundImage1>
                        </BackgroundImage8>
                      </div>
                    </div>
                  </div>
                  <div className="flex-[1_0_0] min-h-px min-w-px relative w-[891px]" data-name="Container">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start overflow-clip relative rounded-[inherit] size-full">
                      <BackgroundImage9 additionalClassNames="h-[604.602px]">
                        <div className="absolute content-stretch flex flex-col gap-[8px] h-[542.406px] items-start left-0 overflow-clip px-[20px] top-0 w-[891px]" data-name="Container">
                          <div className="bg-[rgba(255,255,255,0.03)] h-[67.797px] relative rounded-[16px] shrink-0 w-full" data-name="Button">
                            <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.04)] border-solid inset-0 pointer-events-none rounded-[16px]" />
                            <div className="absolute h-[37.797px] left-[15px] top-[15px] w-[821px]" data-name="DriverListCard">
                              <div className="absolute content-stretch flex flex-col gap-[2px] h-[33.797px] items-start left-[48px] top-[2px] w-[647.258px]" data-name="Container">
                                <div className="content-stretch flex gap-[8px] h-[16.797px] items-center relative shrink-0 w-full" data-name="Container">
                                  <TextBackgroundImageAndText2 text="Emeka Nwosu" additionalClassNames="w-[75.133px]" />
                                  <div className="bg-[rgba(29,185,84,0.07)] h-[15.594px] relative rounded-[4px] shrink-0 w-[32.938px]" data-name="Text">
                                    <div aria-hidden="true" className="absolute border border-[rgba(29,185,84,0.08)] border-solid inset-0 pointer-events-none rounded-[4px]" />
                                    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start px-[7px] py-[3px] relative size-full">
                                      <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[9.6px] relative shrink-0 text-[#1db954] text-[8px] tracking-[0.16px] whitespace-nowrap">LIVE</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="h-[15px] relative shrink-0 w-full" data-name="Container">
                                  <TextBackgroundImageAndText3 text="Toyota Camry · LND-284EP" additionalClassNames="w-[116.906px]" />
                                  <TextBackgroundImageAndText4 text="·" additionalClassNames="left-[122.91px]" />
                                  <div className="absolute h-[15px] left-[142.98px] top-0 w-[29.641px]" data-name="Text">
                                    <p className="absolute font-['Manrope:Regular',sans-serif] leading-[15px] left-0 not-italic text-[#1db954] text-[10px] top-[0.5px] tracking-[-0.2px] whitespace-nowrap">On trip</p>
                                  </div>
                                  <div className="absolute left-[130.98px] size-[6px] top-[4.5px]" data-name="StatusDot">
                                    <div className="absolute bg-[#1db954] left-[-2.97px] opacity-0 rounded-[16777200px] size-[11.942px] top-[-2.97px]" data-name="Text" />
                                    <div className="absolute bg-[#1db954] left-0 rounded-[16777200px] size-[6px] top-0" data-name="Text" />
                                  </div>
                                </div>
                              </div>
                              <div className="absolute content-stretch flex gap-[10px] h-[37.797px] items-center left-[707.26px] top-0 w-[113.742px]" data-name="Container">
                                <SparklineBackgroundImage>
                                  <g clipPath="url(#clip0_64_3765)" id="Sparkline">
                                    <path d={svgPaths.p1dfcf300} fill="var(--fill-0, #1DB954)" id="Vector" opacity="0.15" />
                                    <path d={svgPaths.pd8262c0} id="Vector_2" stroke="var(--stroke-0, #1DB954)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_64_3765">
                                      <rect fill="white" height="16" width="40" />
                                    </clipPath>
                                  </defs>
                                </SparklineBackgroundImage>
                                <BackgroundImage6 additionalClassNames="h-[37.797px]">
                                  <TextBackgroundImageAndText5 text="₦45,200" additionalClassNames="w-[41.742px]" />
                                  <p className="-translate-x-full absolute font-['Manrope:Regular',sans-serif] leading-[13.5px] left-[42.44px] not-italic text-[9px] text-[rgba(255,255,255,0.25)] text-right top-[22.9px] tracking-[-0.18px] whitespace-nowrap">/week</p>
                                </BackgroundImage6>
                                <IconBackgroundImage />
                              </div>
                              <div className="absolute left-0 size-[36px] top-[0.9px]" data-name="DriverAvatar">
                                <div className="absolute content-stretch flex items-center justify-center left-0 px-[11.797px] py-px rounded-[16px] size-[36px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgba(29, 185, 84, 0.082) 0%, rgba(29, 185, 84, 0.02) 100%)" }}>
                                  <div aria-hidden="true" className="absolute border border-[rgba(29,185,84,0.13)] border-solid inset-0 pointer-events-none rounded-[16px]" />
                                  <BackgroundImage2 additionalClassNames="h-[14.109px] w-[12.406px]">
                                    <p className="font-['Manrope:Medium',sans-serif] leading-[14.112px] not-italic relative shrink-0 text-[#1db954] text-[10.08px] tracking-[-0.2016px] whitespace-nowrap">EN</p>
                                  </BackgroundImage2>
                                </div>
                                <div className="absolute left-[29px] size-[9px] top-[23.6px]" data-name="StatusDot">
                                  <div className="absolute bg-[#1db954] left-[-4.46px] opacity-0 rounded-[16777200px] size-[17.913px] top-[-4.46px]" data-name="Text" />
                                  <div className="absolute bg-[#1db954] left-0 rounded-[16777200px] size-[9px] top-0" data-name="Text" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-[rgba(255,255,255,0.03)] h-[67.797px] relative rounded-[16px] shrink-0 w-full" data-name="Button">
                            <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.04)] border-solid inset-0 pointer-events-none rounded-[16px]" />
                            <div className="absolute h-[37.797px] left-[15px] top-[15px] w-[821px]" data-name="DriverListCard">
                              <div className="absolute content-stretch flex flex-col gap-[2px] h-[33.797px] items-start left-[48px] top-[2px] w-[647.047px]" data-name="Container">
                                <div className="content-stretch flex h-[16.797px] items-center relative shrink-0 w-full" data-name="Container">
                                  <TextBackgroundImageAndText2 text="Adaeze Okoro" additionalClassNames="w-[74.852px]" />
                                </div>
                                <div className="h-[15px] relative shrink-0 w-full" data-name="Container">
                                  <TextBackgroundImageAndText3 text="BYD Seal · LND-291KA" additionalClassNames="w-[93.117px]" />
                                  <TextBackgroundImageAndText4 text="·" additionalClassNames="left-[99.12px]" />
                                  <TextBackgroundImageAndText6 text="Online" additionalClassNames="left-[119.19px]" />
                                  <div className="absolute left-[107.19px] size-[6px] top-[4.5px]" data-name="StatusDot">
                                    <div className="absolute bg-[#3b82f6] left-[-2.97px] opacity-0 rounded-[16777200px] size-[11.942px] top-[-2.97px]" data-name="Text" />
                                    <div className="absolute bg-[#3b82f6] left-0 rounded-[16777200px] size-[6px] top-0" data-name="Text" />
                                  </div>
                                </div>
                              </div>
                              <div className="absolute content-stretch flex gap-[10px] h-[37.797px] items-center left-[707.05px] top-0 w-[113.953px]" data-name="Container">
                                <SparklineBackgroundImage>
                                  <g clipPath="url(#clip0_64_3780)" id="Sparkline">
                                    <path d={svgPaths.p1dfcf300} fill="var(--fill-0, #3B82F6)" id="Vector" opacity="0.15" />
                                    <path d={svgPaths.pd8262c0} id="Vector_2" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_64_3780">
                                      <rect fill="white" height="16" width="40" />
                                    </clipPath>
                                  </defs>
                                </SparklineBackgroundImage>
                                <BackgroundImage6 additionalClassNames="h-[37.797px]">
                                  <TextBackgroundImageAndText5 text="₦38,900" additionalClassNames="w-[41.953px]" />
                                  <p className="-translate-x-full absolute font-['Manrope:Regular',sans-serif] leading-[13.5px] left-[42.65px] not-italic text-[9px] text-[rgba(255,255,255,0.25)] text-right top-[22.9px] tracking-[-0.18px] whitespace-nowrap">/week</p>
                                </BackgroundImage6>
                                <IconBackgroundImage />
                              </div>
                              <div className="absolute left-0 size-[36px] top-[0.9px]" data-name="DriverAvatar">
                                <ContainerBackgroundImage additionalClassNames="pl-[11.352px] pr-[11.359px]">
                                  <div aria-hidden="true" className="absolute border border-[rgba(59,130,246,0.13)] border-solid inset-0 pointer-events-none rounded-[16px]" />
                                  <TextBackgroundImageAndText7 text="AO" additionalClassNames="w-[13.289px]" />
                                </ContainerBackgroundImage>
                                <div className="absolute left-[29px] size-[9px] top-[23.6px]" data-name="StatusDot">
                                  <div className="absolute bg-[#3b82f6] left-[-4.46px] opacity-0 rounded-[16777200px] size-[17.913px] top-[-4.46px]" data-name="Text" />
                                  <div className="absolute bg-[#3b82f6] left-0 rounded-[16777200px] size-[9px] top-0" data-name="Text" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-[rgba(255,255,255,0.03)] h-[67.797px] relative rounded-[16px] shrink-0 w-full" data-name="Button">
                            <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.04)] border-solid inset-0 pointer-events-none rounded-[16px]" />
                            <div className="absolute h-[37.797px] left-[15px] top-[15px] w-[821px]" data-name="DriverListCard">
                              <div className="absolute content-stretch flex flex-col gap-[2px] h-[33.797px] items-start left-[48px] top-[2px] w-[649.797px]" data-name="Container">
                                <div className="content-stretch flex h-[16.797px] items-center relative shrink-0 w-full" data-name="Container">
                                  <TextBackgroundImageAndText2 text="Chioma Eze" additionalClassNames="w-[63.133px]" />
                                </div>
                                <div className="h-[15px] relative shrink-0 w-full" data-name="Container">
                                  <TextBackgroundImageAndText3 text="Toyota Corolla · LND-098HJ" additionalClassNames="w-[119.672px]" />
                                  <TextBackgroundImageAndText4 text="·" additionalClassNames="left-[125.67px]" />
                                  <TextBackgroundImageAndText6 text="Online" additionalClassNames="left-[145.74px]" />
                                  <div className="absolute left-[133.74px] size-[6px] top-[4.5px]" data-name="StatusDot">
                                    <div className="absolute bg-[#3b82f6] left-[-2.97px] opacity-0 rounded-[16777200px] size-[11.942px] top-[-2.97px]" data-name="Text" />
                                    <div className="absolute bg-[#3b82f6] left-0 rounded-[16777200px] size-[6px] top-0" data-name="Text" />
                                  </div>
                                </div>
                              </div>
                              <div className="absolute content-stretch flex gap-[10px] h-[37.797px] items-center left-[709.8px] top-0 w-[111.203px]" data-name="Container">
                                <BackgroundImage9 additionalClassNames="h-[16px]">
                                  <VectorBackgroundImage1>
                                    <path d={svgPaths.p269c6900} fill="var(--fill-0, #3B82F6)" id="Vector" opacity="0.15" />
                                  </VectorBackgroundImage1>
                                  <VectorBackgroundImage>
                                    <path d={svgPaths.p3583a440} id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                                  </VectorBackgroundImage>
                                </BackgroundImage9>
                                <BackgroundImage5 additionalClassNames="h-[37.797px] w-[39.203px]">
                                  <TextBackgroundImageAndText5 text="₦31,400" additionalClassNames="w-[39.203px]" />
                                  <p className="-translate-x-full absolute font-['Manrope:Regular',sans-serif] leading-[13.5px] left-[39.9px] not-italic text-[9px] text-[rgba(255,255,255,0.25)] text-right top-[22.9px] tracking-[-0.18px] whitespace-nowrap">/week</p>
                                </BackgroundImage5>
                                <IconBackgroundImage />
                              </div>
                              <div className="absolute left-0 size-[36px] top-[0.9px]" data-name="DriverAvatar">
                                <ContainerBackgroundImage additionalClassNames="px-[11.656px]">
                                  <div aria-hidden="true" className="absolute border border-[rgba(59,130,246,0.13)] border-solid inset-0 pointer-events-none rounded-[16px]" />
                                  <TextBackgroundImageAndText7 text="CE" additionalClassNames="w-[12.688px]" />
                                </ContainerBackgroundImage>
                                <div className="absolute left-[29px] size-[9px] top-[23.6px]" data-name="StatusDot">
                                  <div className="absolute bg-[#3b82f6] left-[-4.46px] opacity-0 rounded-[16777200px] size-[17.913px] top-[-4.46px]" data-name="Text" />
                                  <div className="absolute bg-[#3b82f6] left-0 rounded-[16777200px] size-[9px] top-0" data-name="Text" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-[rgba(255,255,255,0.03)] h-[67.797px] relative rounded-[16px] shrink-0 w-full" data-name="Button">
                            <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.04)] border-solid inset-0 pointer-events-none rounded-[16px]" />
                            <div className="absolute h-[37.797px] left-[15px] top-[15px] w-[821px]" data-name="DriverListCard">
                              <div className="absolute content-stretch flex flex-col gap-[2px] h-[33.797px] items-start left-[48px] top-[2px] w-[650.688px]" data-name="Container">
                                <div className="content-stretch flex h-[16.797px] items-center relative shrink-0 w-full" data-name="Container">
                                  <TextBackgroundImageAndText2 text="Tunde Adeyemi" additionalClassNames="w-[83.039px]" />
                                </div>
                                <div className="h-[15px] relative shrink-0 w-full" data-name="Container">
                                  <TextBackgroundImageAndText3 text="Honda Accord · LND-156BT" additionalClassNames="w-[116.703px]" />
                                  <TextBackgroundImageAndText4 text="·" additionalClassNames="left-[122.7px]" />
                                  <div className="absolute h-[15px] left-[142.77px] top-0 w-[29.5px]" data-name="Text">
                                    <p className="absolute font-['Manrope:Regular',sans-serif] leading-[15px] left-0 not-italic text-[#555560] text-[10px] top-[0.5px] tracking-[-0.2px] whitespace-nowrap">Offline</p>
                                  </div>
                                  <div className="absolute left-[130.77px] size-[6px] top-[4.5px]" data-name="StatusDot">
                                    <div className="absolute bg-[#555560] left-0 rounded-[16777200px] size-[6px] top-0" data-name="Text" />
                                  </div>
                                </div>
                              </div>
                              <div className="absolute content-stretch flex gap-[10px] h-[37.797px] items-center left-[710.69px] top-0 w-[110.313px]" data-name="Container">
                                <BackgroundImage9 additionalClassNames="h-[16px]">
                                  <VectorBackgroundImage1>
                                    <path d={svgPaths.p269c6900} fill="var(--fill-0, #555560)" id="Vector" opacity="0.15" />
                                  </VectorBackgroundImage1>
                                  <VectorBackgroundImage>
                                    <path d={svgPaths.p3583a440} id="Vector" stroke="var(--stroke-0, #555560)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                                  </VectorBackgroundImage>
                                </BackgroundImage9>
                                <BackgroundImage5 additionalClassNames="h-[37.797px] w-[38.313px]">
                                  <TextBackgroundImageAndText5 text="₦22,100" additionalClassNames="w-[38.313px]" />
                                  <p className="-translate-x-full absolute font-['Manrope:Regular',sans-serif] leading-[13.5px] left-[39.01px] not-italic text-[9px] text-[rgba(255,255,255,0.25)] text-right top-[22.9px] tracking-[-0.18px] whitespace-nowrap">/week</p>
                                </BackgroundImage5>
                                <IconBackgroundImage />
                              </div>
                              <div className="absolute left-0 size-[36px] top-[0.9px]" data-name="DriverAvatar">
                                <ContainerBackgroundImage1 additionalClassNames="pl-[12.016px] pr-[12.023px] size-[36px]">
                                  <div aria-hidden="true" className="absolute border border-[rgba(85,85,96,0.13)] border-solid inset-0 pointer-events-none rounded-[16px]" />
                                  <TextBackgroundImageAndText8 text="TA" additionalClassNames="w-[11.961px]" />
                                </ContainerBackgroundImage1>
                                <div className="absolute left-[29px] size-[9px] top-[23.6px]" data-name="StatusDot">
                                  <div className="absolute bg-[#555560] left-0 rounded-[16777200px] size-[9px] top-0" data-name="Text" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-[rgba(29,185,84,0.03)] h-[66px] relative rounded-[16px] shrink-0 w-full" data-name="Button">
                            <div aria-hidden="true" className="absolute border border-[rgba(29,185,84,0.13)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_0px_20px_0px_rgba(29,185,84,0.02)]" />
                            <div className="absolute h-[36px] left-[15px] top-[15px] w-[821px]" data-name="DriverListCard">
                              <div className="absolute content-stretch flex flex-col gap-[4px] h-[34.297px] items-start left-[48px] top-[0.85px] w-[749px]" data-name="Container">
                                <div className="content-stretch flex h-[16.797px] items-center relative shrink-0 w-full" data-name="Container">
                                  <TextBackgroundImageAndText2 text="Ibrahim Musa" additionalClassNames="w-[71.875px]" />
                                </div>
                                <div className="h-[13.5px] relative shrink-0 w-full" data-name="Container">
                                  <div className="flex flex-row items-center size-full">
                                    <div className="content-stretch flex gap-[8px] items-center pr-[622.469px] relative size-full">
                                      <div className="bg-[rgba(255,255,255,0.05)] flex-[1_0_0] h-[4px] min-h-px min-w-px relative rounded-[16777200px]" data-name="Container">
                                        <div className="overflow-clip rounded-[inherit] size-full">
                                          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pr-[25.602px] relative size-full">
                                            <div className="bg-[#f59e0b] h-[4px] rounded-[16777200px] shrink-0 w-full" data-name="Container" />
                                          </div>
                                        </div>
                                      </div>
                                      <BackgroundImage5 additionalClassNames="h-[13.5px] w-[54.531px]">
                                        <p className="absolute font-['Manrope:Regular',sans-serif] leading-[13.5px] left-0 not-italic text-[#f59e0b] text-[9px] top-[-0.5px] tracking-[-0.18px] whitespace-nowrap">Under Review</p>
                                      </BackgroundImage5>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="absolute content-stretch flex items-center left-[809px] size-[12px] top-[12px]" data-name="Container">
                                <BackgroundImage9 additionalClassNames="h-[12px]">
                                  <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4" data-name="Vector">
                                    <div className="absolute inset-[-8.33%_-16.67%]">
                                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 7">
                                        <path d="M0.5 6.5L3.5 3.5L0.5 0.5" id="Vector" stroke="var(--stroke-0, #1DB954)" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    </div>
                                  </div>
                                </BackgroundImage9>
                              </div>
                              <div className="absolute left-0 size-[36px] top-0" data-name="DriverAvatar">
                                <ContainerBackgroundImage1 additionalClassNames="pl-[12.68px] pr-[12.688px] size-[36px]">
                                  <div aria-hidden="true" className="absolute border border-[rgba(85,85,96,0.13)] border-solid inset-0 pointer-events-none rounded-[16px]" />
                                  <TextBackgroundImageAndText8 text="IM" additionalClassNames="w-[10.633px]" />
                                </ContainerBackgroundImage1>
                                <div className="absolute left-[29px] size-[9px] top-[23.6px]" data-name="StatusDot">
                                  <div className="absolute bg-[#555560] left-0 rounded-[16777200px] size-[9px] top-0" data-name="Text" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="absolute bg-[#1db954] h-[42.195px] left-[20px] rounded-[16px] top-[542.41px] w-[851px]" data-name="Button">
                          <IconBackgroundImage1 additionalClassNames="absolute left-[379.95px] top-[14.09px]">
                            <path d={svgPaths.p317fdd80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                            <path d={svgPaths.p31c78b80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                            <path d="M11.0833 4.66667V8.16667" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                            <path d="M12.8333 6.41667H9.33333" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                          </IconBackgroundImage1>
                          <p className="-translate-x-1/2 absolute font-['Manrope:Medium',sans-serif] leading-[18.2px] left-[436.95px] not-italic text-[13px] text-center text-white top-[12px] tracking-[-0.26px] whitespace-nowrap">Invite Driver</p>
                        </div>
                      </BackgroundImage9>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bg-gradient-to-b content-stretch flex flex-col from-[rgba(255,255,255,0.02)] h-[813px] items-start left-0 pr-px to-[rgba(0,0,0,0)] top-0 w-[48px]" data-name="Navigation">
            <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.04)] border-r border-solid inset-0 pointer-events-none" />
            <div className="h-[52px] relative shrink-0 w-[47px]" data-name="FleetNavRail">
              <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.04)] border-b border-solid inset-0 pointer-events-none" />
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pb-px pl-[10px] relative size-full">
                <div className="relative rounded-[12px] shrink-0 size-[28px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgba(29, 185, 84, 0.094) 0%, rgba(29, 185, 84, 0.024) 100%)" }}>
                  <div aria-hidden="true" className="absolute border border-[rgba(29,185,84,0.07)] border-solid inset-0 pointer-events-none rounded-[12px]" />
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pl-[11.445px] pr-[11.453px] py-px relative size-full">
                    <BackgroundImage5 additionalClassNames="h-[15px] w-[5.102px]">
                      <p className="absolute font-['Montserrat:Bold',sans-serif] font-bold leading-[15px] left-0 text-[#1db954] text-[10px] top-[0.5px] tracking-[-0.32px] whitespace-nowrap">J</p>
                    </BackgroundImage5>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-[1_0_0] min-h-px min-w-px relative w-[47px]" data-name="FleetNavRail">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start pt-[8px] px-[6px] relative size-full">
                <ButtonBackgroundImage>
                  <IconBackgroundImage2>
                    <path d={svgPaths.pff0fc00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.25" strokeWidth="1.33333" />
                    <path d={svgPaths.p1d76d410} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.25" strokeWidth="1.33333" />
                    <path d={svgPaths.p2f091200} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.25" strokeWidth="1.33333" />
                    <path d={svgPaths.p39897300} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.25" strokeWidth="1.33333" />
                  </IconBackgroundImage2>
                </ButtonBackgroundImage>
                <ButtonBackgroundImage additionalClassNames="bg-[rgba(29,185,84,0.03)]">
                  <IconBackgroundImage2>
                    <path d={svgPaths.p32887f80} id="Vector" stroke="var(--stroke-0, #1DB954)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    <path d={svgPaths.p3694d280} id="Vector_2" stroke="var(--stroke-0, #1DB954)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    <path d={svgPaths.p1f197700} id="Vector_3" stroke="var(--stroke-0, #1DB954)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    <path d={svgPaths.p3bf3e100} id="Vector_4" stroke="var(--stroke-0, #1DB954)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  </IconBackgroundImage2>
                </ButtonBackgroundImage>
                <ButtonBackgroundImage>
                  <IconBackgroundImage2>
                    <path d={svgPaths.p270c3400} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.25" strokeWidth="1.33333" />
                    <path d={svgPaths.p90de340} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.25" strokeWidth="1.33333" />
                    <path d="M6 11.3333H10" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.25" strokeWidth="1.33333" />
                    <path d={svgPaths.p38e3c580} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.25" strokeWidth="1.33333" />
                  </IconBackgroundImage2>
                </ButtonBackgroundImage>
                <ButtonBackgroundImage>
                  <IconBackgroundImage2>
                    <path d={svgPaths.p2949e900} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.25" strokeWidth="1.33333" />
                    <path d={svgPaths.p22e64900} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.25" strokeWidth="1.33333" />
                  </IconBackgroundImage2>
                </ButtonBackgroundImage>
                <ButtonBackgroundImage>
                  <IconBackgroundImage2>
                    <path d={svgPaths.p2338cf00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.25" strokeWidth="1.33333" />
                    <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.25" strokeWidth="1.33333" />
                  </IconBackgroundImage2>
                </ButtonBackgroundImage>
              </div>
            </div>
            <div className="h-[53px] relative shrink-0 w-[47px]" data-name="FleetNavRail">
              <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.04)] border-solid border-t inset-0 pointer-events-none" />
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pt-px px-[9.5px] relative size-full">
                <div className="bg-[rgba(255,255,255,0.04)] relative rounded-[16777200px] shrink-0 size-[28px]" data-name="Container">
                  <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.06)] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[7.313px] py-px relative size-full">
                    <TextBackgroundImageAndText text="CO" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute h-[813px] left-0 top-0 w-[939px]" data-name="AtmosphericBg">
        <div className="absolute h-[325.195px] left-[93.9px] top-[487.8px] w-[751.195px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 751.2 325.2\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0 -22.995 -53.118 0 375.6 162.6)\\'><stop stop-color=\\'rgba(29,185,84,0.024)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(0,0,0,0)\\' offset=\\'0.7\\'/></radialGradient></defs></svg>')" }} />
        <div className="absolute h-[406.5px] left-[469.5px] top-0 w-[469.5px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 469.5 406.5\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0 -57.488 -66.397 0 469.5 0)\\'><stop stop-color=\\'rgba(59,130,246,0.016)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(0,0,0,0)\\' offset=\\'0.7\\'/></radialGradient></defs></svg>')" }} />
      </div>
      <div className="absolute h-[813px] left-0 top-0 w-[939px]" data-name="Container">
        <div className="absolute bg-[rgba(0,0,0,0.6)] h-[813px] left-0 top-0 w-[939px]" data-name="FleetDrivers" />
        <div className="absolute bg-[#111113] h-[691.047px] left-0 rounded-tl-[16px] rounded-tr-[16px] top-[121.95px] w-[939px]" data-name="Container">
          <div className="content-stretch flex flex-col items-start overflow-clip pt-px relative rounded-[inherit] size-full">
            <div className="h-[24px] relative shrink-0 w-full" data-name="FleetDrivers">
              <div className="flex flex-row justify-center size-full">
                <div className="content-stretch flex items-start justify-center pt-[10px] px-[451.5px] relative size-full">
                  <div className="bg-[rgba(255,255,255,0.1)] h-[4px] rounded-[16777200px] shrink-0 w-[36px]" data-name="Container" />
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col h-[690.047px] items-start relative shrink-0 w-full" data-name="Container">
              <div className="h-[51px] relative shrink-0 w-[939px]" data-name="DriverDetailPanel">
                <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.04)] border-b border-solid inset-0 pointer-events-none" />
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-px px-[20px] relative size-full">
                  <BackgroundImage5 additionalClassNames="h-[18.195px] w-[93.586px]">
                    <p className="absolute font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[18.2px] left-0 text-[14px] text-white top-[0.5px] tracking-[-0.28px] whitespace-nowrap">Driver Details</p>
                  </BackgroundImage5>
                  <div className="bg-[rgba(255,255,255,0.03)] relative rounded-[12px] shrink-0 size-[26px]" data-name="Button">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[6px] px-[6px] relative size-full">
                      <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
                        <Icon16VectorBackgroundImage>
                          <path d={svgPaths.p755a300} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="1.16667" />
                        </Icon16VectorBackgroundImage>
                        <Icon16VectorBackgroundImage>
                          <path d={svgPaths.p4618fa0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="1.16667" />
                        </Icon16VectorBackgroundImage>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-[1_0_0] min-h-px min-w-px relative w-[939px]" data-name="DriverDetailPanel">
                <div className="overflow-clip rounded-[inherit] size-full">
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start pt-[20px] px-[20px] relative size-full">
                    <div className="h-[65.297px] relative shrink-0 w-full" data-name="Container">
                      <div className="absolute h-[65.297px] left-[62px] top-0 w-[837px]" data-name="Container">
                        <div className="absolute h-[20.797px] left-0 top-0 w-[837px]" data-name="Text">
                          <p className="absolute font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[20.8px] left-0 text-[16px] text-white top-[0.5px] tracking-[-0.32px] whitespace-nowrap">Ibrahim Musa</p>
                        </div>
                        <div className="absolute h-[16.5px] left-0 top-[24.8px] w-[837px]" data-name="Container">
                          <div className="absolute h-[16.5px] left-[15px] top-0 w-[32.445px]" data-name="Text">
                            <p className="absolute font-['Manrope:Regular',sans-serif] leading-[16.5px] left-0 not-italic text-[#555560] text-[11px] top-[0.5px] tracking-[-0.22px] whitespace-nowrap">Offline</p>
                          </div>
                          <div className="absolute left-0 size-[7px] top-[4.75px]" data-name="StatusDot">
                            <div className="absolute bg-[#555560] left-0 rounded-[16777200px] size-[7px] top-0" data-name="Text" />
                          </div>
                        </div>
                        <p className="absolute font-['Manrope:Regular',sans-serif] leading-[15px] left-0 not-italic text-[10px] text-[rgba(255,255,255,0.25)] top-[47.8px] tracking-[-0.2px] whitespace-nowrap">Joined 2026-03-10</p>
                      </div>
                      <div className="absolute left-0 size-[48px] top-0" data-name="DriverAvatar">
                        <ContainerBackgroundImage1 additionalClassNames="pl-[16.906px] pr-[16.914px] size-[48px]">
                          <div aria-hidden="true" className="absolute border border-[rgba(85,85,96,0.13)] border-solid inset-0 pointer-events-none rounded-[16px]" />
                          <BackgroundImage2 additionalClassNames="h-[18.813px] w-[14.18px]">
                            <p className="font-['Manrope:Medium',sans-serif] leading-[18.816px] not-italic relative shrink-0 text-[#555560] text-[13.44px] tracking-[-0.2688px] whitespace-nowrap">IM</p>
                          </BackgroundImage2>
                        </ContainerBackgroundImage1>
                        <div className="absolute left-[38px] size-[12px] top-[32px]" data-name="StatusDot">
                          <div className="absolute bg-[#555560] left-0 rounded-[16777200px] size-[12px] top-0" data-name="Text" />
                        </div>
                      </div>
                    </div>
                    <div className="content-stretch flex gap-[8px] h-[37.398px] items-start relative shrink-0 w-full" data-name="Container">
                      <BackgroundImage4 additionalClassNames="h-[37.398px]">
                        <BackgroundImage1 additionalClassNames="absolute left-[204.38px] top-[12.7px]">
                          <g clipPath="url(#clip0_64_3706)" id="Icon">
                            <path d={svgPaths.p32bcae00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" />
                          </g>
                          <defs>
                            <clipPath id="clip0_64_3706">
                              <rect fill="white" height="12" width="12" />
                            </clipPath>
                          </defs>
                        </BackgroundImage1>
                        <p className="-translate-x-1/2 absolute font-['Manrope:Medium',sans-serif] leading-[15.4px] left-[231.88px] not-italic text-[11px] text-[rgba(255,255,255,0.7)] text-center top-[11px] tracking-[-0.22px] whitespace-nowrap">{` Call`}</p>
                      </BackgroundImage4>
                      <BackgroundImage4 additionalClassNames="h-[37.398px]">
                        <BackgroundImage1 additionalClassNames="absolute left-[191.14px] top-[12.7px]">
                          <g clipPath="url(#clip0_64_3703)" id="Icon">
                            <path d={svgPaths.p120b6600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" />
                          </g>
                          <defs>
                            <clipPath id="clip0_64_3703">
                              <rect fill="white" height="12" width="12" />
                            </clipPath>
                          </defs>
                        </BackgroundImage1>
                        <p className="-translate-x-1/2 absolute font-['Manrope:Medium',sans-serif] leading-[15.4px] left-[232.14px] not-italic text-[11px] text-[rgba(255,255,255,0.7)] text-center top-[11px] tracking-[-0.22px] whitespace-nowrap">{` Message`}</p>
                      </BackgroundImage4>
                    </div>
                    <div className="content-stretch flex flex-col gap-[12px] h-[193.188px] items-start pt-[17px] relative shrink-0 w-full" data-name="Container">
                      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.04)] border-solid border-t inset-0 pointer-events-none" />
                      <TextBackgroundImageAndText9 text="VERIFICATION STATUS" />
                      <div className="bg-[rgba(245,158,11,0.02)] h-[100.797px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
                        <div aria-hidden="true" className="absolute border border-[rgba(245,158,11,0.07)] border-solid inset-0 pointer-events-none rounded-[16px]" />
                        <div className="absolute content-stretch flex gap-[8px] h-[16.797px] items-center left-[17px] top-[17px] w-[865px]" data-name="Container">
                          <IconBackgroundImage1 additionalClassNames="relative shrink-0">
                            <path d={svgPaths.pd04fc00} id="Vector" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                          </IconBackgroundImage1>
                          <BackgroundImage2 additionalClassNames="h-[16.797px] w-[73.977px]">
                            <p className="font-['Manrope:Medium',sans-serif] leading-[16.8px] not-italic relative shrink-0 text-[#f59e0b] text-[12px] tracking-[-0.24px] whitespace-nowrap">Under Review</p>
                          </BackgroundImage2>
                        </div>
                        <div className="absolute bg-[rgba(255,255,255,0.05)] content-stretch flex flex-col h-[6px] items-start left-[17px] overflow-clip pr-[346px] rounded-[16777200px] top-[45.8px] w-[865px]" data-name="Container">
                          <div className="bg-[#f59e0b] h-[6px] rounded-[16777200px] shrink-0 w-full" data-name="Container" />
                        </div>
                        <p className="absolute font-['Manrope:Regular',sans-serif] leading-[15px] left-[17px] not-italic text-[10px] text-[rgba(255,255,255,0.35)] top-[66.3px] tracking-[-0.2px] whitespace-nowrap">60% complete</p>
                      </div>
                      <div className="bg-[rgba(245,158,11,0.07)] h-[38.797px] relative rounded-[16px] shrink-0 w-full" data-name="Button">
                        <div aria-hidden="true" className="absolute border border-[rgba(245,158,11,0.09)] border-solid inset-0 pointer-events-none rounded-[16px]" />
                        <BackgroundImage additionalClassNames="absolute left-[398.46px] top-[13.4px]">
                          <path d={svgPaths.pcd45380} id="Vector" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" />
                          <path d={svgPaths.p9deeb00} id="Vector_2" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" />
                        </BackgroundImage>
                        <p className="-translate-x-1/2 absolute font-['Manrope:Medium',sans-serif] leading-[16.8px] left-[459.96px] not-italic text-[#f59e0b] text-[12px] text-center top-[11px] tracking-[-0.24px] whitespace-nowrap">Send Reminder</p>
                      </div>
                    </div>
                    <div className="h-[127.492px] relative shrink-0 w-full" data-name="Container">
                      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.04)] border-solid border-t inset-0 pointer-events-none" />
                      <div className="absolute content-stretch flex h-[12.594px] items-start left-0 top-[17px] w-[899px]" data-name="Text">
                        <p className="flex-[1_0_0] font-['Manrope:Medium',sans-serif] leading-[12.6px] min-h-px min-w-px not-italic relative text-[9px] text-[rgba(255,255,255,0.25)] tracking-[0.54px] uppercase">VEHICLE</p>
                      </div>
                      <div className="absolute bg-[rgba(245,158,11,0.02)] content-stretch flex gap-[8px] h-[42.5px] items-center left-0 pl-[13px] pr-px py-px rounded-[16px] top-[41.59px] w-[899px]" data-name="Container">
                        <div aria-hidden="true" className="absolute border border-[rgba(245,158,11,0.06)] border-solid inset-0 pointer-events-none rounded-[16px]" />
                        <IconBackgroundImage1 additionalClassNames="relative shrink-0">
                          <path d={svgPaths.p1767cf80} id="Vector" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                          <path d={svgPaths.p265dcb80} id="Vector_2" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                          <path d="M5.25 9.91667H8.75" id="Vector_3" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                          <path d={svgPaths.p1b716100} id="Vector_4" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                        </IconBackgroundImage1>
                        <BackgroundImage5 additionalClassNames="h-[16.5px] w-[96.266px]">
                          <p className="absolute font-['Manrope:Regular',sans-serif] leading-[16.5px] left-0 not-italic text-[#f59e0b] text-[11px] top-[0.5px] tracking-[-0.22px] whitespace-nowrap">No vehicle assigned</p>
                        </BackgroundImage5>
                      </div>
                      <div className="absolute bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.04)] border-solid h-[33.398px] left-0 rounded-[16px] top-[94.09px] w-[899px]" data-name="Button">
                        <div className="absolute left-[403.43px] size-[11px] top-[10.2px]" data-name="Icon">
                          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
                            <g id="Icon">
                              <path d={svgPaths.p25b4b700} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" strokeWidth="0.916667" />
                              <path d={svgPaths.pe156380} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" strokeWidth="0.916667" />
                            </g>
                          </svg>
                        </div>
                        <p className="-translate-x-1/2 absolute font-['Manrope:Medium',sans-serif] leading-[15.4px] left-[458.43px] not-italic text-[11px] text-[rgba(255,255,255,0.7)] text-center top-[8px] tracking-[-0.22px] whitespace-nowrap">Assign Vehicle</p>
                      </div>
                    </div>
                    <div className="content-stretch flex flex-col gap-[12px] h-[179.984px] items-start pt-[17px] relative shrink-0 w-full" data-name="Container">
                      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.04)] border-solid border-t inset-0 pointer-events-none" />
                      <TextBackgroundImageAndText9 text="ACTIONS" />
                      <div className="content-stretch flex flex-col gap-[8px] h-[138.391px] items-start relative shrink-0 w-full" data-name="Container">
                        <div className="bg-[rgba(255,255,255,0.03)] h-[65.195px] relative rounded-[16px] shrink-0 w-full" data-name="Button">
                          <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.04)] border-solid inset-0 pointer-events-none rounded-[16px]" />
                          <BackgroundImage10>
                            <IconBackgroundImage1 additionalClassNames="relative shrink-0">
                              <path d={svgPaths.p25182e80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.35" strokeWidth="1.16667" />
                              <path d="M1.75 1.75V4.66667H4.66667" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.35" strokeWidth="1.16667" />
                              <path d="M7 4.08333V7L9.33333 8.16667" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.35" strokeWidth="1.16667" />
                            </IconBackgroundImage1>
                            <BackgroundImage5 additionalClassNames="h-[39.195px] w-[110.484px]">
                              <div className="absolute content-stretch flex h-[16.797px] items-start left-0 top-0 w-[110.484px]" data-name="Text">
                                <p className="flex-[1_0_0] font-['Manrope:Medium',sans-serif] leading-[16.8px] min-h-px min-w-px not-italic relative text-[12px] text-white tracking-[-0.24px]">View Full History</p>
                              </div>
                              <p className="absolute font-['Manrope:Regular',sans-serif] leading-[15px] left-0 not-italic text-[10px] text-[rgba(255,255,255,0.35)] top-[23.3px] tracking-[-0.2px] whitespace-nowrap">All trips, earnings, ratings</p>
                            </BackgroundImage5>
                          </BackgroundImage10>
                        </div>
                        <div className="bg-[rgba(212,24,61,0.02)] h-[65.195px] relative rounded-[16px] shrink-0 w-full" data-name="Button">
                          <div aria-hidden="true" className="absolute border border-[rgba(212,24,61,0.03)] border-solid inset-0 pointer-events-none rounded-[16px]" />
                          <BackgroundImage10>
                            <IconBackgroundImage1 additionalClassNames="relative shrink-0">
                              <path d={svgPaths.p3ba1200} id="Vector" stroke="var(--stroke-0, #D4183D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                              <path d="M7 5.25V7.58333" id="Vector_2" stroke="var(--stroke-0, #D4183D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                              <path d="M7 9.91667H7.00583" id="Vector_3" stroke="var(--stroke-0, #D4183D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                            </IconBackgroundImage1>
                            <BackgroundImage5 additionalClassNames="h-[39.195px] w-[149.086px]">
                              <div className="absolute content-stretch flex h-[16.797px] items-start left-0 top-0 w-[149.086px]" data-name="Text">
                                <p className="flex-[1_0_0] font-['Manrope:Medium',sans-serif] leading-[16.8px] min-h-px min-w-px not-italic relative text-[#d4183d] text-[12px] tracking-[-0.24px]">Suspend Driver</p>
                              </div>
                              <p className="absolute font-['Manrope:Regular',sans-serif] leading-[15px] left-0 not-italic text-[10px] text-[rgba(255,255,255,0.35)] top-[23.3px] tracking-[-0.2px] whitespace-nowrap">Temporarily remove from dispatch</p>
                            </BackgroundImage5>
                          </BackgroundImage10>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.04)] border-solid border-t inset-0 pointer-events-none rounded-tl-[16px] rounded-tr-[16px]" />
        </div>
      </div>
      <div className="absolute bg-[rgba(12,12,14,0.9)] content-stretch flex gap-[2px] h-[46.398px] items-center left-[323.15px] px-[5px] py-px rounded-[16px] top-[746.6px] w-[292.703px]" data-name="JourneyToggle">
        <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_8px_40px_0px_rgba(0,0,0,0.5)]" />
        <BackgroundImage5 additionalClassNames="h-[9.594px] w-[75.547px]">
          <div className="absolute content-stretch flex h-[9.594px] items-start left-[22px] top-0 w-[43.547px]" data-name="Text">
            <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[9.6px] relative shrink-0 text-[8px] text-[rgba(255,255,255,0.35)] tracking-[0.48px] whitespace-nowrap">JOURNEY</p>
          </div>
          <div className="absolute left-[10px] size-[6px] top-[1.8px]" data-name="StatusDot">
            <div className="absolute bg-[#f59e0b] left-[-2.97px] opacity-0 rounded-[16777200px] size-[11.942px] top-[-2.97px]" data-name="Text" />
            <div className="absolute bg-[#f59e0b] left-0 rounded-[16777200px] size-[6px] top-0" data-name="Text" />
          </div>
        </BackgroundImage5>
        <ButtonBackgroundImage1 additionalClassNames="flex-[1_0_0] min-h-px min-w-px">
          <p className="-translate-x-1/2 absolute font-['Montserrat:Medium',sans-serif] font-medium leading-[12px] left-[43px] text-[10px] text-[rgba(255,255,255,0.25)] text-center top-[14.5px] tracking-[-0.2px] whitespace-nowrap">Onboarding</p>
        </ButtonBackgroundImage1>
        <ButtonBackgroundImage1 additionalClassNames="shrink-0 w-[58.438px]">
          <p className="-translate-x-1/2 absolute font-['Montserrat:Medium',sans-serif] font-medium leading-[12px] left-[29.5px] text-[10px] text-[rgba(255,255,255,0.25)] text-center top-[14.5px] tracking-[-0.2px] whitespace-nowrap">Empty</p>
        </ButtonBackgroundImage1>
        <div className="h-[36.398px] relative rounded-[16px] shrink-0 w-[57.109px]" data-name="Button" style={{ backgroundImage: "linear-gradient(147.489deg, rgba(29, 185, 84, 0.08) 0%, rgba(29, 185, 84, 0.024) 100%)" }}>
          <div aria-hidden="true" className="absolute border border-[rgba(29,185,84,0.09)] border-solid inset-0 pointer-events-none rounded-[16px]" />
          <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
            <p className="-translate-x-1/2 absolute font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[12px] left-[29px] text-[#1db954] text-[10px] text-center top-[14.5px] tracking-[-0.2px] whitespace-nowrap">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}